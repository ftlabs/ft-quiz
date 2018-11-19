const AWS = require("aws-sdk");
const s3 = new AWS.S3();

async function put({ image, bucketName, key }) {
  var params = {
    Body: image,
    Bucket: bucketName,
    Key: key
  };

  const eTag = await s3.putObject(params).promise();
  return eTag;
}

module.exports = { put };
