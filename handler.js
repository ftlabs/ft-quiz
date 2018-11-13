"use strict";
const articleService = require("./lib/services/articleService");
const capiService = require("./lib/services/capi");
const redactedQuestion = require("./lib/questionTypes/redactedHeadline");
const emojiFace = require("./lib/questionTypes/emojiFace");
const { filterArticles } = require("./lib/services/filter");

module.exports.ftlabsQuiz = async (event, context, callback) => {
  try {
    let articles = await articleService.get();
    articles = filterArticles(articles.data.topArticleViews);
    // let articleDetails = await Promise.all(
    //   articles.data.topArticleViews.map(article =>
    //     capiService.getArticle(article.key)
    //   )
    // );
    const redactedQuestions = await redactedQuestion.getQuestion(articles);
    // const emojiResults = await emojiFace.getQuestion(articleDetails);

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
