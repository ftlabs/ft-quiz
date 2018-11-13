const AWS = require("aws-sdk");
const fetch = require('request-promise').defaults({ encoding: null });
const imageService = require("../services/image");


const rekognition = new AWS.Rekognition();

async function getQuestion(articles) {
    let articleDetails = articles.map(article => {
        return article.mainImage && article.mainImage.members
          ? imageService.formatImageUrl(article.mainImage.members[0], 900)
          : process.env.FT_LOGO;
      });
      let results = await Promise.all(articleDetails.map(url => fetch(url)))
    //   results = results.map(data => data.buffer()) 




    //   const faceData = await Promise.all(results.map(image => {
    //     const params = {
    //         Image: {
    //             Bytes: image
    //         },
    //         Attributes: ['ALL']
    //     };
    //     return rekognition.detectFaces(params).promise();
    //   }))
     const params = {
            Image: {
                Bytes: results[1].buffer
            }
        };
        return rekognition.recognizeCelebrities(params).promise();


    //   return faceData[0]
}



module.exports = { getQuestion };
