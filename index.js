const express = require("express");
const dotenv = require("dotenv").config();
const fs = require("fs");
const db = require("better-sqlite3")("./test.db", { verbose: console.log });

const app = express();
const PORT = 80; //process.env.PORT;

app.get("/", (req, res) => {
  res.json({
    endpoints: [
      {
        first: {
          url: `https://${req.hostname}/api/prices?key=YOUR_ACCESS_KEY`,
          accepts: "none/read-only",
          returns: "json"
        }
      },
      {
        second: {
          url: `https://${req.hostname}/api/serialnumbers/`,
          accepts: "string (key), YOUR_ACCESS_KEY (string)",
          returns: "json"
        }
      }
    ]
  });
});

app.get("/api", (req, res) => {
  res.send("ExpressJS Server");
});

app.get("/api/prices", (req, res) => {
  console.log(typeof(req.query.key));
  if(req.query && req.query.key && typeof(req.query.key) == "string" && process.env.KEYS && process.env.KEYS.includes(req.query.key)) {
    return res.json({ access: true });
  } else return res.json({ error: "Your ACCESSKEY was declined!" });
});

app.post("/api/serialnumbers", (req, res) => {
  if(req.params && req.params.key && process.env.KEYS && process.env.KEYS.includes(req.params.key)) {
    return res.json({ access: true });
  } else return res.json({ error: "Your ACCESSKEY was declined!" });
});

app.get("*", (req, res) => {
  res.redirect("/");
});

const listener = app.listen(PORT, () => {
  console.log(listener.address());
  console.log(`⚡️[server]: Server is running at http://0.0.0.0:${PORT}`);
});