import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useCallback, useState } from "react";

export interface PageAddItemCardProps {
    onSubmit: (data: { title: string; icon?: string }) => Promise<void> | void;
}

export const PageAddItemCard = (props: PageAddItemCardProps) => {
    const { onSubmit } = props;
    const [title, setTitle] = useState("");
    const [icon, setIcon] = useState<string>("");

    const handleSubmit = useCallback(async () => {
        const trimmed = title.trim();
        if (!trimmed) return;
        await onSubmit({ title: trimmed, icon: icon || undefined });
        setTitle("");
        setIcon("");
    }, [title, icon, onSubmit]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Add item</Typography>
                <Stack direction="row" spacing={1} mt={1} alignItems="center">
                    <TextField
                        size="small"
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        size="small"
                        label="Icon"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        placeholder="e.g. ⭐️"
                        sx={{ width: 120 }}
                    />
                    <Button variant="contained" startIcon={<Add />} onClick={handleSubmit}>
                        Add
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};
