const express = require("express");
const https = require("https");
const { appendFile } = require("fs");
const app = express();
const path = require("path");
const helmet = require("helmet");
const passport = require("passport");
require("dotenv").config();
const port = 3000;
const { Strategy } = require("passport-google-oauth20");
const { verify } = require("crypto");
function checkLogin(req, res, next) {
  const isLoggedIn = true;
  if (!isLoggedIn) {
    res.status(401).json({
      error: "user not logged in",
    });
  }
  next();
}

app.use(helmet());
// passport.initialize() initialises the authentication module.
// An authentication module is a plug-in that collects user information such as a user ID and password, and compares the information against entries in a database.
app.use(passport.initialize());

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
};
function verifyCallback(accessToken, refresgToken, profile, done) {
  console.log("User profile", profile);
  done(null, profile);
}
passport.use(
  new Strategy(
    {
      callbackURL: "/auth/google/callback",
      clientID: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
    },
    verifyCallback
  )
);

// log in end point
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: false,
  }),
  (req, res) => {
    res.send("Google called us back");
  }
);
// log out end point
app.get("/auth/logout", (req, res) => {});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/failure", (req, res) => {
  res.send("Failed to log in");
});
app.get("/secret", checkLogin, (req, res) => {
  console.log("Your secret number is 10");
  res.send("Your secret number in 10");
});
app.listen(port, () => {
  console.log("Server Started");
});
