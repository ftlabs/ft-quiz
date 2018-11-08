"use strict";

const redactedQuestion = require("./lib/questionTypes/redactedHeadline");
const articleService = require("./lib/services/articleService");

module.exports.ftlabsQuiz = async (event, context, callback) => {
  try {
    const articles = await articleService.get();
    const redactedQuestions = await redactedQuestion.getQuestion(articles);

    const response = {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
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
