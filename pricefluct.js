require("dotenv").config();

async function pricefluct(db) {
  const tierlimits = require("./tierlimits.json"); //PRICE BOUNDARIES
  function checkBoundaries(newprice, tier) {
    if(tierlimits[tier] && newprice < tierlimits[tier][0]) return tierlimits[tier][0];
    else if(tierlimits[tier] && newprice > tierlimits[tier][1]) return tierlimits[tier][1];
    return newprice;
  }
  const rows = db.prepare("SELECT * FROM items;").all();
  setInterval(() => {
    rows.forEach(r => {
      const chance6 = Math.floor(Math.random() * 6) + 1;
      if(chance6 === 1) {
        const chance2 = Math.floor(Math.random() * 2) + 1;
        //const percentage = (Math.floor(Math.random() * 61) + 10) / 100;
        const percentage = Math.floor(Math.random() * 71) / 100;
        if(chance2 === 1) { //INCREASING
          const newprice = r.price + (r.price * percentage);
          const finalprice = Math.floor(checkBoundaries(newprice, r.tier));

          db.exec(`
            UPDATE items 
            SET price = ${finalprice}
            WHERE name = '${r.name}';
          `);

        } else { //DECREASING
          const newprice = r.price - (r.price * percentage);
          const finalprice = Math.floor(checkBoundaries(newprice, r.tier));

          db.exec(`
            UPDATE items 
            SET price = ${finalprice}
            WHERE name = '${r.name}';
          `);
        }
      }
    });
  }, process.env.PRICES_FLUCT_INTERVAL * 1000);
}

module.exports = { pricefluct };