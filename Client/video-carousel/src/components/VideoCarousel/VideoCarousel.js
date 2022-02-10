import './VideoCarousel.css';
import React from 'react';
import { Carousel } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import 'bootstrap/dist/css/bootstrap.css';

const VideoCarousel = ({ files }) => {
  return (
    <div className="App">
      <Carousel controls={files.length > 1}>
        {files.map((video) => {
          return (
            <Carousel.Item key={video.id}>
              <ReactPlayer
                url={video.src}
                width="100%"
                pip={true}
                controls={true}
                playing={true}
              />
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
};

export default VideoCarousel;
