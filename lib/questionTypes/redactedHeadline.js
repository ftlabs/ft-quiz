const { lanternApiRequest } = require("../services/lantern");

async function getQuestion() {
  const queryString = {
    dateFrom,
    dateTo,
    size: "182.5"
  };

  const results = await lanternApiRequest("topArticles", queryString);
}

module.exports = { getQuestion };
