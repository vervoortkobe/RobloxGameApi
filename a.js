const express = require("express");
const dotenv = require("dotenv").config();
const fs = require("fs");
const db = require("better-sqlite3")("./test.sqlite3", { verbose: console.log });

//const migration = fs.readFileSync("insert.sql", "utf8");
//db.exec(migration);

const rows = db.prepare("SELECT * FROM test;").all();
rows.forEach(r => console.log(r));