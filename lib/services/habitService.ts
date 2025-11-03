import * as Crypto from "expo-crypto";
import { getDatabase } from "../database";
import type { Habit, HabitRow, HabitType } from "../models/Habit";

export async function createHabit(
  data: Omit<Habit, "id" | "createdAt" | "updatedAt" | "archived" | "synced">
): Promise<string> {
  const db = await getDatabase();
  const id = Crypto.randomUUID();
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

export async function readHabits(): Promise<Habit[]> {
  const db = await getDatabase();
  const result = await db.getAllAsync<HabitRow>(`SELECT * FROM habits`);

  return result.map(
    (row: HabitRow): Habit => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      type: row.type as HabitType,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      archived: row.archived,
      synced: row.synced,
    })
  );
}

export async function readArchivedHabits(): Promise<Habit[]> {
  const db = await getDatabase();
  const result = await db.getAllAsync<HabitRow>(`SELECT * FROM habits WHERE archived = 1`);

  return result.map(
    (row: HabitRow): Habit => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      type: row.type as HabitType,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      archived: row.archived,
      synced: row.synced,
    })
  );
}

export async function updateHabit(id: string, data: Partial<Habit>): Promise<void> {
  const db = await getDatabase();
  const now = Date.now();

  const updates: string[] = [];
  const values: any[] = [];

  if (data.name !== undefined) {
    updates.push("name = ?");
    values.push(data.name);
  }

  if (data.type !== undefined) {
    updates.push("type = ?");
    values.push(data.type);
  }

  updates.push("updated_at = ?");
  values.push(now);

  if (updates.length === 1) {
    return;
  }

  values.push(id);

  await db.runAsync(`UPDATE habits SET ${updates.join(", ")} WHERE id = ?`, ...values);
}

export async function archiveHabit(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`UPDATE habits SET archived = 1, updated_at = ? WHERE id = ?`, Date.now(), id);
}

export async function unarchiveHabit(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`UPDATE habits SET archived = 0, updated_at = ? WHERE id = ?`, Date.now(), id);
}

export async function deleteHabit(id: string): Promise<void> {
  const db = await getDatabase();
  const results = await db.runAsync(`DELETE FROM habits WHERE id = ? AND archived = 1`, id);

  if (results.changes === 0) {
    throw new Error("Failed to delete habit: not found or not archived");
  }
}
