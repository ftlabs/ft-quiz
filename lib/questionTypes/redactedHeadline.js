const AWS = require("aws-sdk");

const comprehend = new AWS.Comprehend();

async function getQuestion(results) {
  results = results.splice(0, 25);
  results = await getKeyPhrases(results);

  return constructQuestion(results);
}

function constructQuestion(results) {
  return results.map(article => {
    const keyPhraseToRedact = getKeyPhraseToRedact(article.KeyPhrases).Text;
    const title =
      article.top_article_views.metadata.hits.hits[0]["_source"]
        .title_not_analyzed;
    const question = redactKeyPhrase(title, keyPhraseToRedact);
    return {
      answers: [keyPhraseToRedact],
      question
    };
  });
}

function redactKeyPhrase(title, keyPhraseToRedact) {
  return title.replace(keyPhraseToRedact, "■■■■■");
}

function getKeyPhraseToRedact(keyPhrases) {
  let keyPhrase = keyPhrases.find(keyPhrase => {
    const firstCharacter = keyPhrase.Text.split("")[keyPhrase.Text.length - 1];
    isUpperCase(firstCharacter) && !firstCharacter.match(/^[.,:!?]/);
  });
  if (!keyPhrase) keyPhrase = keyPhrases[0];
  return keyPhrase;
}

function isUpperCase(letter) {
  return letter === letter.toUpperCase();
}

function getKeyPhrases(results) {
  return Promise.all(
    results.map(async article => {
      var params = {
        LanguageCode: "en",
        Text:
          article.top_article_views.metadata.hits.hits[0]["_source"]
            .title_not_analyzed
      };
      const keyPhrases = await comprehend.detectKeyPhrases(params).promise();
      return { ...article, ...keyPhrases };
    })
  );
}

module.exports = { getQuestion };
