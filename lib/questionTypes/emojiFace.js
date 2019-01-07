const AWS = require("aws-sdk");
const fetch = require("request-promise").defaults({ encoding: null });
const imageService = require("../services/image");
const imageStorageService = require("../services/imageStorage");

const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();

async function getQuestion(articles) {
  articles = articles.splice(0, 50);
  let results = await getCelebrityData(articles);

  results = filterArticles(results);
  results = sortArticles(results);
  results = finalQualityFilter(results);

  imageResults = await uploadImage(results);

  //   add emoji to face (start with just adding square and save to s3)
  //   save to s3
  //   structure question

  results = results.map(result => {
    result.image = 1;
    return result;
  });

  return results;
}

function uploadImage(results) {
  return Promise.all(
    results.map(async result => {
      return imageStorageService.put({
        image: result.image,
        bucketName: process.env.CELEB_IMAGE_STORE,
        key: result.lanternData.key
      });
    })
  );
}

function finalQualityFilter(results) {
  return results
    .filter(result => {
      let celebrityAccurate = false;
      findCelebrity(result, () => {
        celebrityAccurate = true;
      });
      return celebrityAccurate;
    })
    .map(result => {
      let celebrityData;
      findCelebrity(result, celebrity => {
        celebrityData = celebrity;
      });
      result.celebrityData.CelebrityFaces = [celebrityData];
      return result;
    });
}

function findCelebrity(result, cb) {
  result.celebrityData.CelebrityFaces.forEach(celebrity => {
    if (
      result.lanternData.top_article_views.metadata.hits.hits[0]._source.primary_theme.includes(
        celebrity.Name
      )
    ) {
      cb(celebrity);
    }
  });
}

function getCelebrityData(articles) {
  return Promise.all(
    articles.map(async articleDetails => {
      let lanternData = articleDetails.lanternData;
      articleDetails = articleDetails.capiData;
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
      return {
        image,
        celebrityData,
        articleDetails,
        lanternData
      };
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
