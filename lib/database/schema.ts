import * as SQLite from 'expo-sqlite';

export async function createTables(db: SQLite.SQLiteDatabase) {
    await db.execAsync(`
        PRAGMA foreign_keys = ON;
        PRAGMA journal_mode = WAL;
        
        CREATE TABLE IF NOT EXISTS habits (
            id TEXT PRIMARY KEY,
            user_id TEXT, -- null until cloud sync enabled
            name TEXT NOT NULL,
            type TEXT CHECK(type IN ('build', 'quit')),
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            archived INTEGER DEFAULT 0,
            synced INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS habit_logs (
            id TEXT PRIMARY KEY,
            habit_id TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            emotion_tags TEXT NOT NULL, -- JSON array
            trigger_tags TEXT NOT NULL,
            note TEXT,
            synced INTEGER DEFAULT 0,
            FOREIGN KEY(habit_id) REFERENCES habits(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS journal_entries (
            id TEXT PRIMARY KEY,
            content TEXT NOT NULL,
            sentiment_score REAL,
            emotion_tags TEXT NOT NULL, -- auto-detected emotions
            keywords TEXT NOT NULL, -- extracted keywords
            created_at INTEGER NOT NULL,
            synced INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS resilience_metrics (
            id TEXT PRIMARY KEY,
            date INTEGER NOT NULL,
            score REAL NOT NULL,
            consistency_factor REAL NOT NULL,
            recovery_factor REAL NOT NULL,
            reflection_factor REAL NOT NULL,
            synced INTEGER DEFAULT 0
        );

        CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
        CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
        CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at);
        CREATE INDEX IF NOT EXISTS idx_resilience_metrics_date ON resilience_metrics(date);

    `);
}