const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
const translate = require("./routes/translate");

app.use(bodyParser.json());

app.use("/api/v1/", translate);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = "Something went wrong !";
  const data = error.message;
  res.status(status).json({ message: message, error: data });
});

app.listen(port, function (err) {
  if (err) {
    console.log(`Server error: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
module.exports = app;
