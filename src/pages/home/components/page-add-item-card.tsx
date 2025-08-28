import {
    Button,
    DialogActions,
    DialogContent,
    FormControlLabel,
    MenuItem,
    Stack,
    Switch,
    TextField,
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

export const PageAddItemForm = (props: PageAddItemCardProps) => {
    const { onSubmit } = props;
    const [title, setTitle] = useState("");
    const [icon, setIcon] = useState<string>("");
    const [goalEnabled, setGoalEnabled] = useState(false);
    const [goalValue, setGoalValue] = useState<number | "">("");
    const [goalDirection, setGoalDirection] = useState<"atLeast" | "atMost">("atLeast");
    const [goalPeriod, setGoalPeriod] = useState<"day" | "week" | "month">("day");
    const [submitting, setSubmitting] = useState(false);

    const canSubmit = title.trim().length > 0 && (!goalEnabled || goalValue !== "");

    const handleSubmit = useCallback(
        async (e?: React.FormEvent<HTMLFormElement>) => {
            e?.preventDefault();
            const trimmed = title.trim();
            if (!trimmed || submitting || !canSubmit) return;
            try {
                setSubmitting(true);
                await onSubmit({
                    title: trimmed,
                    icon: icon || undefined,
                    goal:
                        goalEnabled && goalValue !== ""
                            ? {
                                  value: Number(goalValue),
                                  direction: goalDirection,
                                  period: goalPeriod,
                              }
                            : undefined,
                });
                // reset after successful submit
                setTitle("");
                setIcon("");
                setGoalEnabled(false);
                setGoalValue("");
                setGoalDirection("atLeast");
                setGoalPeriod("day");
            } finally {
                setSubmitting(false);
            }
        },
        [
            title,
            icon,
            goalEnabled,
            goalValue,
            goalDirection,
            goalPeriod,
            onSubmit,
            submitting,
            canSubmit,
        ],
    );

    return (
        <form onSubmit={handleSubmit} noValidate>
            <DialogContent>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    alignItems={{ xs: "stretch", sm: "center" }}
                >
                    <TextField
                        size="small"
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        autoFocus
                        placeholder="e.g. Water"
                        inputProps={{ maxLength: 120 }}
                    />
                    <TextField
                        size="small"
                        label="Icon"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        placeholder="e.g. ⭐️"
                        sx={{ width: { xs: "100%", sm: 120 } }}
                        inputProps={{ maxLength: 4 }}
                    />
                </Stack>
                <Stack spacing={1.25} mt={1.5}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={goalEnabled}
                                onChange={(e) => setGoalEnabled(e.target.checked)}
                                inputProps={{ "aria-label": "Enable goal" }}
                            />
                        }
                        label="Enable goal"
                    />
                    {goalEnabled && (
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.5}
                            alignItems={{ xs: "stretch", sm: "center" }}
                        >
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
                                fullWidth
                                inputProps={{ min: 0, inputMode: "numeric", pattern: "[0-9]*" }}
                            />
                            <TextField
                                size="small"
                                select
                                label="Direction"
                                value={goalDirection}
                                onChange={(e) =>
                                    setGoalDirection(e.target.value as "atLeast" | "atMost")
                                }
                                fullWidth
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
                                fullWidth
                            >
                                <MenuItem value="day">Per day</MenuItem>
                                <MenuItem value="week">Per week</MenuItem>
                                <MenuItem value="month">Per month</MenuItem>
                            </TextField>
                        </Stack>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Add />}
                    disabled={!canSubmit || submitting}
                >
                    {submitting ? "Adding…" : "Add"}
                </Button>
            </DialogActions>
        </form>
    );
};
