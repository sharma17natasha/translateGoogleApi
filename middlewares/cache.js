const REDIS_PORT = process.env.PORT || 6379;
const redis = require("redis");
const redisClient = redis.createClient(REDIS_PORT);

const ISO6391 = require("iso-639-1");

// middleware for caching translated text
module.exports.cache = function (req, res, next) {
  try {
    const targetLanguage = req.body.language;
    const targetText = req.body.text;
    let languageCode = ISO6391.getCode(targetLanguage);
    let key = targetText + ":" + languageCode;

    redisClient.get(key, (err, data) => {
      if (err) {
        if (!err.statusCode) {
          err.statusCode = 430;
        }
        next(err);
        return err;
      }
      if (data !== null) {
        return res.status(200).json({
          message: "Success",
          data: data,
        });
      } else {
        next();
      }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
