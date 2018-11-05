"use strict";

const AWS = require("aws-sdk");
const redactedQuestion = require("./lib/questionTypes/redactedHeadline");
const comprehend = new AWS.Comprehend();

module.exports.ftlabsQuiz = async (event, context, callback) => {
  const lanternData = await redactedQuestion.getQuestion();
  console.log(lanternData);
  var params = {
    LanguageCode: "en" /* required */,
    Text:
      "Banksy painting ‘self-destructs’ on podium in auction prank" /* required */
  };
  try {
    const data = await comprehend.detectKeyPhrases(params).promise();
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: lanternData,
        input: event
      })
    };
    callback(null, response);
  } catch (err) {
    console.error(err);
    callback(null, err);
  }
};
