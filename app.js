var createError = require("http-errors");
var express = require("express");
const cors = require("cors");

require("dotenv").config();

// Setting up DB connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URI_REMOTE;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var api = require("./routes/api");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err) {
    console.error("An error occurred:", err);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

module.exports = app;
