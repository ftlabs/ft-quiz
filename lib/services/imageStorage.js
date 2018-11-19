async function put({ image, tableName, key }) {
  var params = {
    Body: image,
    Bucket: tableName,
    Key: key
  };

  const eTag = await s3.putObject(params).promise();
  return eTag;
}

module.exports = { put };
