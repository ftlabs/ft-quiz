"use strict";
const articleService = require("./lib/services/articleService");
const capiService = require("./lib/services/capi");
const imageService = require("./lib/services/image");
const redactedQuestion = require("./lib/questionTypes/redactedHeadline");

module.exports.ftlabsQuiz = async (event, context, callback) => {
  try {
    const articles = await articleService.get();
    // const redactedQuestions = await redactedQuestion.getQuestion(articles);
    let articleDetails = await Promise.all(
      articles.data.topArticleViews.map(article =>
        capiService.getArticle(article.key)
      )
    );

    articleDetails = articleDetails.map(article => {
      return article.mainImage && article.mainImage.members
        ? imageService.formatImageUrl(article.mainImage.members[0], 800)
        : process.env.FT_LOGO;
    });

    const response = {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: articleDetails,
        input: event
      })
    };
    callback(null, response);
  } catch (err) {
    console.error(err);
    callback(null, err);
  }
};
