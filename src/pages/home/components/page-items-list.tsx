import { List, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Item } from "../../../shared/types/index.js";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item.js";
import type { PageItemsListProps } from "./types.js";
import { useItemsStats } from "../../../shared/api/firebase/items-stats.js";

export const PageItemsList = (props: PageItemsListProps) => {
    const { items, onEdit, onDelete, onReorder, loading = false, userId } = props;
    const navigate = useNavigate();

    const itemIds = useMemo(() => items.map((item: Item) => item.id), [items]);
    const { stats } = useItemsStats(userId || null, itemIds);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 500, // Long press for 500ms
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;

            if (over && active.id !== over.id) {
                const oldIndex = items.findIndex((item: Item) => item.id === active.id);
                const newIndex = items.findIndex((item: Item) => item.id === over.id);

                const reorderedItems = arrayMove(items, oldIndex, newIndex);
                if (onReorder) {
                    onReorder(reorderedItems);
                }
            }
        },
        [items, onReorder],
    );

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
                items={items.map((item: Item) => item.id)}
                strategy={verticalListSortingStrategy}
            >
                {loading ? (
                    <Typography color="text.secondary">Loading items...</Typography>
                ) : items.length === 0 ? (
                    <Typography color="text.secondary">No items yet</Typography>
                ) : (
                    <List>
                        {items.map((item: Item) => (
                            <SortableItem
                                key={item.id}
                                item={item}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onClick={() => navigate(`/item/${item.id}`)}
                                stats={stats[item.id]}
                            />
                        ))}
                    </List>
                )}
            </SortableContext>
        </DndContext>
    );
};
