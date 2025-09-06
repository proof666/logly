import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, MoreVert } from "@mui/icons-material";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Item } from "../../../shared/types/index.js";
import { formatGoal } from "../../../shared/utils/format-goal.js";
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
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface PageItemsListProps {
    items: Item[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onReorder: (items: Item[]) => void;
    loading?: boolean;
}

interface SortableItemProps {
    item: Item;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onClick: () => void;
}

const SortableItem = ({ item, onEdit, onDelete, onClick }: SortableItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const open = Boolean(anchorEl);

    const closeMenu = useCallback(() => {
        setAnchorEl(null);
        setActiveId(null);
    }, []);

    const getOpenMenu = useCallback(
        (id: string) => (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
            setActiveId(id);
        },
        [],
    );

    const handleEditClick = useCallback(() => {
        if (activeId) onEdit(activeId);
        closeMenu();
    }, [activeId, onEdit, closeMenu]);

    const handleDeleteClick = useCallback(() => {
        setConfirmOpen(true);
        closeMenu();
    }, [closeMenu]);

    const handleConfirmDelete = useCallback(() => {
        if (activeId) onDelete(activeId);
        setConfirmOpen(false);
        setActiveId(null);
    }, [activeId, onDelete]);

    const handleCancelDelete = useCallback(() => {
        setConfirmOpen(false);
    }, []);

    return (
        <>
            <ListItem
                ref={setNodeRef}
                style={style}
                disablePadding
                secondaryAction={
                    <IconButton
                        edge="end"
                        onClick={(e) => {
                            getOpenMenu(item.id)(e);
                        }}
                    >
                        <MoreVert />
                    </IconButton>
                }
                {...attributes}
                {...listeners}
            >
                <ListItemButton onClick={onClick}>
                    <ListItemText
                        primary={item.icon ? `${item.icon} ${item.title}` : item.title}
                        secondary={
                            <>
                                {item.description ? (
                                    <Typography color="text.secondary" variant="body2">
                                        {item.description}
                                    </Typography>
                                ) : null}
                                {item.goal ? (
                                    <Typography color="text.secondary" variant="caption">
                                        {formatGoal(item.goal)}
                                    </Typography>
                                ) : null}
                            </>
                        }
                    />
                </ListItemButton>
            </ListItem>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <MenuItem onClick={handleEditClick}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Delete
                </MenuItem>
            </Menu>

            <Dialog open={confirmOpen} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
                <DialogTitle>Delete item?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This action cannot be undone. Are you sure you want to delete this item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export const PageItemsList = (props: PageItemsListProps) => {
    const { items, onEdit, onDelete, onReorder, loading = false } = props;
    const navigate = useNavigate();

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
                            />
                        ))}
                    </List>
                )}
            </SortableContext>
        </DndContext>
    );
};
