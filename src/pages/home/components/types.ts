import type { Item } from "../../../shared/types/index.js";

export interface PageItemsListProps {
    items: Item[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onReorder: (items: Item[]) => void;
    loading?: boolean;
}

export interface SortableItemProps {
    item: Item;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onClick: () => void;
}
