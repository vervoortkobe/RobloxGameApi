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

      const rows = db.prepare("SELECT name, snr FROM items;").all();
      let json = "";
      rows.forEach(r => {
        json += `"${r.name}": ${r.snr},`;
      });

      const parsed = JSON.parse(`{ ${json.slice(0, -1)}}`);
      return res.json(parsed);

    } else return res.json({ error: "Your KEY was declined!" });
  });

  //POST /API/SNUMBERS
  app.post("/api/snumbers", (req, res) => {
    console.log("\x1b[35m", `> (POST) ${req.clientIp} visited /api/snumbers! | ${timestamp}`, "\x1b[0m", "");
    if(req.body && req.body.key && process.env.KEYS && process.env.KEYS.includes(req.body.key)) {
      if(req.body.key && req.body.name) {

        const capitalized = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);

        const rows = db.prepare("SELECT name, snr FROM items;").all();
        if(rows.find(r => r.name.toLowerCase() === req.body.name.toLowerCase())) {
          //RECORD ALREADY EXISTS -> UPDATING
          console.log("\x1b[33m", `> ✅ (POST) ${req.clientIp} updated { "name": "${capitalized}", "snr": "${++r.snr}" } using /api/snumbers! | ${timestamp}`, "\x1b[0m", "");
          db.exec(`
            UPDATE items 
            SET id = ${++r.snr}
            WHERE name = '${capitalized}';
          `);

          return res.json({ success: true });
        } else return res.json({ success: false, error: "There is no such item with that NAME yet!" });

      } else {
        let params = [];
        switch (true) {
          case !req.body.key:
            params.push("KEY");
            break;
          case !req.body.name:
            params.push("NAME");
            break;
          case !req.body.snr:
            params.push("SNR");
            break;
          default:
            break;
        }
        params = JSON.stringify(params.join(", "));
        return res.json({ success: false, error: `The following parameters are missing: ${params}` });
      }
    } else return res.json({ error: "Your KEY was declined!" });
  });
}

module.exports = { api };