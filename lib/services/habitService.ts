import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from "../database";
import type { Habit } from "../models/Habit";

export async function createHabit(data: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'archived' | 'synced'>): Promise<string> {
    const db = await getDatabase();
    const id: string = uuidv4();
    const now: number = Date.now();

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
    const result = await db.getAllAsync<Habit>(`SELECT * FROM habits`);
    return result ?? [];
}