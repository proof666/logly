import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Add, Delete, Edit, MoreVert } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../shared/api/firebase/auth";
import { useLogs, aggregateLogsByDay } from "../../shared/api/firebase/logs";
import { useMemo, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export function ItemLogsPage() {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showAll, setShowAll] = useState(false);
    const since = useMemo(() => {
        if (showAll) return undefined;
        const now = dayjs();
        return now.subtract(30, "day").startOf("day").valueOf();
    }, [showAll]);
    const { logs, addDetailedLog, removeLog } = useLogs(
        user?.id ?? null,
        itemId ?? null,
        since ? { since } : undefined,
    );
    const [date, setDate] = useState<Dayjs | null>(null);
    const [comment, setComment] = useState("");
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [activeLogId, setActiveLogId] = useState<string | null>(null);

    const data = aggregateLogsByDay(logs);
    const stats = useMemo(() => {
        const count = logs.length;
        const first = logs[0];
        const last = first ? new Date(first.actionDate) : null;
        return {
            count,
            lastText: last ? last.toLocaleString() : "—",
        };
    }, [logs]);

    return (
        <Stack spacing={2} mt={2}>
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <DatePicker
                            label="Date"
                            value={date}
                            onChange={(v) => setDate(v)}
                            slotProps={{ textField: { size: "small", fullWidth: true } }}
                        />
                        <TextField
                            label="Comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            multiline
                            minRows={3}
                            fullWidth
                        />
                    </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => {
                            const now = dayjs();
                            const dt = date
                                ? date
                                      .hour(now.hour())
                                      .minute(now.minute())
                                      .second(now.second())
                                      .millisecond(now.millisecond())
                                : now;
                            const ts = dt.valueOf();
                            const trimmed = comment.trim();
                            void addDetailedLog({
                                actionDate: ts,
                                comment: trimmed ? trimmed : undefined,
                            });
                            setComment("");
                        }}
                    >
                        Log
                    </Button>
                </CardActions>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h6">Daily chart</Typography>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#1976d2" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Typography variant="body2" color="text.secondary">
                {stats.count} records • Last: {stats.lastText}
            </Typography>

            <Stack spacing={1}>
                {logs.map((l) => (
                    <Card key={l.id} variant="outlined">
                        <CardHeader
                            title={new Date(l.actionDate).toLocaleString()}
                            titleTypographyProps={{ variant: "body2" }}
                            action={
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        setActiveLogId(l.id);
                                        setMenuAnchor(e.currentTarget);
                                    }}
                                    aria-label="actions"
                                >
                                    <MoreVert />
                                </IconButton>
                            }
                            sx={{ py: 0.5 }}
                        />
                        {l.comment && (
                            <CardContent sx={{ pt: 0, pb: 0.75 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {l.comment}
                                </Typography>
                            </CardContent>
                        )}
                    </Card>
                ))}
                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => {
                        setMenuAnchor(null);
                        setActiveLogId(null);
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            if (activeLogId && itemId) {
                                navigate(`/item/${itemId}/log/${activeLogId}`);
                            }
                            setMenuAnchor(null);
                            setActiveLogId(null);
                        }}
                    >
                        <ListItemIcon>
                            <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            if (activeLogId) {
                                void removeLog(activeLogId);
                            }
                            setMenuAnchor(null);
                            setActiveLogId(null);
                        }}
                    >
                        <ListItemIcon>
                            <Delete fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                </Menu>
            </Stack>
            {!showAll && (
                <Button variant="text" onClick={() => setShowAll(true)}>
                    Show all records
                </Button>
            )}
        </Stack>
    );
}
