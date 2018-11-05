const { lanternApiRequest } = require("../services/lantern");

async function getQuestion() {
  const dateFrom = new Date();
  let dateTo = new Date();
  dateFrom.setDate(dateTo.getDate() - 182);

  const queryString = {
    dateFrom,
    dateTo,
    size: "20"
  };

  const results = await lanternApiRequest("topArticles", queryString);
  return results;
}

module.exports = { getQuestion };
