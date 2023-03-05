const { timeStamp } = require("console");

require("dotenv").config();

function dash(fs, db, app, timestamp) {
  //GET /DASH 
  app.get("/dash", (req, res) => {
    console.log("\x1b[35m", `> (GET) ${req.clientIp} visited /dash! | ${timestamp}`, "\x1b[0m", "");
    if(req.query && req.query.key && typeof (req.query.key) == "string" && process.env.KEYS && process.env.KEYS.includes(req.query.key)) {

      let json = "";
      const rows = db.prepare("SELECT * FROM items;").all();
      if(rows.length === 0) json = "No database table (items) records yet...";

      json += "[<br>";
      rows.forEach(r => {
        //console.log(r);
        json += `&nbsp;&nbsp;&nbsp;&nbsp;{ 
          <span>\"id\"</span>: <b style="color: #94cea8; border-radius: 4px; padding: 2px;">\"${r.id}\"</b>,
          <span>\"name\"</span>: <b style="color: #ce9178; border-radius: 4px; padding: 2px;">\"${r.name}\"</b>,
          <span>\"price\"</span>: <b style="color: #9cdcf1; border-radius: 4px; padding: 2px;">${r.price}</b>,
          <span>\"tier\"</span>: <b style="color: #94cea8; border-radius: 4px; padding: 2px;">\"${r.tier}\"</b>,
          <span>\"snr\"</span>: <b style="color: #9cdcf1; border-radius: 4px; padding: 2px;">${r.snr}</b>},<br>`;
      });
      json += "]";
      json = json.substring(0, json.lastIndexOf(",")) + json.substring(json.lastIndexOf(",") + 1, json.length);

      const dash1 = fs.readFileSync("./dash1.html");
      const dash2 = fs.readFileSync("./dash2.html");
        
      return res.send(`
        ${dash1}
        ${json}
        ${dash2}
      `);

    } else return res.json({ error: "Your KEY was declined!" });
  });

  //POST /DASH/ADD 
  app.post("/dash/add", (req, res) => {
    console.log("\x1b[35m", `> (POST) ${req.clientIp} visited /dash/add! | ${timestamp}`, "\x1b[0m", "");
    if(req.body && req.body.key && req.body.name && req.body.price && req.body.tier && process.env.KEYS && process.env.KEYS.includes(req.body.key)) {

      if(isNaN(+req.body.price) || !typeof +req.body.price === "number") return res.json({ error: "price is not an integer!" });

      const capitalized = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);

      const rows = db.prepare("SELECT * FROM items;").all();
      if(rows.find(r => r.name.toLowerCase() === req.body.name.toLowerCase())) {
        //RECORD ALREADY EXISTS -> UPDATING
        console.log("\x1b[33m", `> ✅ (POST) ${req.clientIp} updated { "name": "${capitalized}", "price": ${+req.body.price}, "tier": "${req.body.tier}" } using /dash/add! | ${timestamp}`, "\x1b[0m", "");
        db.exec(`
          UPDATE items 
          SET price = ${+req.body.price}, tier = '${req.body.tier}'
          WHERE name = '${capitalized}';
        `);
        return res.redirect(`https://${req.hostname}/dash?key=${req.body.key}&success=update`);

      } else {
        //RECORD DOESN'T YET EXIST -> INSERTING
        console.log("\x1b[33m", `> ✅ (POST) ${req.clientIp} added { "name": "${capitalized}", "price": "${+req.body.price}", "tier": "${req.body.tier}", "snr": 1 } using /dash/add! | ${timestamp}`, "\x1b[0m", "");
        db.exec(`
          INSERT INTO items (id, name, price, tier, snr)
          VALUES (NULL, '${capitalized}', ${+req.body.price}, '${req.body.tier}', 1); 
        `);
        return res.redirect(`https://${req.hostname}/dash?key=${req.body.key}&success=add`);
      }
    } else return res.json({ error: "Your KEY was declined!" });
  });

  //POST /DASH/REMOVE 
  app.post("/dash/remove", (req, res) => {
    console.log("\x1b[35m", `> ✅ (POST) ${req.clientIp} visited /dash/remove! | ${timestamp}`, "\x1b[0m", "");
    if(req.body && req.body.key && req.body.name && process.env.KEYS && process.env.KEYS.includes(req.body.key)) {

      const rows = db.prepare("SELECT * FROM items;").all();
      if(rows.find(r => r.name.toLowerCase() === req.body.name.toLowerCase())) {
        //RECORD EXISTS -> REMOVING
        const capitalized = r.name.charAt(0).toUpperCase() + r.name.slice(1);
        console.log("\x1b[33m", `> ❌ (POST) ${req.clientIp} removed { "name": "${capitalized}", "price": "${+r.price}", "tier": "${r.tier}", "snr": ${r.snr} } using /dash/remove! | ${timestamp}`, "\x1b[0m", "");
        db.exec(`
          DELETE FROM items 
          WHERE name = '${capitalized}';
        `);
        return res.redirect(`https://${req.hostname}/dash?key=${req.body.key}&success=remove`);

      } else {
        //RECORD DOESN'T EXIST -> FAIL
        const capitalized = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
        console.log("\x1b[31m", `> (POST) ${req.clientIp} failed to remove { "name": "${capitalized}", "price": "${+req.body.price}", "tier": "${req.body.tier}", "snr": 1 } using /dash/remove! | ${timestamp}`, "\x1b[0m", "");
        return res.redirect(`https://${req.hostname}/dash?key=${req.body.key}&success=fail`);
      }
    } else return res.json({ error: "Your KEY was declined!" });
  });
}

module.exports = { dash };