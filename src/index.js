/**
 * Required External Modules
 */

const express = require("express");
const { auth } = require("express-openid-connect");
const path = require("path");

require("dotenv").config();

/**
 * App Variables
 */

const env = process.env.NODE_ENV || "development";
const app = express();
const port =
  env === "development" ? process.env.DEV_PORT : process.env.PROD_PORT;

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "..", "public")));


/**
 * AUTH0 Configuration
 */

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUHT0_ISSUER_BASE_URL
};


/**
 * Routes Definitions
 */

// > Home

app.get("/", (req, res) => {
  res.render("home", { activeRoute: req.originalUrl });
});

// AUTH0 middleware

app.use(auth(config));

app.use( (req,res, next) => {
  req.oidc.isAuthenticated() ? next() : res.send('not authenticated')
} )

// > Profile

app.get("/profile", (req, res) => {
  res.render("profile", { activeRoute: req.originalUrl });
});

// > External API

app.get("/external-api", (req, res) => {
  res.render("external-api", { activeRoute: req.originalUrl });
});

// > Authentication

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
