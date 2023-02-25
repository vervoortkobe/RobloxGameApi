const express = require("express");
const dotenv = require("dotenv").config();
const fs = require("fs");
const db = require("better-sqlite3")("./test.db", { verbose: console.log });

const app = express();
const PORT = 80; //process.env.PORT;

app.get("/", (req, res) => {
  res.json({
    endpoints: [
      {
        first: {
          url: `https://${req.hostname}/api/prices?key=YOUR_ACCESS_KEY`,
          accepts: "none/read-only",
          method: "GET",
          returns: "{ \"Key\": [100, \"F\"] //Name: [Price, \"Tier\"] }",
          returnType: "json"
        }
      },
      {
        second: {
          url: `https://${req.hostname}/api/serialnumbers/`,
          accepts: "string (key), YOUR_ACCESS_KEY (string)",
          method: "POST",
          returns: "{ \"Key\": 23, \"Dirt\": 12 }",
          returnType: "json"
        }
      }
    ]
  });
});

app.get("/api", (req, res) => {
  res.send("ExpressJS Server");
});

app.get("/api/prices", (req, res) => {
  console.log(typeof (req.query.key));
  if (req.query && req.query.key && typeof (req.query.key) == "string" && process.env.KEYS && process.env.KEYS.includes(req.query.key)) {

    // for the prices boundaries
    const tierlimits = require("./tierlimits.json");

    
    console.log(tierlimits.F);

    /*{
      "Key":[30,"F"],
      "Dirt":[50,"F"]
    }*/

    function Randomize(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }


    return res.json({ access: true });
  } else return res.json({ error: "Your KEY was declined!" });
});

app.post("/api/serialnumbers", (req, res) => {
  if (req.params && req.params.key && process.env.KEYS && process.env.KEYS.includes(req.params.key)) {
    return res.json({ access: true });
  } else return res.json({ error: "Your KEY was declined!" });
});

app.get("*", (req, res) => {
  res.redirect("/");
});

const listener = app.listen(PORT, () => {
  console.log(listener.address());
  console.log(`⚡️[server]: Server is running at http://0.0.0.0:${PORT}`);
});

/*For the first endpoint, the prices should change at an interval. For every price, there is a 1/6 chance that it will fluctuate. If that chance is met, then there is a 50% chance that the price will either go down or up. The price should then be increased or decreased (Based on the 50/50.) by a random percentage between 10-70% of its current price. It is important to note that there are specific boundaries for each tier. I will provide you with the table of the tiers and their boundaries. After the price is set, please check if it is lower or higher than the boundary and adjust it accordingly.

Regarding the second endpoint, could you please implement a way of editing and adding items to both endpoints? A page with textboxes and buttons to edit it through the GUI would be useful, but we need to consider potential security risks.*/