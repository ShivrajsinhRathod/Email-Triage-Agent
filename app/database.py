import sqlite3
import os
import json


BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

DATABASE_FILE = os.path.join(BASE_DIR, "email_triage.db")


def get_connection():
    return sqlite3.connect(DATABASE_FILE)


def initialize_database():
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS email_analysis (
            email_id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            priority TEXT NOT NULL,
            requires_action INTEGER NOT NULL,
            summary TEXT,
            reason TEXT
        )
    """)

    connection.commit()
    connection.close()


def get_cached_analysis(email_id):
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            category,
            priority,
            requires_action,
            summary,
            reason
        FROM email_analysis
        WHERE email_id = ?
    """, (email_id,))

    row = cursor.fetchone()

    connection.close()

    if not row:
        return None

    return {
        "category": row[0],
        "priority": row[1],
        "requires_action": bool(row[2]),
        "summary": row[3],
        "reason": row[4]
    }


def save_analysis(email_id, analysis):
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        INSERT OR REPLACE INTO email_analysis
        (
            email_id,
            category,
            priority,
            requires_action,
            summary,
            reason
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        email_id,
        analysis["category"],
        analysis["priority"],
        int(analysis["requires_action"]),
        analysis.get("summary"),
        analysis.get("reason")
    ))

    connection.commit()
    connection.close()