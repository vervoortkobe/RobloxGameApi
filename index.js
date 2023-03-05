require("dotenv").config();

function index(app, timestamp) {
  // /
  app.get("/", (req, res) => {
    console.log("\x1b[35m", `> (GET) ${req.clientIp} visited /! | ${timestamp}`, "\x1b[0m", "");
    res.json({
      endpoints: [
        {
          GET: [
            {
              url: `https://${req.hostname}/api/prices?key=YOUR_ACCESS_KEY`,
              accepts: "none/read-only",
              method: "GET",
              returns: "{ \"Name\": [Price, \"Tier\"] }",
              returnType: "json"
            },
            {
              url: `https://${req.hostname}/api/snumbers?key=YOUR_ACCESS_KEY`,
              accepts: "none/read-only",
              method: "GET",
              returns: "{ \"Name\": Snr }",
              returnType: "json"
            }
          ]
        },
        {
          POST: [
            {
              url: `https://${req.hostname}/api/snumbers`,
              accepts: "{ \"key\": \"YOUR_ACCESS_KEY (String)\", \"name\": \"Name (String)\" }",
              method: "POST",
              returns: "{ \"success\": true/false (Bool), \"error\": Error reason (String) }",
              returnType: "json"
            }
          ]
        }
      ]
    });
  });

  //API
  app.get("/api", (req, res) => {
    console.log("\x1b[35m", `> (GET) ${req.clientIp} visited /api! | ${timestamp}`, "\x1b[0m", "");
    res.send("ExpressJS Server");
  });
}

module.exports = { index };