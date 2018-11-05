const { lanternApiRequest } = require("../services/lantern");

async function getQuestion() {
  const dateFrom = new Date();
  let dateTo = new Date();
  dateFrom.setMonth(dateTo.getMonth() - 1);

  const queryString = {
    dateFrom,
    dateTo,
    size: "50"
  };

  const results = await lanternApiRequest("topArticles", queryString);
  return results;
}

module.exports = { getQuestion };
