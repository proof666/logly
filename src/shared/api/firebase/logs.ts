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
    options?: { since?: number },
) {
    const [logs, setLogs] = useState<LogRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(!!(userId && itemId));

    useEffect(() => {
        if (!userId || !itemId) {
            setLogs([]);
            setLoading(false);
            return;
        }
        const constraints: QueryConstraint[] = [];
        if (options?.since) {
            constraints.push(where("actionDate", ">=", Timestamp.fromMillis(options.since)));
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
    }, [userId, itemId, options?.since]);

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
    const map = new Map<string, number>();
    for (const l of logs) {
        const key = formatter.format(l.actionDate);
        map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries())
        .sort((a, b) => {
            const [da, db] = [a[0], b[0]];
            return da.localeCompare(db);
        })
        .map(([date, count]) => ({ date, count }));
}
