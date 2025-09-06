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

export interface PageItemsListProps {
    items: Item[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const PageItemsList = (props: PageItemsListProps) => {
    const { items, onEdit, onDelete } = props;
    const navigate = useNavigate();
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
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (activeId) onDelete(activeId);
        setConfirmOpen(false);
        setActiveId(null);
        closeMenu();
    }, [activeId, onDelete, closeMenu]);

    const handleCancelDelete = useCallback(() => {
        setConfirmOpen(false);
        closeMenu();
    }, [closeMenu]);

    return (
        <>
            {items.length === 0 ? (
                <Typography color="text.secondary">No items yet</Typography>
            ) : (
                <List>
                    {items.map((item) => (
                        <ListItem
                            key={item.id}
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
                        >
                            <ListItemButton onClick={() => navigate(`/item/${item.id}`)}>
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
                                                <Typography
                                                    color="text.secondary"
                                                    variant="caption"
                                                >
                                                    {formatGoal(item.goal)}
                                                </Typography>
                                            ) : null}
                                        </>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}

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
