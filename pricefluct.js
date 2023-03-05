require("dotenv").config();

async function pricefluct(db, app, timestamp) {
  const tierlimits = require("./tierlimits.json"); //PRICE BOUNDARIES
  function checkBoundaries(newprice, tier) {
    if(newprice < tierlimits[tier]) return tierlimits[tier][0];
    else if(newprice > tierlimits[tier]) return tierlimits[tier][1];
    return newprice;
  }
  let updatedTimestamp = Date.now();
  const rows = db.prepare("SELECT * FROM items;").all();
  setInterval(() => {
    rows.forEach(r => {
      const chance6 = Math.floor(Math.random() * 6) + 1;
      if(chance6 === 1) {
        const chance2 = Math.floor(Math.random() * 2) + 1;
        const percentage = Math.floor(Math.random() * 60) + 10 / 100;
        if(chance2 === 1) { //INCREASING
          const newprice = r.price + (r.price * percentage);
          const finalprice = checkBoundaries(newprice, r.tier);

          db.exec(`
            UPDATE items 
            SET price = ${finalprice}
            WHERE name = '${r.name}';
          `);
        } else if(chance2 === 2) { //DECREASING
          const newprice = r.price - (r.price * percentage);
          const finalprice = checkBoundaries(newprice, r.tier);

          db.exec(`
            UPDATE items 
            SET price = ${finalprice}
            WHERE name = '${r.name}';
          `);
        }
      }
    });
    updatedTimestamp = Date.now();
  }, process.env.PRICES_FLUCT_INTERVAL * 1000);

  //GET /API/TIMESTAMP
  app.get("/api/timestamp", (req, res) => {
    console.log("\x1b[35m", `> (GET) ${req.clientIp} visited /api/timestamp! | ${timestamp}`, "\x1b[0m", "");
    if(req.query && req.query.key && typeof (req.query.key) == "string" && process.env.KEYS && process.env.KEYS.includes(req.query.key)) {
      return res.json({"latest": updatedTimestamp});
    } else return res.json({ error: "Your KEY was declined!" });
  });
}

module.exports = { pricefluct };