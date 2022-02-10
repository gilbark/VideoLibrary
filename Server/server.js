// Setup express
const express = require('express');
var cors = require('cors');
const app = express();
// Setup upload requirements
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const utils = require('util');
const unlinkFile = utils.promisify(fs.unlink);
// Setup router actions
const { uploadFile, getSignedUrl, getAllVideos } = require('./s3');

app.use(cors());

app.get('/videos', async (req, res) => {
  const videos = await getAllVideos();
  res.send({ videos });
});

app.post('/videos', upload.single('video'), async (req, res) => {
  const file = req.file;
  const result = await uploadFile(file);
  await unlinkFile(file.path); // Remove file from the /uploads folder once done
  const signedUrl = getSignedUrl(result.Key);
  res.send({ src: signedUrl });
});

app.listen(3001);
