import {
    Avatar,
    Card,
    CardContent,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, MoreVert } from "@mui/icons-material";
import { useState, useCallback } from "react";
import type { Item } from "../../../shared/types";

export interface ItemsListProps {
    items: Item[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const ItemsList = (props: ItemsListProps) => {
    const { items, onEdit, onDelete } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const open = Boolean(anchorEl);

    const closeMenu = useCallback(() => {
        setAnchorEl(null);
        setActiveId(null);
    }, []);

    return (
        <Card>
            <CardContent>
                <List>
                    {items.map((i) => (
                        <ListItem
                            key={i.id}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    onClick={(e) => {
                                        setAnchorEl(e.currentTarget);
                                        setActiveId(i.id);
                                    }}
                                >
                                    <MoreVert />
                                </IconButton>
                            }
                        >
                            {i.icon ? (
                                <ListItemAvatar>
                                    <Avatar>{i.icon}</Avatar>
                                </ListItemAvatar>
                            ) : null}
                            <ListItemText primary={i.title} secondary={i.description} />
                        </ListItem>
                    ))}
                </List>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={closeMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <MenuItem
                        onClick={() => {
                            if (activeId) onEdit(activeId);
                            closeMenu();
                        }}
                    >
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        Edit
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            if (activeId) onDelete(activeId);
                            closeMenu();
                        }}
                    >
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        Delete
                    </MenuItem>
                </Menu>
            </CardContent>
        </Card>
    );
};
