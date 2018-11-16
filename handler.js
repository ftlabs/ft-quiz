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
    let articleDetails = await Promise.all(
      articles.map(async article => {
        const capiData = await capiService.getArticle(article.key);
        return { capiData, lanternData: article };
      })
    );
    // const redactedQuestions = await redactedQuestion.getQuestion(
    //   articleDetails
    // );
    const emojiResults = await emojiFace.getQuestion(articleDetails);

    const response = {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: emojiResults,
        input: event
      })
    };
    callback(null, response);
  } catch (err) {
    console.error(err);
    callback(null, err);
  }
};
