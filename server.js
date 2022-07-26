const express = require("express");
const https = require("https");
const { appendFile } = require("fs");
const app = express();
const path = require("path");
const helmet = require("helmet");
app.use(helmet());
const port = 3000;
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/secret", (req, res) => {
  console.log("Your secret number is 10");
  res.send("Your secret number in 10");
});
app.listen(port, () => {
  console.log("Server Started");
});
