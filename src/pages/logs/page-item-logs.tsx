import {
    Stack,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Fab,
    Drawer,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    Button,
    ButtonGroup,
    Alert,
} from "@mui/material";
import { Add, Bolt, Close } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../shared/api/firebase/auth";
import { useLogs, aggregateLogsByUnit } from "../../shared/api/firebase/logs";
import { useEffect, useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { AddLogForm } from "./components/add-log-card";
import { DateFilters } from "./components/date-filters";
import { DailyChart } from "./components/daily-chart";
import { LogsList } from "./components/logs-list";
import { useItems } from "../../shared/api/firebase/items.js";
import { formatGoal } from "../../shared/utils/format-goal.js";

export const PageItemLogs = () => {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [from, setFrom] = useState<Dayjs>(dayjs().subtract(30, "day").startOf("day"));
    const [to, setTo] = useState<Dayjs>(dayjs().endOf("day"));
    const [showAll, setShowAll] = useState(false);
    const [date, setDate] = useState<Dayjs | null>(null);
    const [comment, setComment] = useState("");
    const { logs, addDetailedLog, removeLog } = useLogs(
        user?.id ?? null,
        itemId ?? null,
        showAll ? undefined : { from: from.valueOf(), to: to.valueOf() },
    );
    const { items } = useItems(user?.id ?? null);
    const item = useMemo(() => items.find((i) => i.id === itemId), [items, itemId]);
    const [unit, setUnit] = useState<"day" | "week" | "month">("day");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [desktopDialogOpen, setDesktopDialogOpen] = useState(false);
    // default unit based on item goal period
    useEffect(() => {
        if (item?.goal) setUnit(item.goal.period);
    }, [item?.goal]);

    const data = aggregateLogsByUnit(logs, unit);
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
            <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", md: "center" }}
                spacing={2}
            >
                <DateFilters
                    from={from}
                    to={to}
                    showAll={showAll}
                    onChangeFrom={(v: Dayjs | null) => v && setFrom(v.startOf("day"))}
                    onChangeTo={(v: Dayjs | null) => v && setTo(v.endOf("day"))}
                    onToggleShowAll={() => setShowAll((v) => !v)}
                />
                <ButtonGroup sx={{ width: { xs: "100%", md: "auto" } }}>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setDesktopDialogOpen(true)}
                        sx={{
                            flex: { xs: 1, md: "initial" },
                            display: { xs: "none", sm: "inline-flex" },
                        }}
                    >
                        Log
                    </Button>
                    <Button
                        startIcon={<Bolt />}
                        variant="outlined"
                        onClick={() => {
                            const now = dayjs();
                            const base = date ?? now;
                            const ts = base
                                .hour(now.hour())
                                .minute(now.minute())
                                .second(now.second())
                                .millisecond(now.millisecond())
                                .valueOf();
                            addDetailedLog({ actionDate: ts });
                        }}
                        sx={{ whiteSpace: "nowrap", flex: { xs: 1, md: "initial" } }}
                    >
                        Quick Log
                    </Button>
                </ButtonGroup>
            </Stack>

            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                gap={2}
                sx={{ px: { xs: 0.5, sm: 0 } }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                >
                    {item?.goal ? (
                        <Alert severity="info">
                            <Typography variant="body2" color="text.secondary">
                                Goal: {formatGoal(item.goal)}
                            </Typography>
                        </Alert>
                    ) : null}
                    <Typography variant="body2" color="text.secondary">
                        {stats.count} records • Last: {stats.lastText}
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">View:</Typography>
                    <ToggleButtonGroup
                        color="primary"
                        size="small"
                        value={unit}
                        exclusive
                        onChange={(_, v) => v && setUnit(v)}
                    >
                        <ToggleButton value="day">Days</ToggleButton>
                        <ToggleButton value="week">Weeks</ToggleButton>
                        <ToggleButton value="month">Months</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
            </Stack>

            <DailyChart data={data} goalLine={item?.goal?.value} />

            <LogsList
                logs={logs}
                itemId={itemId}
                onEdit={(logId: string) => navigate(`/item/${itemId}/log/${logId}`)}
                onDelete={(logId: string) => void removeLog(logId)}
            />

            {/* Mobile FAB */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={() => setDrawerOpen(true)}
                sx={{
                    position: "fixed",
                    right: 24,
                    bottom: 24,
                    display: { xs: "flex", md: "none" },
                }}
            >
                <Add />
            </Fab>

            {/* Mobile Drawer for adding log */}
            <Drawer
                anchor="bottom"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{ display: { xs: "block", md: "none" } }}
                PaperProps={{
                    sx: { height: "55vh", borderTopLeftRadius: 8, borderTopRightRadius: 8 },
                }}
            >
                <Box
                    sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">Add log</Typography>
                        <IconButton aria-label="close" onClick={() => setDrawerOpen(false)}>
                            <Close />
                        </IconButton>
                    </Stack>
                    <AddLogForm
                        date={date}
                        setDate={setDate}
                        comment={comment}
                        setComment={setComment}
                        onSubmit={(ts: number, comment: string) => {
                            void addDetailedLog({ actionDate: ts, comment: comment || undefined });
                            setComment("");
                            setDrawerOpen(false);
                        }}
                    />
                </Box>
            </Drawer>

            {/* Desktop Dialog for adding log */}
            <Dialog
                open={desktopDialogOpen}
                onClose={() => setDesktopDialogOpen(false)}
                fullWidth
                maxWidth="sm"
                sx={{ display: { xs: "none", md: "block" } }}
            >
                <DialogTitle sx={{ pr: 6 }}>
                    Add log
                    <IconButton
                        aria-label="close"
                        onClick={() => setDesktopDialogOpen(false)}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <AddLogForm
                    date={date}
                    setDate={setDate}
                    comment={comment}
                    setComment={setComment}
                    onSubmit={(ts: number, comment: string) => {
                        void addDetailedLog({ actionDate: ts, comment: comment || undefined });
                        setComment("");
                        setDesktopDialogOpen(false);
                    }}
                />
            </Dialog>
        </Stack>
    );
};
