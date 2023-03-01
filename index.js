const express = require("express");
require("dotenv").config();
const fs = require("fs");
const db = require("better-sqlite3")("./itemdb.sqlite3", { verbose: console.log });

const app = express();
const PORT = 80; //process.env.PORT;

//BOOTSTRAP DIR HOST
let bootstraps = fs.readdirSync("./bootstrap-5.1.3-dist/css/themes/", { withFileTypes: true });
bootstraps.forEach(b => {
  app.get(`/bootstrap-5.1.3-dist/css/themes/${encodeURI(`${b.name}`)}`, (req, res) => {
    res.sendFile(`${__dirname}/bootstrap-5.1.3-dist/css/themes/${decodeURI(`${b.name}`)}`);
  });
});

//BOOTSTRAP JS
app.get("/bootstrap-5.1.3-dist/js/bootstrap.min.js", (req, res) => {
  res.sendFile(`${__dirname}/bootstrap-5.1.3-dist/js/bootstrap.min.js`);
});

//BOOTSTRAP JS MAP
app.get("/bootstrap-5.1.3-dist/js/bootstrap.min.js.map", (req, res) => {
  res.sendFile(`${__dirname}/bootstrap-5.1.3-dist/js/bootstrap.min.js.map`);
});

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
  if (req.query && req.query.key && typeof (req.query.key) == "string" && process.env.KEYS && process.env.KEYS.includes(req.query.key)) {

    const rows = db.prepare("SELECT * FROM items;").all();

    return res.json(rows);

  } else return res.json({ error: "Your KEY was declined!" });
});

app.post("/api/prices", (req, res) => {
  if (req.params && req.params.key && process.env.KEYS && process.env.KEYS.includes(req.params.key)) {

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

app.get("/dash", (req, res) => {
  if (req.query && req.query.key && typeof (req.query.key) == "string" && process.env.KEYS && process.env.KEYS.includes(req.query.key)) {

    let json = "";
    const rows = db.prepare("SELECT * FROM items;").all();
    if(rows.length === 0) json = "No database table (items) records yet...";

    json += "[<br>";
    rows.forEach(r => {
      console.log(r);
      json += `&nbsp;&nbsp;&nbsp;&nbsp;{ 
        <span>\"id\"</span>: <b style="color: #94cea8; border-radius: 4px; padding: 2px;">\"${r.id}\"</b>, 
        <span>\"name\"</span>: <b style="color: #ce9178; border-radius: 4px; padding: 2px;">\"${r.name}\"</b>, 
        <span>\"price\"</span>: <b style="color: #9cdcf1; border-radius: 4px; padding: 2px;">\"${r.price}\"</b>, 
        <span>\"tier\"</span>: <b style="color: #94cea8; border-radius: 4px; padding: 2px;">\"${r.tier}\"</b> }, <br>`;
    });
    json += "]";

    const index = fs.readFileSync("./index.html");
      
    return res.send(`
      ${index}
      ${json}
            </div>
          </div>
        </div>
      </body>
      </html>
    `);

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