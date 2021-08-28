const Joi = require("joi");

const schema = Joi.object({
  text: Joi.string().required(),
  language: Joi.string().required(),
});

module.exports.validateTranslateApi = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
    
  } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 422;
      }
      next(err);
      return;
  }

};
