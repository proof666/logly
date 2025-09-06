import {
    Box,
    Button,
    Drawer,
    Fab,
    IconButton,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { useCallback, useState } from "react";
import { useAuth } from "../../shared/api/firebase/auth.js";
import { useItems } from "../../shared/api/firebase/items.js";
import { useNavigate } from "react-router-dom";
import { PageAddItemForm } from "./components/page-add-item-card.js";
import { PageItemsList } from "./components/page-items-list.js";
import type { Item } from "../../shared/types/index.js";
import React from "react";

export const PageHome = () => {
    const { user, signInWithGoogle, loading: authLoading } = useAuth();
    const {
        items,
        addItem,
        removeItem,
        updateItemsPositions,
        loading: itemsLoading,
    } = useItems(user?.id ?? null);
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [desktopDialogOpen, setDesktopDialogOpen] = useState(false);

    const handleAdd = useCallback(
        async (data: {
            title: string;
            icon?: string;
            goal?: {
                value: number;
                direction: "atLeast" | "atMost";
                period: "day" | "week" | "month";
            };
        }) => {
            await addItem({ title: data.title, icon: data.icon, goal: data.goal });
        },
        [addItem],
    );

    const handleEdit = useCallback((id: string) => navigate(`/item/${id}/edit`), [navigate]);

    const handleDelete = useCallback((id: string) => void removeItem(id), [removeItem]);

    const handleReorder = useCallback(
        async (reorderedItems: Item[]) => {
            await updateItemsPositions(reorderedItems);
        },
        [updateItemsPositions],
    );

    const handleUpdatePositions = useCallback(async () => {
        if (!user?.id) return;
        // This will update all items with proper positions
        const updatedItems = items.map((item, index) => ({
            ...item,
            position: index,
        }));
        await updateItemsPositions(updatedItems);
    }, [user?.id, items, updateItemsPositions]);

    const handleOpenDrawer = useCallback(() => setDrawerOpen(true), []);
    const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);
    const handleOpenDesktopDialog = useCallback(() => setDesktopDialogOpen(true), []);
    const handleCloseDesktopDialog = useCallback(() => setDesktopDialogOpen(false), []);

    const handleAddMobile = useCallback(
        async (data: {
            title: string;
            icon?: string;
            goal?: {
                value: number;
                direction: "atLeast" | "atMost";
                period: "day" | "week" | "month";
            };
        }) => {
            await handleAdd(data);
            setDrawerOpen(false);
        },
        [handleAdd],
    );

    const handleAddDesktop = useCallback(
        async (data: {
            title: string;
            icon?: string;
            goal?: {
                value: number;
                direction: "atLeast" | "atMost";
                period: "day" | "week" | "month";
            };
        }) => {
            await handleAdd(data);
            setDesktopDialogOpen(false);
        },
        [handleAdd],
    );

    if (!user) {
        return (
            <Stack spacing={2} alignItems="center" mt={4}>
                <Typography variant="h5">Sign in</Typography>
                <Button variant="contained" onClick={signInWithGoogle}>
                    Sign in with Google
                </Button>
            </Stack>
        );
    }

    return (
        <>
            {/* Desktop: Add button opens modal */}
            <Stack
                direction="row"
                justifyContent="flex-end"
                mt={2}
                sx={{ display: { xs: "none", md: "flex" } }}
            >
                <Button variant="outlined" onClick={handleUpdatePositions} sx={{ mr: 1 }}>
                    Update Positions
                </Button>
                <Button variant="contained" startIcon={<Add />} onClick={handleOpenDesktopDialog}>
                    Add habit
                </Button>
            </Stack>

            {/* Items list - always visible */}
            <Stack spacing={3} mt={{ xs: 0, md: 2 }}>
                {authLoading || itemsLoading ? (
                    <Typography color="text.secondary">Loading...</Typography>
                ) : (
                    <PageItemsList
                        items={items}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onReorder={handleReorder}
                        loading={itemsLoading}
                    />
                )}
            </Stack>

            {/* Mobile FAB */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleOpenDrawer}
                sx={{
                    position: "fixed",
                    right: 16,
                    bottom: 16,
                    display: { xs: "flex", md: "none" },
                }}
            >
                <Add />
            </Fab>

            {/* Mobile bottom drawer with add form */}
            <Drawer
                anchor="bottom"
                open={drawerOpen}
                onClose={handleCloseDrawer}
                sx={{ display: { xs: "block", md: "none" } }}
                PaperProps={{
                    sx: { height: "65vh", borderTopLeftRadius: 8, borderTopRightRadius: 8 },
                }}
            >
                <Box
                    sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">Add habit</Typography>
                        <IconButton aria-label="close" onClick={handleCloseDrawer}>
                            <Close />
                        </IconButton>
                    </Stack>
                    <PageAddItemForm onSubmit={handleAddMobile} />
                </Box>
            </Drawer>

            {/* Desktop modal with add form */}
            <Dialog
                open={desktopDialogOpen}
                onClose={handleCloseDesktopDialog}
                fullWidth
                maxWidth="sm"
                sx={{ display: { xs: "none", md: "block" } }}
            >
                <DialogTitle sx={{ pr: 6 }}>
                    Add habit
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDesktopDialog}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <PageAddItemForm onSubmit={handleAddDesktop} />
            </Dialog>
        </>
    );
};
