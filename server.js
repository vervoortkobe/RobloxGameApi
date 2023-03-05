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

/*For the first endpoint, the prices should change at an interval. For every price, there is a 1/6 chance that it will fluctuate. If that chance is met, then there is a 50% chance that the price will either go down or up. The price should then be increased or decreased (Based on the 50/50.) by a random percentage between 10-70% of its current price. It is important to note that there are specific boundaries for each tier. I will provide you with the table of the tiers and their boundaries. After the price is set, please check if it is lower or higher than the boundary and adjust it accordingly.

Regarding the second endpoint, could you please implement a way of editing and adding items to both endpoints? A page with textboxes and buttons to edit it through the GUI would be useful, but we need to consider potential security risks.*/