const AWS = require("aws-sdk");
const fetch = require("request-promise").defaults({ encoding: null });
const imageService = require("../services/image");

const rekognition = new AWS.Rekognition();

async function getQuestion(articles) {
  articles = articles.splice(10, 20);
  let results = await getCelebrityData(articles);
  results = filterArticles(results);
  results = sortArticles(results);
  return results;
}

function getCelebrityData(articles) {
  return Promise.all(
    articles.map(async articleDetails => {
      const url =
        articleDetails.mainImage && articleDetails.mainImage.members
          ? imageService.formatImageUrl(
              articleDetails.mainImage.members[0],
              1200
            )
          : process.env.FT_LOGO;

      const image = await fetch(url);
      const params = {
        Image: {
          Bytes: image.buffer
        }
      };
      const celebrityData = await rekognition
        .recognizeCelebrities(params)
        .promise();

      return { celebrityData, articleDetails };
    })
  );
}

function filterArticles(results) {
  return results.filter(data => data.celebrityData.CelebrityFaces.length !== 0);
}

function sortArticles(results) {
  return results.sort((a, b) => {
    a.celebrityData.CelebrityFaces.sort(
      (a, b => b.MatchConfidence - a.MatchConfidence)
    );

    b.celebrityData.CelebrityFaces.sort(
      (a, b => b.MatchConfidence - a.MatchConfidence)
    );

    return (
      b.celebrityData.CelebrityFaces[0].MatchConfidence -
      a.celebrityData.CelebrityFaces[0].MatchConfidence
    );
  });
}

module.exports = { getQuestion };
