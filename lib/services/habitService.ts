import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from "../database";
import type { Habit, HabitType } from "../models/Habit";

export async function createHabit(data: Omit<Habit, 'id'>): Promise<string> {
    const db = await getDatabase();
    const id = uuidv4();
    const now = Date.now();
    const habit = {
        id,
        name: data.name as string,
        type: data.type as HabitType,
        createdAt: now,
        updatedAt: now,
        archived: false,
        synced: false,
    };
    await db.runAsync(
        `INSERT INTO habits (
            id, 
            name, 
            type, 
            created_at, 
            updated_at, 
            archived, 
            synced
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            habit.id,
            habit.name,
            habit.type,
            habit.createdAt,
            habit.updatedAt,
            habit.archived,
            habit.synced
        ]
    );
    return habit.id;
}

export async function getHabits(): Promise<Habit[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<Habit>(`SELECT * FROM habits`);
    return result ?? [];
}