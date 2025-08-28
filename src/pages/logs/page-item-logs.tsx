import { Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../shared/api/firebase/auth";
import { useLogs, aggregateLogsByDay } from "../../shared/api/firebase/logs";
import { useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { AddLogCard } from "./components/add-log-card";
import { DateFilters } from "./components/date-filters";
import { DailyChart } from "./components/daily-chart";
import { LogsList } from "./components/logs-list";

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
            <DailyChart data={data} />

            <Typography variant="body2" color="text.secondary">
                {stats.count} records • Last: {stats.lastText}
            </Typography>

            <LogsList
                logs={logs}
                itemId={itemId}
                onEdit={(logId: string) => navigate(`/item/${itemId}/log/${logId}`)}
                onDelete={(logId: string) => void removeLog(logId)}
            />
        </Stack>
    );
};
