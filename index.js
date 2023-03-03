const express = require("express");
require("dotenv").config();
const fs = require("fs");
const db = require("better-sqlite3")("./itemdb.sqlite3", { verbose: console.log });

const app = express();
const PORT = 80; //process.env.PORT;

/*app.use(session({
	secret: process.env.EXPRESS_APP_SESSIONSECRET,
	resave: true,
	saveUninitialized: true
}));*/

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

// /
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

//API
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
  if (req.body && req.body.key && process.env.KEYS && process.env.KEYS.includes(req.body.key)) {

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
  if (req.body && req.body.key && process.env.KEYS && process.env.KEYS.includes(req.body.key)) {

    return res.json({ access: true });

  } else return res.json({ error: "Your KEY was declined!" });
});

//DASH FINISHED
app.get("/dash", (req, res) => {
  if (req.query && req.query.key && typeof (req.query.key) == "string" && process.env.KEYS && process.env.KEYS.includes(req.query.key)) {

    let json = "";
    const rows = db.prepare("SELECT * FROM items;").all();
    if(rows.length === 0) json = "No database table (items) records yet...";

    json += "[<br>";
    rows.forEach(r => {
      //console.log(r);
      json += `&nbsp;&nbsp;&nbsp;&nbsp;{ 
        <span>\"id\"</span>: <b style="color: #94cea8; border-radius: 4px; padding: 2px;">\"${r.id}\"</b>, 
        <span>\"name\"</span>: <b style="color: #ce9178; border-radius: 4px; padding: 2px;">\"${r.name}\"</b>, 
        <span>\"price\"</span>: <b style="color: #9cdcf1; border-radius: 4px; padding: 2px;">\"${r.price}\"</b>, 
        <span>\"tier\"</span>: <b style="color: #94cea8; border-radius: 4px; padding: 2px;">\"${r.tier}\"</b> }, <br>`;
    });
    json += "]";

    const dash1 = fs.readFileSync("./dash1.html");
    const dash2 = fs.readFileSync("./dash2.html");
      
    return res.send(`
      ${dash1}
      ${json}
      ${dash2}
    `);

  } else return res.json({ error: "Your KEY was declined!" });
});

//ADD FINISHED
app.post("/dash/add", (req, res) => {
  if (req.body && req.body.key && req.body.name && req.body.price && req.body.tier && process.env.KEYS && process.env.KEYS.includes(req.body.key)) {

    if(isNaN(+req.body.price) || !typeof +req.body.price === "number") return res.json({ error: "price is not an integer!" });
    const capitalized = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);

    const rows = db.prepare("SELECT * FROM items;").all();
    if(rows.find(r => r.name.toLowerCase() === req.body.name.toLowerCase())) {
      //RECORD ALREADY EXISTS -> UPDATING
      db.exec(`
        UPDATE items 
        SET price = ${+req.body.price}, tier = '${req.body.tier}'
        WHERE name = '${capitalized}';
      `);
      return res.redirect(`https://${req.hostname}/dash?key=${req.body.key}&success=update`);

    } else {
      //RECORD DOESN'T YET EXIST -> INSERTING
      db.exec(`
        INSERT INTO items (id, name, price, tier)
        VALUES (NULL, '${capitalized}', ${+req.body.price}, '${req.body.tier}'); 
      `);
      return res.redirect(`https://${req.hostname}/dash?key=${req.body.key}&success=add`);
    }
  } else return res.json({ error: "Your KEY was declined!" });
});

//REMOVE FINISHED
app.post("/dash/remove", (req, res) => {
  if (req.body && req.body.key && req.body.name && process.env.KEYS && process.env.KEYS.includes(req.body.key)) {
    const capitalized = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);

    const rows = db.prepare("SELECT * FROM items;").all();
    if(rows.find(r => r.name.toLowerCase() === req.body.name.toLowerCase())) {
      //RECORD EXISTS -> REMOVING
      db.exec(`
        DELETE FROM items 
        WHERE name = '${capitalized}';
      `);
      return res.redirect(`https://${req.hostname}/dash?key=${req.body.key}&success=remove`);

    } else {
      //RECORD DOESN'T EXIST -> FAIL
      return res.redirect(`https://${req.hostname}/dash?key=${req.body.key}&success=fail`);
    }
  } else return res.json({ error: "Your KEY was declined!" });
});

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