const translate = require("@vitalets/google-translate-api");

// create the redis client
const redis = require("redis");
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);

// For knowing the language code of language entered by user
const ISO6391 = require("iso-639-1");

// add similar languages array (it can be updated further for more languages)
const similarLanguagesList = [
  ["hi", "kn", "bn", "gu", "pa", "ta", "te"],
  ["en", "cy"],
  ["fr", "de", "it", "es", "nl"],
];

// smart cache function to create a cache for similar languages

const smartCache = async (languageCode, text) => {
  // search for similar languages inside the array
  for (let i = 0; i < similarLanguagesList.length; i++) {
    let index = similarLanguagesList[i].indexOf(languageCode);

    // if language is not there in list then continue
    if (index == -1) {
      continue;
    }

    for (let j = 0; j < similarLanguagesList[i].length; j++) {
      if (j != index) {
        try {
          const result = await translate(text, {
            to: similarLanguagesList[i][j],
          });
          let key = text + ":" + similarLanguagesList[i][j];
          client.setex(key, 1000, result.text);
          return;
        } catch (err) {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          throw err;
          return;
        }
      }
    }
  }
};

module.exports.translateText = async (req, res) => {
  const targetLanguage = req.body.language;
  const requestText = req.body.text;
  let targetLanguageCode = ISO6391.getCode(targetLanguage);

  //    pre cache function for storing keys for other related languages
  try {
    const val = await smartCache(targetLanguageCode, requestText);
    const result = await translate(requestText, { to: targetLanguageCode });
    let key = requestText + ":" + targetLanguageCode;
    client.setex(key, 1000, result.text);
    return res.status(200).json({
      message: "Success",
      data: result.text,
    });
  } catch (err) {

    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
      return ;
  }
};
