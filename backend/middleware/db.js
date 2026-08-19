const fs   = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../db.json');

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    const blank = { users: [], sessions: [], results: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(blank, null, 2));
    return blank;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
