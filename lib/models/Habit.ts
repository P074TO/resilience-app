export interface Habit {
    id: string;
    userId: string | null;
    name: string;
    type: 'build' | 'quit';
    createdAt: number;
    updatedAt: number;
    archived: number;
    synced: number;
}

export type HabitType = 'build' | 'quit';