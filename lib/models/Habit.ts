export interface Habit {
    id: string;
    userId: string | null;
    name: string;
    type: HabitType;
    createdAt: number;
    updatedAt: number;
    archived: number;
    synced: number;
}

export interface HabitRow {
    id: string;
    user_id: string | null;
    name: string;
    type: HabitType;
    created_at: number;
    updated_at: number;
    archived: number;
    synced: number;
}

export type HabitType = 'build' | 'quit';