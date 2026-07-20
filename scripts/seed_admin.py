import sqlite3
from pathlib import Path
import uuid

DB_PATH = Path(__file__).resolve().parent.parent / "dev.db"
EMAIL = "aahan.chemicals@annadata.com"
HASHED_PASSWORD = "$2b$10$WKMYoyerlvd/PVIDanuxQ.4oE/jHslGAhaBMvxwZeKWqlaWv6zCu2"
ROLE = "admin"

if not DB_PATH.exists():
    raise SystemExit(f"Database file not found: {DB_PATH}")

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()
cur.execute("SELECT id FROM User WHERE email = ?", (EMAIL,))
row = cur.fetchone()
if row:
    cur.execute(
        "UPDATE User SET password = ?, role = ? WHERE email = ?",
        (HASHED_PASSWORD, ROLE, EMAIL),
    )
    action = "updated"
else:
    cur.execute(
        "INSERT INTO User (id, email, password, role) VALUES (?, ?, ?, ?)",
        (str(uuid.uuid4()), EMAIL, HASHED_PASSWORD, ROLE),
    )
    action = "inserted"
conn.commit()
cur.execute("SELECT id, email, role FROM User WHERE email = ?", (EMAIL,))
user = cur.fetchone()
conn.close()
print(action, user)
