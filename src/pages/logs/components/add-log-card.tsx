import { Card, CardActions, CardContent, Button, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

type Props = {
    date: Dayjs | null;
    setDate: (v: Dayjs | null) => void;
    comment: string;
    setComment: (v: string) => void;
    onSubmit: (ts: number, comment: string) => void;
};

export function AddLogCard({ date, setDate, comment, setComment, onSubmit }: Props) {
    const handleAdd = () => {
        const now = dayjs();
        const base = date ?? now;
        // Merge selected date with current time of day
        const ts = base
            .hour(now.hour())
            .minute(now.minute())
            .second(now.second())
            .millisecond(now.millisecond())
            .valueOf();
        onSubmit(ts, comment.trim());
    };

    return (
        <Card>
            <CardContent>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                    <Stack flex={1} spacing={1} direction={{ xs: "column", sm: "row" }}>
                        <DatePicker label="Date" value={date} onChange={(v) => setDate(v)} />
                        <TextField
                            fullWidth
                            label="Comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </Stack>
                </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button variant="contained" onClick={handleAdd}>
                    Log
                </Button>
            </CardActions>
        </Card>
    );
}
