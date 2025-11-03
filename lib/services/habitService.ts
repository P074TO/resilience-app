import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from "../database";
import type { Habit, HabitRow, HabitType } from "../models/Habit";

export async function createHabit(data: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'archived' | 'synced'>): Promise<string> {
    const db = await getDatabase();
    const id = uuidv4();
    const now = Date.now();

    await db.runAsync(
        `INSERT INTO habits (
            id, 
            user_id,
            name, 
            type, 
            created_at, 
            updated_at, 
            archived, 
            synced
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        id, 
        data.userId ?? null, 
        data.name, 
        data.type, 
        now, 
        now, 
        0, 
        0
    );
    return id;
}

export async function getHabits(): Promise<Habit[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<HabitRow>(`SELECT * FROM habits WHERE archived = 0`);

    return result.map((row: HabitRow): Habit => ({
        id: row.id,
        userId: row.user_id,
        name: row.name,
        type: row.type as HabitType,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        archived: row.archived,
        synced: row.synced,
    }));
}