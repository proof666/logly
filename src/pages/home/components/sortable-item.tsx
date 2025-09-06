import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, MoreVert } from "@mui/icons-material";
import { useState, useCallback } from "react";
import { Typography } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatGoal } from "../../../shared/utils/format-goal.js";
import type { SortableItemProps } from "./types.js";

export const SortableItem = ({ item, onEdit, onDelete, onClick }: SortableItemProps) => {
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
                                ) : (
                                    <Typography color="text.secondary" variant="caption">
                                        No goal
                                    </Typography>
                                )}
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
