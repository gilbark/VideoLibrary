require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

// Setup S3 config
const s3 = new S3({
  region: bucketRegion,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  signatureVersion: 'v4',
});

function uploadFile(file) {
  if (file) {
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename,
    };
    return s3.upload(uploadParams).promise();
  }
  return 'No file';
}
exports.uploadFile = uploadFile;

function getFileSignedUrl(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };
  return s3.getSignedUrl('getObject', downloadParams);
}
exports.getSignedUrl = getFileSignedUrl;

async function getAllVideos() {
  const videoPaths = [];
  const getParams = {
    Bucket: bucketName,
  };
  let result = await s3.listObjects(getParams).promise();
  if (!!result.Contents) {
    // If we have videos, get the signed urls for each of them
    result.Contents.forEach((file) => {
      videoPaths.push(getFileSignedUrl(file.Key));
    });
  }
  return videoPaths;
}
exports.getAllVideos = getAllVideos;
