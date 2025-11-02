export interface Habit {
    id: string;
    userId: string | null;
    name: string;
    type: 'build' | 'quit';
    createdAt: number;
    updatedAt: number;
    archived: boolean;
    synced: boolean;
}

export type HabitType = 'build' | 'quit';