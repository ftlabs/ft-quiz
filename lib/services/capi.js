const fetch = require("request-promise");

const CAPI_PATH = "http://api.ft.com/enrichedcontent/";

const CAPI_KEY = process.env.CAPI_KEY;

function getArticle(uuid) {
  const capiUrl = `${CAPI_PATH}${uuid}?apiKey=${CAPI_KEY}`;
  return fetch(capiUrl)
    .then(res => {
      if (res.status === 400) {
        throw `ERROR: fetch article for uuid=${uuid} status code=${res.status}`;
      }
      return res;
    })
    .then(res => res.text())
    .then(text => JSON.parse(text))
    .catch(err => {
      throw err;
    });
}

module.exports = { getArticleText };
