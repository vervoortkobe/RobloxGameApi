require("dotenv").config();

function api(db, app) {
  //GET /API/PRICES
  app.get("/api/prices", (req, res) => {
    console.log("\x1b[35m", `> (GET) ${req.clientIp} visited /api/prices!`, "\x1b[0m", "");
    if (req.query && req.query.key && typeof (req.query.key) == "string" && process.env.KEYS && process.env.KEYS.includes(req.query.key)) {

      const rows = db.prepare("SELECT price,  FROM items;").all();

      return res.json(rows);

    } else return res.json({ error: "Your KEY was declined!" });
  });

  //POST /API/PRICES
  app.post("/api/prices", (req, res) => {
    console.log("\x1b[35m", `> (POST) ${req.clientIp} visited /api/prices!`, "\x1b[0m", "");
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

  //POST /API/SNUMBERS
  app.post("/api/snumbers", (req, res) => {
    console.log("\x1b[35m", `> (POST) ${req.clientIp} visited /api/snumbers!`, "\x1b[0m", "");
    if (req.body && req.body.key && process.env.KEYS && process.env.KEYS.includes(req.body.key)) {
      return res.json({ access: true });

    } else return res.json({ error: "Your KEY was declined!" });
  });
}

module.exports = { api };