import {
    Button,
    Card,
    CardContent,
    FormControlLabel,
    MenuItem,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useCallback, useState } from "react";

export interface PageAddItemCardProps {
    onSubmit: (data: {
        title: string;
        icon?: string;
        goal?: { value: number; direction: "atLeast" | "atMost"; period: "day" | "week" | "month" };
    }) => Promise<void> | void;
}

export const PageAddItemCard = (props: PageAddItemCardProps) => {
    const { onSubmit } = props;
    const [title, setTitle] = useState("");
    const [icon, setIcon] = useState<string>("");
    const [goalEnabled, setGoalEnabled] = useState(false);
    const [goalValue, setGoalValue] = useState<number | "">("");
    const [goalDirection, setGoalDirection] = useState<"atLeast" | "atMost">("atLeast");
    const [goalPeriod, setGoalPeriod] = useState<"day" | "week" | "month">("day");

    const handleSubmit = useCallback(async () => {
        const trimmed = title.trim();
        if (!trimmed) return;
        await onSubmit({
            title: trimmed,
            icon: icon || undefined,
            goal:
                goalEnabled && goalValue !== ""
                    ? { value: Number(goalValue), direction: goalDirection, period: goalPeriod }
                    : undefined,
        });
        setTitle("");
        setIcon("");
        setGoalEnabled(false);
        setGoalValue("");
        setGoalDirection("atLeast");
        setGoalPeriod("day");
    }, [title, icon, goalEnabled, goalValue, goalDirection, goalPeriod, onSubmit]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Add item</Typography>
                <Stack spacing={1} mt={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
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
                    <Stack spacing={1}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={goalEnabled}
                                    onChange={(e) => setGoalEnabled(e.target.checked)}
                                />
                            }
                            label="Enable goal"
                        />
                        {goalEnabled && (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <TextField
                                    size="small"
                                    label="Value"
                                    type="number"
                                    value={goalValue}
                                    onChange={(e) =>
                                        setGoalValue(
                                            e.target.value === "" ? "" : Number(e.target.value),
                                        )
                                    }
                                    sx={{ width: 140 }}
                                    inputProps={{ min: 0 }}
                                />
                                <TextField
                                    size="small"
                                    select
                                    label="Direction"
                                    value={goalDirection}
                                    onChange={(e) =>
                                        setGoalDirection(e.target.value as "atLeast" | "atMost")
                                    }
                                    sx={{ width: 180 }}
                                >
                                    <MenuItem value="atLeast">At least</MenuItem>
                                    <MenuItem value="atMost">At most</MenuItem>
                                </TextField>
                                <TextField
                                    size="small"
                                    select
                                    label="Period"
                                    value={goalPeriod}
                                    onChange={(e) =>
                                        setGoalPeriod(e.target.value as "day" | "week" | "month")
                                    }
                                    sx={{ width: 160 }}
                                >
                                    <MenuItem value="day">Per day</MenuItem>
                                    <MenuItem value="week">Per week</MenuItem>
                                    <MenuItem value="month">Per month</MenuItem>
                                </TextField>
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};
