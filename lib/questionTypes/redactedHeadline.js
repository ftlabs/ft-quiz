const AWS = require("aws-sdk");
const { lanternApiRequest } = require("../services/lantern");
const filteredThemes = require("../utils/filteredThemes");
const filteredSections = require("../utils/filteredSections");

const comprehend = new AWS.Comprehend();

async function getQuestion() {
  let dateFrom = new Date();
  let dateTo = new Date();
  dateFrom.setMonth(dateTo.getMonth() - 1);

  const queryString = {
    dateFrom,
    dateTo,
    size: "100"
  };

  let results = await lanternApiRequest("topArticles", queryString);
  results = JSON.parse(results);

  results = filterArticles(results.data.topArticleViews);

  var params = {
    LanguageCode: "en",
    TextList: results
  };
  results = results.splice(0, 25);
  results = await comprehend.batchDetectKeyPhrases(params).promise();

  return results;
}

function filterArticles(articles) {
  return articles
    .filter(article => {
      const metaData =
        article.top_article_views.metadata.hits.hits[0]["_source"];
      //  This is to filter out articles which are usually reference or speciality pages
      if (metaData.authors && metaData.authors.length > 3) return false;
      // Headlines with questions are usually not compatible
      const title = metaData.title_not_analyzed;
      if (
        (title && title.split("")[title.length - 1] === "?") ||
        title === "Columnists"
      )
        return false;

      return (
        !filteredThemes.check(metaData.primary_theme) &&
        !filteredSections.check(metaData.sections)
      );
    })
    .map(
      article =>
        article.top_article_views.metadata.hits.hits[0]["_source"]
          .title_not_analyzed
    );
}

module.exports = { getQuestion };
