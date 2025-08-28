import { Stack, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../shared/api/firebase/auth";
import { useLogs, aggregateLogsByUnit } from "../../shared/api/firebase/logs";
import { useEffect, useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { AddLogCard } from "./components/add-log-card";
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
            <AddLogCard
                date={date}
                setDate={setDate}
                comment={comment}
                setComment={setComment}
                onSubmit={(ts: number, comment: string) => {
                    void addDetailedLog({ actionDate: ts, comment: comment || undefined });
                    setComment("");
                }}
            />

            <DateFilters
                from={from}
                to={to}
                showAll={showAll}
                onChangeFrom={(v: Dayjs | null) => v && setFrom(v.startOf("day"))}
                onChangeTo={(v: Dayjs | null) => v && setTo(v.endOf("day"))}
                onToggleShowAll={() => setShowAll((v) => !v)}
            />

            <Stack direction={"row"} justifyContent="space-between" alignItems="center" gap={2}>
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
                <Stack direction="row" spacing={2} alignItems="center">
                    {item?.goal ? (
                        <Typography variant="caption" color="text.secondary">
                            Goal: {formatGoal(item.goal)}
                        </Typography>
                    ) : null}
                    <Typography variant="body2" color="text.secondary">
                        {stats.count} records • Last: {stats.lastText}
                    </Typography>
                </Stack>
            </Stack>

            <DailyChart
                data={data}
                goalLine={
                    item?.goal
                        ? unit === item.goal.period
                            ? item.goal.value
                            : unit === "day"
                              ? item.goal.period === "week"
                                  ? Math.round((item.goal.value / 7) * 100) / 100
                                  : Math.round((item.goal.value / 30) * 100) / 100
                              : unit === "week"
                                ? item.goal.period === "day"
                                    ? Math.round(item.goal.value * 7 * 100) / 100
                                    : Math.round((item.goal.value / 30) * 7 * 100) / 100
                                : // unit === 'month'
                                  item.goal.period === "day"
                                  ? Math.round(item.goal.value * 30 * 100) / 100
                                  : Math.round(item.goal.value * (30 / 7) * 100) / 100
                        : undefined
                }
            />

            <LogsList
                logs={logs}
                itemId={itemId}
                onEdit={(logId: string) => navigate(`/item/${itemId}/log/${logId}`)}
                onDelete={(logId: string) => void removeLog(logId)}
            />
        </Stack>
    );
};
