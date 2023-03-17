require("dotenv").config();

function wsgate(db, wss) {
  wss.on("connection", (ws, req) => {
    ws.on("error", err => {
      return console.error(err);
    });

    ws.on("message", data => { // on dashboard load -> send message to ws, ws will respond if client authorized
      if(req.url && req.url.includes("?key=") && typeof (req.url) == "string" && process.env.KEYS && process.env.KEYS.includes(req.url.split("?key=")[1]) && data.toString() === "getall") { //ws receives data in buffer (byte) format
        const rows = db.prepare("SELECT * FROM items;").all();
        ws.send(JSON.stringify(rows)); //ws can send string data only, which will be converted to buffer (byte) type
      } else return ws.send(JSON.stringify({ error: "Your KEY was declined!" }));
    });
    
    setInterval(() => { // TIMED CHANGES: ALL
      if(req.url && req.url.includes("?key=") && typeof (req.url) == "string" && process.env.KEYS && process.env.KEYS.includes(req.url.split("?key=")[1])) {
        const rows = db.prepare("SELECT * FROM items;").all();
        ws.send(JSON.stringify(rows)); //ws can send string data only, which will be converted to buffer (byte) type
      } else return ws.send(JSON.stringify({ error: "Your KEY was declined!" }));
    }, process.env.PRICES_FLUCT_INTERVAL * 1000); //synced with pricefluct
  });
}

module.exports = { wsgate };