import {
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
    Avatar,
    Divider,
} from "@mui/material";
import { MoreVert, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Fragment, useMemo, useState } from "react";
import type { LogRecord } from "../../../shared/types";

type Props = {
    logs: LogRecord[];
    itemId?: string | null;
    onEdit: (logId: string) => void;
    onDelete: (logId: string) => void;
};

export function LogsList({ logs, onEdit, onDelete }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const open = Boolean(anchorEl);

    const closeMenu = () => {
        setAnchorEl(null);
        setActiveId(null);
    };

    const formatter = useMemo(
        () =>
            new Intl.DateTimeFormat(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }),
        [],
    );

    console.log({ logs });

    return (
        <Card>
            <CardContent>
                <List>
                    {logs.map((log, index) => (
                        <Fragment key={log.id}>
                            <ListItem
                                divider={index < logs.length - 1}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        onClick={(e) => {
                                            setAnchorEl(e.currentTarget);
                                            setActiveId(log.id);
                                        }}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar>{new Date(log.actionDate).getDate()}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={log.comment || "—"}
                                    secondary={formatter.format(new Date(log.actionDate))}
                                />
                            </ListItem>
                            <Divider />
                        </Fragment>
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
}
