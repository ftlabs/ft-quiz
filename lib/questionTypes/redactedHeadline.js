const { lanternApiRequest } = require("../services/lantern");

async function getQuestion() {
  const dateFrom = new Date();
  let dateTo = new Date();
  dateFrom.setDate(dateTo.getDate() - 182);

  const queryString = {
    dateFrom,
    dateTo,
    size: "100"
  };

  const results = await lanternApiRequest("topArticles", queryString);
}

module.exports = { getQuestion };
