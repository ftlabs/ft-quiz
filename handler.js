"use strict";
const fs = require("fs");
const articleService = require("./lib/services/articleService");
const capiService = require("./lib/services/capi");
const { filterArticles } = require("./lib/services/filter");

let questions = fs.readdirSync("./lib/questionTypes").map(fileName => {
  const questionType = fileName.split(".")[0];
  return {
    questionType,
    file: require(`./lib/questionTypes/${questionType}`)
  };
});

module.exports.ftlabsQuiz = async (event, context, callback) => {
  try {
    const queryStringParameters = event.queryStringParameters;
    if (queryStringParameters && queryStringParameters.questionTypes) {
      questions = questions.filter(question => {
        const questionType = queryStringParameters.questionTypes
          .split(",")
          .find(
            requestedQuestion => requestedQuestion === question.questionType
          );
        if (questionType) {
          return true;
        } else {
          console.error(
            "One of the inputted question types was invalid, it has been ignored"
          );
          return false;
        }
      });
    }

    let articles = await articleService.get();
    articles = filterArticles(articles.data.topArticleViews);
    let articleDetails = await Promise.all(
      articles.map(async article => {
        const capiData = await capiService.getArticle(article.key);
        return { capiData, lanternData: article };
      })
    );

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
