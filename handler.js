"use strict";

const redactedQuestion = require("./lib/questionTypes/redactedHeadline");

module.exports.ftlabsQuiz = async (event, context, callback) => {
  try {
    const redactedQuestions = await redactedQuestion.getQuestion();

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: redactedQuestions,
        input: event
      })
    };
    callback(null, response);
  } catch (err) {
    console.error(err);
    callback(null, err);
  }
};
