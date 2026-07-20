import sqlite3
from pathlib import Path

db_path = Path(__file__).parent / 'dev.db'
print('DB path:', db_path)
print('Exists:', db_path.exists())
conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
print('TABLES:', cur.fetchall())
try:
    cur.execute('SELECT id, email, role, password FROM User;')
    rows = cur.fetchall()
    print('USERS:', rows)
except Exception as e:
    print('USER_QUERY_ERROR:', e)
finally:
    conn.close()
