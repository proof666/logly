export type UserId = string;
export type ItemId = string;
export type LogId = string;

export interface AppUser {
    id: UserId;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

export interface Item {
    id: ItemId;
    userId: UserId;
    title: string;
    description?: string;
    category?: string;
    icon?: string;
    goal?: {
        value: number;
        direction: "atLeast" | "atMost"; // atLeast: aim to meet or exceed; atMost: aim not to exceed
        period: "day" | "week" | "month";
    };
    position: number; // for custom ordering
    createdAt: number; // ms timestamp
    updatedAt: number; // ms timestamp
}

export interface LogRecord {
    id: LogId;
    userId: UserId;
    itemId: ItemId;
    actionDate: number; // ms timestamp for when action happened
    comment?: string;
    createdAt: number;
    updatedAt: number;
}
