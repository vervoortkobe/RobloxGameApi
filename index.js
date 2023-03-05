require("dotenv").config();

function index(app) {
  // /
  app.get("/", (req, res) => {
    console.log("\x1b[35m", `> (GET) ${req.clientIp} visited /!`, "\x1b[0m", "");
    res.json({
      endpoints: [
        {
          GET: [
            {
              url: `https://${req.hostname}/api/prices?key=YOUR_ACCESS_KEY`,
              accepts: "none/read-only",
              method: "GET",
              returns: "{ \"Key\": [100, \"F\"] } //{ \"Name\": [Price, \"Tier\"] }",
              returnType: "json"
            },
            {
              url: `https://${req.hostname}/api/snumbers?key=YOUR_ACCESS_KEY`,
              accepts: "none/read-only",
              method: "GET",
              returns: "{ \"Key\": 23, \"Dirt\": 12 } //{ \"Name\": Id, \"Name\": Id }",
              returnType: "json"
            }
          ]
        },
        {
          POST: [
            {
              url: `https://${req.hostname}/api/snumbers`,
              accepts: "{ \"Key\": \"YOUR_ACCESS_KEY (String)\", \"Name\": \"Dirt\", \"Id\" (Number/Int) }",
              method: "POST",
              returns: "{ \"Key\": 23, \"Dirt\": 12 } //{ \"Name\": Id/Snumber, \"Name\": ID/Snumber }",
              returnType: "json"
            }
          ]
        }
      ]
    });
  });

  //API
  app.get("/api", (req, res) => {
    console.log("\x1b[35m", `> (GET) ${req.clientIp} visited /api!`, "\x1b[0m", "");
    res.send("ExpressJS Server");
  });
}

module.exports = { index };