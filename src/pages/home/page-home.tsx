import { Button, Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import { useAuth } from "../../shared/api/firebase/auth.js";
import { useItems } from "../../shared/api/firebase/items.js";
import { useNavigate } from "react-router-dom";
import { PageAddItemCard } from "./components/page-add-item-card.js";
import { PageItemsList } from "./components/page-items-list.js";

export const PageHome = () => {
    const { user, signInWithGoogle } = useAuth();
    const { items, addItem, removeItem } = useItems(user?.id ?? null);
    const navigate = useNavigate();

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
        <Stack spacing={3} mt={2}>
            <PageAddItemCard onSubmit={handleAdd} />
            <PageItemsList items={items} onEdit={handleEdit} onDelete={handleDelete} />
        </Stack>
    );
};
