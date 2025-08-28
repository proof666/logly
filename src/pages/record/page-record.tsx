import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../shared/api/firebase/auth";
import { useLogs } from "../../shared/api/firebase/logs";
import { useEffect, useMemo, useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export const PageRecord = () => {
    const { itemId, logId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { logs, updateLog, removeLog } = useLogs(user?.id ?? null, itemId ?? null);
    const log = useMemo(() => logs.find((l) => l.id === logId), [logs, logId]);
    const [date, setDate] = useState<Dayjs | null>(null);
    const [comment, setComment] = useState<string>("");

    // Sync form state when log loads/changes
    useEffect(() => {
        if (log) {
            setDate(dayjs(log.actionDate));
            setComment(log.comment ?? "");
        }
    }, [log]);

    if (!log) return <Typography mt={2}>Record not found</Typography>;

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h6">Edit record</Typography>
                    <DateTimePicker
                        label="Date and time"
                        value={date}
                        onChange={(v) => setDate(v)}
                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                    />
                    <TextField
                        label="Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            onClick={async () => {
                                const ts = date ? date.valueOf() : Date.now();
                                await updateLog(log.id, {
                                    actionDate: ts,
                                    comment: comment || undefined,
                                });
                                if (itemId) navigate(`/item/${itemId}`);
                            }}
                        >
                            Save
                        </Button>
                        <Button
                            color="error"
                            variant="outlined"
                            onClick={async () => {
                                await removeLog(log.id);
                                if (itemId) navigate(`/item/${itemId}`);
                            }}
                        >
                            Delete
                        </Button>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};
