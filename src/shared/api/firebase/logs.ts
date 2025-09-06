import { useCallback, useEffect, useState } from "react";
import { db } from "./config";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import type { QueryConstraint, DocumentData, PartialWithFieldValue } from "firebase/firestore";
import { ItemId, LogId, LogRecord, UserId } from "../../types";

const logsCol = (userId: UserId, itemId: ItemId) =>
    collection(db, "users", userId, "items", itemId, "logs");

export function useLogs(
    userId: UserId | null,
    itemId: ItemId | null,
    options?: { from?: number; to?: number },
) {
    const [logs, setLogs] = useState<LogRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!userId || !itemId) {
            setLogs([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const constraints: QueryConstraint[] = [];
        if (options?.from) {
            constraints.push(where("actionDate", ">=", Timestamp.fromMillis(options.from)));
        }
        if (options?.to) {
            constraints.push(where("actionDate", "<=", Timestamp.fromMillis(options.to)));
        }
        constraints.push(orderBy("actionDate", "desc"));
        const q = query(logsCol(userId, itemId), ...constraints);
        const unsub = onSnapshot(q, (snap) => {
            const res: LogRecord[] = snap.docs.map((d) => ({
                id: d.id,
                userId,
                itemId,
                actionDate: (d.get("actionDate") as Timestamp)?.toMillis?.() ?? Date.now(),
                comment: d.get("comment") ?? undefined,
                createdAt: (d.get("createdAt") as Timestamp)?.toMillis?.() ?? Date.now(),
                updatedAt: (d.get("updatedAt") as Timestamp)?.toMillis?.() ?? Date.now(),
            }));
            setLogs(res);
            setLoading(false);
        });
        return () => unsub();
    }, [userId, itemId, options?.from, options?.to]);

    const addQuickLog = useCallback(async () => {
        if (!userId || !itemId) throw new Error("Not ready");
        await addDoc(logsCol(userId, itemId), {
            userId,
            itemId,
            actionDate: serverTimestamp(),
            comment: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    }, [userId, itemId]);

    const addDetailedLog = useCallback(
        async (data: { actionDate: number; comment?: string }) => {
            if (!userId || !itemId) throw new Error("Not ready");
            await addDoc(logsCol(userId, itemId), {
                userId,
                itemId,
                actionDate: Timestamp.fromMillis(data.actionDate),
                comment: data.comment ?? null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        },
        [userId, itemId],
    );

    const updateLog = useCallback(
        async (id: LogId, patch: Partial<Pick<LogRecord, "actionDate" | "comment">>) => {
            if (!userId || !itemId) throw new Error("Not ready");
            const toUpdate: PartialWithFieldValue<DocumentData> = {
                ...patch,
                updatedAt: serverTimestamp(),
            };
            if (typeof patch.actionDate === "number") {
                toUpdate.actionDate = Timestamp.fromMillis(patch.actionDate);
            }
            await updateDoc(doc(logsCol(userId, itemId), id), toUpdate);
        },
        [userId, itemId],
    );

    const removeLog = useCallback(
        async (id: LogId) => {
            if (!userId || !itemId) throw new Error("Not ready");
            await deleteDoc(doc(logsCol(userId, itemId), id));
        },
        [userId, itemId],
    );

    return { logs, loading, addQuickLog, addDetailedLog, updateLog, removeLog };
}

export function aggregateLogsByDay(logs: LogRecord[]): Array<{ date: string; count: number }> {
    const formatter = new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    const map = new Map<number, number>();
    for (const l of logs) {
        const d = new Date(l.actionDate);
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        map.set(dayStart, (map.get(dayStart) ?? 0) + 1);
    }
    return Array.from(map.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([timestamp, count]) => ({
            date: formatter.format(new Date(timestamp)),
            count,
        }));
}

function pad(n: number) {
    return n < 10 ? `0${n}` : `${n}`;
}

export function aggregateLogsByUnit(
    logs: LogRecord[],
    unit: "day" | "week" | "month",
): Array<{ date: string; count: number }> {
    if (unit === "day") return aggregateLogsByDay(logs);

    const map = new Map<string, number>();
    for (const l of logs) {
        const d = new Date(l.actionDate);
        if (unit === "week") {
            // Monday-based week start
            const day = d.getDay(); // 0..6 (Sun..Sat)
            const diffToMonday = (day + 6) % 7; // 0 for Mon, 6 for Sun
            const weekStart = new Date(d);
            weekStart.setHours(0, 0, 0, 0);
            weekStart.setDate(d.getDate() - diffToMonday);
            const key = `${weekStart.getFullYear()}-${pad(weekStart.getMonth() + 1)}-${pad(
                weekStart.getDate(),
            )}`; // YYYY-MM-DD (week start)
            map.set(key, (map.get(key) ?? 0) + 1);
        } else {
            // month
            const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; // YYYY-MM
            map.set(key, (map.get(key) ?? 0) + 1);
        }
    }
    return Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({ date, count }));
}
