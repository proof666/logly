import React from "react";
import {
    Avatar,
    Box,
    Card,
    CardActionArea,
    CardContent,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";
import { Edit, MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Item } from "../../../shared/types";

export function ItemRow({ item }: { item: Item }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    return (
        <Card>
            <Box sx={{ position: "relative" }}>
                <CardActionArea onClick={() => navigate(`/item/${item.id}`)}>
                    <CardContent>
                        <Stack direction="row" spacing={1} alignItems="center">
                            {item.icon ? (
                                <Avatar sx={{ width: 28, height: 28, fontSize: 18 }}>
                                    {item.icon}
                                </Avatar>
                            ) : null}
                            <Typography variant="h6">{item.title}</Typography>
                        </Stack>
                        {item.description && (
                            <Typography color="text.secondary">{item.description}</Typography>
                        )}
                    </CardContent>
                </CardActionArea>
                <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    aria-label="actions"
                >
                    <MoreVert />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
                    <MenuItem
                        onClick={() => {
                            navigate(`/item/${item.id}/edit`);
                            setAnchorEl(null);
                        }}
                    >
                        <ListItemIcon>
                            <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                    </MenuItem>
                </Menu>
            </Box>
        </Card>
    );
}
