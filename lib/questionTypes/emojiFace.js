const AWS = require("aws-sdk");
const request = require('request-promise').defaults({ encoding: null });
const imageService = require("../services/image");


const rekognition = new AWS.Rekognition();

async function getQuestion(articles) {
    let articleDetails = articles.map(article => {
        return article.mainImage && article.mainImage.members
          ? imageService.formatImageUrl(article.mainImage.members[0], 800)
          : process.env.FT_LOGO;
      });
      let results = await Promise.all(articleDetails.map(url => request(url)))
      results = results.map(data => Buffer.from(data).toString('base64')) 
      return results
}

module.exports = { getQuestion };
