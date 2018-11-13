const AWS = require("aws-sdk");
const fetch = require("request-promise").defaults({ encoding: null });
const imageService = require("../services/image");

const rekognition = new AWS.Rekognition();

async function getQuestion(articles) {
  results = results.splice(0, 10);
  let articleDetails = articles.map(article => {
    return article.mainImage && article.mainImage.members
      ? imageService.formatImageUrl(article.mainImage.members[0], 1200)
      : process.env.FT_LOGO;
  });
  let results = await Promise.all(articleDetails.map(url => fetch(url)));

  const faceData = await Promise.all(
    results.map(image => {
      const params = {
        Image: {
          Bytes: image.buffer
        }
      };
      return rekognition.recognizeCelebrities(params).promise();
    })
  );

  return faceData;
}

module.exports = { getQuestion };
