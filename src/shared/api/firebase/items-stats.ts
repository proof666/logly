import { useCallback, useEffect, useState } from "react";
import { db } from "./config";
import { onSnapshot, query, where, orderBy, Timestamp, collectionGroup } from "firebase/firestore";
import { ItemId, UserId } from "../../types";

const logsGroup = () => collectionGroup(db, "logs");

export function useItemsStats(userId: UserId | null, itemIds: ItemId[]) {
    const [stats, setStats] = useState<Record<ItemId, number[]>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const getLast14Days = useCallback(() => {
        const now = new Date();
        const days = [];
        for (let i = 13; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            days.push(date.getTime());
        }
        return days;
    }, []);

    useEffect(() => {
        if (!userId || itemIds.length === 0) {
            setStats({});
            setLoading(false);
            return;
        }

        setLoading(true);
        const last14Days = getLast14Days();
        const startDate = last14Days[0]!;
        const endDate = last14Days[last14Days.length - 1]! + 24 * 60 * 60 * 1000; // End of last day

        // Query all logs for the user within the date range using collection group query
        const q = query(
            logsGroup(),
            where("userId", "==", userId),
            where("actionDate", ">=", Timestamp.fromMillis(startDate)),
            where("actionDate", "<=", Timestamp.fromMillis(endDate)),
            orderBy("actionDate", "asc"),
        );

        const unsub = onSnapshot(q, (snap) => {
            const logsByItem: Record<ItemId, Record<number, number>> = {};

            // Initialize counters for each item
            itemIds.forEach((itemId) => {
                logsByItem[itemId] = {};
                last14Days.forEach((day) => {
                    logsByItem[itemId]![day] = 0;
                });
            });

            // Count logs per day per item
            snap.docs.forEach((doc) => {
                const data = doc.data();
                const itemId = data.itemId as ItemId;
                const actionDate = (data.actionDate as Timestamp)?.toMillis?.() || data.actionDate;

                if (itemId && actionDate && logsByItem[itemId]) {
                    // Find the day bucket for this log
                    const logDate = new Date(actionDate);
                    logDate.setHours(0, 0, 0, 0);
                    const dayKey = logDate.getTime();

                    if (logsByItem[itemId][dayKey] !== undefined) {
                        logsByItem[itemId][dayKey]++;
                    }
                }
            });

            // Convert to arrays
            const result: Record<ItemId, number[]> = {};
            itemIds.forEach((itemId) => {
                result[itemId] = last14Days.map((day) => logsByItem[itemId]?.[day] || 0);
            });

            setStats(result);
            setLoading(false);
        });

        return () => unsub();
    }, [userId, itemIds, getLast14Days]);

    return { stats, loading };
}
