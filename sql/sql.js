const fs = require("fs");
const db = require("better-sqlite3")("./itemdb.sqlite3", { verbose: console.log });

const createtable = fs.readFileSync("createtable.sql", "utf8");
db.exec(createtable);

//const insert = fs.readFileSync("insert.sql", "utf8");
//db.exec(insert);

const rows = db.prepare("SELECT * FROM items;").all();
rows.forEach(r => console.log(r));