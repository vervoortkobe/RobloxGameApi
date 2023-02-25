const express = require("express");
const dotenv = require("dotenv").config();
const fs = require("fs");
const db = require("better-sqlite3")("./test.db", { verbose: console.log });

const migration = fs.readFileSync('migrate-schema.sql', 'utf8');
db.exec(migration);