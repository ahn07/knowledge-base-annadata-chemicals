const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbFile = path.join(__dirname, 'dev.db');
const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('DB_OPEN_ERROR', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
    if (err) {
      console.error('ERR_TABLES', err.message);
      return;
    }
    console.log('TABLES', rows);
  });

  db.all('SELECT id, email, role, password FROM User;', (err, rows) => {
    if (err) {
      console.error('ERR_USERS', err.message);
    } else {
      console.log('USERS', JSON.stringify(rows, null, 2));
    }
    db.close();
  });
});
