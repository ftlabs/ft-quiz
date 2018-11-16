const { lanternApiRequest } = require("./lantern");

async function get() {
  let dateFrom = new Date();
  let dateTo = new Date();
  dateFrom.setDate(dateTo.getMonth() - 1);

  const queryString = {
    dateFrom,
    dateTo,
    size: "200"
  };

  let results = await lanternApiRequest("topArticles", queryString);
  return JSON.parse(results);
}

module.exports = {
  get
};
