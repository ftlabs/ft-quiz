const AWS = require("aws-sdk");
const fetch = require("request-promise").defaults({ encoding: null });
const imageService = require("../services/image");

const rekognition = new AWS.Rekognition();

async function getQuestion(articles) {
  articles = articles.splice(10, 20);

  let results = await Promise.all(
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

  //   sort by confidence get the most confident one in array

  results = results.sort((a, b) => {
    a.celebrityData.CelebrityFaces.sort(
      (a, b => a.MatchConfidence - b.MatchConfidence)
    );

    b.celebrityData.CelebrityFaces.sort(
      (a, b => a.MatchConfidence - b.MatchConfidence)
    );

    return (
      a.celebrityData.CelebrityFaces[0].MatchConfidence -
      b.celebrityData.CelebrityFaces[0].MatchConfidence
    );
  });

  return results;
}

module.exports = { getQuestion };
