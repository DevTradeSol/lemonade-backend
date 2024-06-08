const config = require('../config/general').s3Config;
const AWS = require('aws-sdk');

const uploadFile = (file) => {

  const s3 = new AWS.S3({
    accessKeyId: config.accessKey,
    secretAccessKey: config.secretKey
  });

  return new Promise((resolve, reject) => {

    // Setting up S3 upload parameters
    const params = {
        Bucket: config.bucketName,
        Key: file.originalname,
        Body: file.buffer
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            console.log(err);
            reject(err);
        }
        resolve(data.Location);
    });
  });
};

module.exports = {
  uploadFile: uploadFile
}