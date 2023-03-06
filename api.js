require("dotenv").config();

function api(db, requestIp, app, timestamp) {
  //GET /API/ALL
  app.get("/api/all", (req, res) => {
    if(requestIp.getClientIp(req) != req.clientIp) console.log("\x1b[35m", `> (GET) ${req.clientIp} visited /api/all! | ${timestamp}`, "\x1b[0m", "");
    if(req.query && req.query.key && typeof (req.query.key) == "string" && process.env.KEYS && process.env.KEYS.includes(req.query.key)) {

      const rows = db.prepare("SELECT * FROM items;").all();
      return res.json(rows);
    } else return res.json({ error: "Your KEY was declined!" });
  });

  //GET /API/PRICES
  app.get("/api/prices", (req, res) => {
    console.log("\x1b[35m", `> (GET) ${req.clientIp} visited /api/prices! | ${timestamp}`, "\x1b[0m", "");
    if(req.query && req.query.key && typeof (req.query.key) == "string" && process.env.KEYS && process.env.KEYS.includes(req.query.key)) {

      const rows = db.prepare("SELECT name, price, tier FROM items;").all();
      let json = "";
      rows.forEach(r => {
        json += `"${r.name}": [${r.price}, "${r.tier}"],`;
      });

      const parsed = JSON.parse(`{${json.slice(0, -1)}}`);
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

      const parsed = JSON.parse(`{${json.slice(0, -1)}}`);
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
        const row = rows.find(r => r.name.toLowerCase() === req.body.name.toLowerCase());
        if(row) {
          //RECORD ALREADY EXISTS -> UPDATING
          ++row.snr;
          console.log("\x1b[33m", `> ✅ (POST) ${req.clientIp} updated { "name": "${capitalized}", "snr": ${row.snr} } using /api/snumbers! | ${timestamp}`, "\x1b[0m", "");
          db.exec(`
            UPDATE items 
            SET snr = ${row.snr}
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