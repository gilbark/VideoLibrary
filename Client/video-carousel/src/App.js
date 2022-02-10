import './App.css';
import VideoCarousel from './components/VideoCarousel/VideoCarousel';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ProgressBar } from 'react-bootstrap';

const instance = axios.create({
  baseURL: 'http://localhost:3001',
});

function App() {
  const inputFile = useRef(null);
  const [videos, setVideos] = useState([]);
  const [progress, setProgress] = useState();
  const [fetching, setFetching] = useState();

  useEffect(() => {
    let mounted = true;
    setFetching(true); // Rendering different elements accordingly to this
    getVideos().then((res) => {
      if (res.videos.length > 0) {
        // If we have any videos, we will map them to the carousel's needs and set the videos array
        const videosToSet = [];
        res.videos.forEach((video, i) => {
          videosToSet.push({
            id: i,
            src: video,
          });
        });
        if (mounted) {
          setVideos(videosToSet);
        }
      }
      setFetching(false);
    });
    return () => (mounted = false);
  }, []);

  async function uploadVideo(video) {
    const formData = new FormData();
    formData.append('video', video);
    const result = await instance.post('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (data) => {
        setProgress(Math.round((100 * data.loaded) / data.total));
      },
    });
    // Set progress to null after 3 seconds of getting a response to reset the progress bar
    setTimeout(() => setProgress(null), 3000);

    return result.data;
  }

  async function getVideos() {
    const result = await instance.get('/videos');

    return result.data;
  }

  function openFileUpload() {
    inputFile.current.click();
  }

  async function checkFile() {
    if (inputFile.current.files.length > 0) {
      // If a file was chosen, upload it
      let file = inputFile.current.files[0];
      const result = await uploadVideo(file);

      if (result) {
        // Once there is a response, set the videos array with the new video url
        setVideos([
          {
            id: videos.length,
            src: result.src,
          },
          ...videos,
        ]);
      }
    }
  }

  return (
    <div className="App">
      {videos.length > 0 ? (
        <VideoCarousel files={videos}></VideoCarousel>
      ) : (
        <div className="no-videos">
          <p>
            {!!progress && progress <= 100
              ? 'Uploading...'
              : fetching
              ? 'Loading videos...'
              : 'Use the upload button to add videos to your library'}
          </p>
        </div>
      )}
      <button
        type="button"
        className="btn btn-info"
        onClick={openFileUpload}
        disabled={!!progress && progress < 100}
      >
        Upload Videos
        <input
          type="file"
          id="file"
          accept="video/mp4,video/x-m4v,video/*"
          ref={inputFile}
          onChange={checkFile}
          style={{ display: 'none' }}
        />
      </button>
      {progress && (
        <ProgressBar
          animated
          variant="success"
          now={progress}
          label={`${progress}%`}
        />
      )}
    </div>
  );
}

export default App;
