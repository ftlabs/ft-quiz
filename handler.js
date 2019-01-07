"use strict";
const fs = require("fs");
const articleService = require("./lib/services/articleService");
const capiService = require("./lib/services/capi");
// const redactedQuestion = require("./lib/questionTypes/redactedHeadline");
// const emojiFace = require("./lib/questionTypes/emojiFace");
const { filterArticles } = require("./lib/services/filter");

const questions = fs.readdirSync("./lib/questionTypes").map(fileName => {
  const questionType = fileName.split(".")[0];
  return {
    questionType,
    file: require(`./lib/questionTypes/${questionType}`)
  };
});

module.exports.ftlabsQuiz = async (event, context, callback) => {
  console.log("query", event.queryStringParameters);
  console.log("questions", questions);

  try {
    let articles = await articleService.get();
    articles = filterArticles(articles.data.topArticleViews);
    let articleDetails = await Promise.all(
      articles.map(async article => {
        const capiData = await capiService.getArticle(article.key);
        return { capiData, lanternData: article };
      })
    );

    // const redactedQuestions = await questions[0].file.getQuestion(
    //   articleDetails
    // );

    // const emojiResults = await emojiFace.getQuestion(articleDetails);

    const results = await Promise.all(
      questions.map(
        async question => await question.file.getQuestion(articleDetails)
      )
    );

    const response = {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: results,
        input: event
      })
    };
    callback(null, response);
  } catch (err) {
    console.error(err);
    callback(null, err);
  }
};
