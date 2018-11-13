const filteredThemes = require("../utils/filteredThemes");
const filteredSections = require("../utils/filteredSections");

function filterArticles(articles) {
  return articles.filter(article => {
    const metaData = article.top_article_views.metadata.hits.hits[0]["_source"];
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
  });
  // .map(
  //   article =>
  //     article.top_article_views.metadata.hits.hits[0]["_source"]
  //       .title_not_analyzed
  // );
}

module.exports = { filterArticles };
