const express = require("express");
const dotenv = require("dotenv").config();
const fs = require("fs");
const db = require("better-sqlite3")("./test.db", { verbose: console.log });



const row = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
console.log(row.firstName, row.lastName, row.email);


db.table("filesystem_directory", {
  columns: ['filename', 'data'],
  rows: function* () {
    for (const filename of fs.readdirSync(process.cwd())) {
      const data = fs.readFileSync(filename);
      yield { filename, data };
    }
  },
});

const files = db.prepare('SELECT * FROM filesystem_directory').all();