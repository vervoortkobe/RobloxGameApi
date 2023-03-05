const express = require("express");
require("dotenv").config();
const fs = require("fs");
const db = require("better-sqlite3")("./itemdb.sqlite3");//, { verbose: console.log });
const requestIp = require("request-ip");

const app = express();
const PORT = 80; //process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestIp.mw());

require("./bootstrap.js").bootstrap(fs, app);
require("./index.js").index(app);
require("./api.js").api(db, app);
require("./dash.js").dash(fs, db, app);

// * FINISHED
app.get("*", (req, res) => {
  res.redirect("/");
});

//LISTENER FINISHED
const listener = app.listen(PORT, () => {
  console.log(listener.address());
  console.log(`⚡️[server]: Server is running at http://0.0.0.0:${PORT}`);
});