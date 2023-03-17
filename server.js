const express = require("express");
require("dotenv").config();
const fs = require("fs");
const db = require("better-sqlite3")("./itemdb.sqlite3");//, { verbose: console.log });
const requestIp = require("request-ip");
const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: 8080 });

const app = express();
const PORT = 80; //process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestIp.mw());

//TIMESTAMP CONSTANT 
const timestamp = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

//MODULES 
require("./pricefluct.js").pricefluct(db);
require("./wsgate.js").wsgate(db, wss);
require("./statics.js").statics(fs, app);
require("./index.js").index(app, timestamp);
require("./api.js").api(db, requestIp, app, timestamp);
require("./dash/dash.js").dash(fs, db, app, timestamp);

// GET * 
app.get("*", (req, res) => {
  res.redirect("/");
});

// POST * 
app.post("*", (req, res) => {
  res.redirect("/");
});

//LISTENER 
const listener = app.listen(PORT, () => {
  console.log(listener.address());
  console.log(`⚡️[server]: Server is running at port ${PORT}!`);
});