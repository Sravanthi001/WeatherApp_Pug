const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const weather = require("./routes/weather");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static("public"));
app.use(express.json());
app.use("/api/weather", weather);

mongoose
  .connect("mongodb://localhost/weatherdata")
  .then(() => console.log("Connected to MongoDB..."));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
