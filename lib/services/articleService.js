const { lanternApiRequest } = require("./lantern");

async function get() {
  let dateFrom = new Date();
  let dateTo = new Date();
  dateFrom.setMonth(dateTo.getMonth() - 1);

  const queryString = {
    dateFrom,
    dateTo,
    size: "100"
  };

  let results = await lanternApiRequest("topArticles", queryString);
  return JSON.parse(results);
}

module.exports = {
  get
};
