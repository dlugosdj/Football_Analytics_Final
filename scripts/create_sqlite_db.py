#!/usr/bin/env python3
"""
Create an SQLite database from CSV files in the repository.

Usage: python3 scripts/create_sqlite_db.py

This script reads the following CSV files (if present) and writes them
into tables in `data/mercyhurst_2025.db`:

- hurst_defensive_stats_2025.csv -> table `hurst_defensive_stats_2025`
- opponent_offense_stats.csv   -> table `opponent_offensive_stats`
- team_defensive_stats.csv     -> table `team_defensive_stats`

Column names are sanitized to safe SQL identifiers (non-alphanumeric -> underscore).
"""
import sqlite3
from pathlib import Path
import pandas as pd
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT
OUT_DIR = ROOT / 'data'
OUT_DIR.mkdir(exist_ok=True)
DB_PATH = OUT_DIR / 'mercyhurst_2025.db'

FILES = [
    (DATA_DIR / 'hurst_defensive_stats_2025.csv', 'hurst_defensive_stats_2025'),
    (DATA_DIR / 'opponent_offense_stats.csv', 'opponent_offensive_stats'),
    (DATA_DIR / 'team_defensive_stats.csv', 'team_defensive_stats'),
]


def sanitize_columns(cols):
    new = []
    for c in cols:
        # replace non-alphanumeric characters with underscore
        s = re.sub(r"[^0-9A-Za-z_]", "_", c)
        # collapse multiple underscores
        s = re.sub(r"_+", "_", s).strip("_")
        if s == '':
            s = 'col'
        new.append(s)
    return new


def load_and_write(csv_path: Path, table_name: str, conn: sqlite3.Connection):
    if not csv_path.exists():
        print(f"Skipping {csv_path.name} — file not found.")
        return False

    print(f"Reading {csv_path.name}...")
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"Failed to read {csv_path}: {e}")
        return False

    # sanitize column names
    df.columns = sanitize_columns(df.columns.astype(str))

    # write to sqlite
    print(f"Writing table `{table_name}` ({len(df)} rows) to database...")
    df.to_sql(table_name, conn, if_exists='replace', index=False)
    return True


def main():
    conn = sqlite3.connect(DB_PATH)
    try:
        for path, table in FILES:
            load_and_write(path, table, conn)
        print(f"Database written to: {DB_PATH}")
    finally:
        conn.close()


if __name__ == '__main__':
    main()
