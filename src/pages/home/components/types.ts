import type { Item, UserId } from "../../../shared/types/index.js";

export interface PageItemsListProps {
    items: Item[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onReorder: (items: Item[]) => void;
    loading?: boolean;
    userId?: UserId | null;
}

export interface SortableItemProps {
    item: Item;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onClick: () => void;
    stats?: number[];
}
