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
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/api/firebase/auth";
import { useItems } from "../../shared/api/firebase/items";

export function PageItemEdit() {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, updateItem, removeItem } = useItems(user?.id ?? null);
    const item = useMemo(() => items.find((i) => i.id === itemId), [items, itemId]);
    const [title, setTitle] = useState("");
    const [icon, setIcon] = useState("");
    const [description, setDescription] = useState("");
    const [goalEnabled, setGoalEnabled] = useState(false);
    const [goalValue, setGoalValue] = useState<number | "">("");
    const [goalDirection, setGoalDirection] = useState<"atLeast" | "atMost">("atLeast");
    const [goalPeriod, setGoalPeriod] = useState<"day" | "week" | "month">("day");

    useEffect(() => {
        if (item) {
            setTitle(item.title);
            setIcon(item.icon ?? "");
            setDescription(item.description ?? "");
            if (item.goal) {
                setGoalEnabled(true);
                setGoalValue(item.goal.value);
                setGoalDirection(item.goal.direction);
                setGoalPeriod(item.goal.period);
            } else {
                setGoalEnabled(false);
                setGoalValue("");
                setGoalDirection("atLeast");
                setGoalPeriod("day");
            }
        }
    }, [item]);

    if (!item) return <Typography mt={2}>Item not found</Typography>;

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h6">Edit item</Typography>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Icon"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        sx={{ width: 160 }}
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        minRows={2}
                    />
                    <Stack spacing={2}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle1">Goal</Typography>
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
                                        label="Value"
                                        type="number"
                                        value={goalValue}
                                        onChange={(e) =>
                                            setGoalValue(
                                                e.target.value === "" ? "" : Number(e.target.value),
                                            )
                                        }
                                        sx={{ width: 160 }}
                                        inputProps={{ min: 0 }}
                                    />
                                    <TextField
                                        select
                                        label="Direction"
                                        value={goalDirection}
                                        onChange={(e) =>
                                            setGoalDirection(e.target.value as "atLeast" | "atMost")
                                        }
                                        sx={{ width: 200 }}
                                    >
                                        <MenuItem value="atLeast">At least</MenuItem>
                                        <MenuItem value="atMost">At most</MenuItem>
                                    </TextField>
                                    <TextField
                                        select
                                        label="Period"
                                        value={goalPeriod}
                                        onChange={(e) =>
                                            setGoalPeriod(
                                                e.target.value as "day" | "week" | "month",
                                            )
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
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="contained"
                                onClick={async () => {
                                    if (!itemId) return;
                                    await updateItem(itemId, {
                                        title: title.trim(),
                                        icon: icon,
                                        description: description,
                                        goal:
                                            goalEnabled && goalValue !== ""
                                                ? {
                                                      value: Number(goalValue),
                                                      direction: goalDirection,
                                                      period: goalPeriod,
                                                  }
                                                : null,
                                    });
                                    navigate(`/item/${itemId}`);
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                color="error"
                                variant="outlined"
                                onClick={async () => {
                                    if (!itemId) return;
                                    await removeItem(itemId);
                                    navigate("/");
                                }}
                            >
                                Delete
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
