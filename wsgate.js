require("dotenv").config();

function wsgate(db, wss) {
  let wscon = false;
  wss.on("connection", ws => {
    ws.on("error", err => {
      wscon = false;
      console.error(err);
    });
    ws.on("message", data => {
      if(process.env.KEYS.includes(data)) wscon = true;
      else wscon = false; //invalid key -> declined
    });
    if(wsconn === true) { //ws can send string data only
      setInterval(() => {
        const rows = db.prepare("SELECT * FROM items;").all();
        ws.send(JSON.stringify(rows));
      }, process.env.PRICES_FLUCT_INTERVAL * 1000);
    }
  });
}

module.exports = { wsgate };