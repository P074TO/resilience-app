import * as SQLite from 'expo-sqlite';
import { createTables } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
    db = await SQLite.openDatabaseAsync('resilience.db');
    await createTables(db);
    return db;
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    await initDatabase();
    if (db === null) {
        throw new Error('Database is not initialized');
    }
    return db;
}