const express = require("express");
const dotenv = require("dotenv").config();
const fs = require("fs");
const sdb = require("better-sqlite3")("./test.sqlite3", { verbose: console.log });
const sqlite3 = require("better-sqlite3");


let db = new sqlite3("./test.sqlite3", sqlite3.OPEN_READWRITE, (err) => {
  if(err) console.error(err);
  verbose: console.log;
});

const migration = fs.readFileSync('insert.sql', 'utf8');
db.exec(migration);

//const row = sdb.prepare('SELECT * FROM test');
//console.log(row.username);