require("dotenv").config();

function api(db, app, timestamp) {
  //GET /API/PRICES
  app.get("/api/prices", (req, res) => {
    console.log("\x1b[35m", `> (GET) ${req.clientIp} visited /api/prices! | ${timestamp}`, "\x1b[0m", "");
    if(req.query && req.query.key && typeof (req.query.key) == "string" && process.env.KEYS && process.env.KEYS.includes(req.query.key)) {

      const rows = db.prepare("SELECT name, price, tier FROM items;").all();
      let json = "";
      rows.forEach(r => {
        json += `"${r.name}": [${r.price}, "${r.tier}"],`;
      });

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

      const parsed = JSON.parse(`{ ${json.slice(0, -1)}}`);
      return res.json(parsed);

    } else return res.json({ error: "Your KEY was declined!" });
  });

  //GET /API/SNUMBERS
  app.get("/api/snumbers", (req, res) => {
    console.log("\x1b[35m", `> (GET) ${req.clientIp} visited /api/snumbers! | ${timestamp}`, "\x1b[0m", "");
    if(req.query && req.query.key && typeof (req.query.key) == "string" && process.env.KEYS && process.env.KEYS.includes(req.query.key)) {

      const rows = db.prepare("SELECT name, id FROM items;").all();
      let json = "";
      rows.forEach(r => {
        json += `"${r.name}": ${r.id},`;
      });

      const parsed = JSON.parse(`{ ${json.slice(0, -1)}}`);
      return res.json(parsed);

    } else return res.json({ error: "Your KEY was declined!" });
  });

  //POST /API/SNUMBERS
  app.post("/api/snumbers", (req, res) => {
    console.log("\x1b[35m", `> (POST) ${req.clientIp} visited /api/snumbers! | ${timestamp}`, "\x1b[0m", "");
    if(req.body && req.body.key && process.env.KEYS && process.env.KEYS.includes(req.body.key)) {
      if(req.body.key && req.body.name && req.body.id) {



        return res.json({ success: true });

      } else {
        let params = [];
        if(!req.body.key) params.push("KEY");
        if(!req.body.name) params.push("NAME");
        if(!req.body.id) params.push("ID");
        params = JSON.stringify(params.join(", "));
        return res.json({ success: false, error: `The following parameters are missing: ${params}` });
      }
    } else return res.json({ error: "Your KEY was declined!" });
  });
}

module.exports = { api };