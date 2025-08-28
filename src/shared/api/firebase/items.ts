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
} from "firebase/firestore";
import { Item, ItemId, UserId } from "../../types";

const itemsCol = (userId: UserId) => collection(db, "users", userId, "items");

export function useItems(userId: UserId | null) {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(!!userId);

    useEffect(() => {
        if (!userId) {
            setItems([]);
            setLoading(false);
            return;
        }
        const q = query(itemsCol(userId), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            const res: Item[] = snap.docs.map((d) => ({
                id: d.id,
                userId: userId,
                title: d.get("title"),
                description: d.get("description") ?? undefined,
                category: d.get("category") ?? undefined,
                icon: d.get("icon") ?? undefined,
                goal: d.get("goal") ?? undefined,
                createdAt: (d.get("createdAt") as Timestamp)?.toMillis?.() ?? Date.now(),
                updatedAt: (d.get("updatedAt") as Timestamp)?.toMillis?.() ?? Date.now(),
            }));
            setItems(res);
            setLoading(false);
        });
        return () => unsub();
    }, [userId]);

    const addItem = useCallback(
        async (data: {
            title: string;
            description?: string;
            category?: string;
            icon?: string;
            goal?: {
                value: number;
                direction: "atLeast" | "atMost";
                period: "day" | "week" | "month";
            };
        }) => {
            if (!userId) throw new Error("Not authenticated");
            await addDoc(itemsCol(userId), {
                userId,
                title: data.title,
                description: data.description ?? null,
                category: data.category ?? null,
                icon: data.icon ?? null,
                goal: data.goal ?? null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        },
        [userId],
    );

    const updateItem = useCallback(
        async (
            id: ItemId,
            patch: Partial<
                Pick<Item, "title" | "description" | "category" | "icon"> & {
                    goal: Item["goal"] | null;
                }
            >,
        ) => {
            if (!userId) throw new Error("Not authenticated");
            await updateDoc(doc(itemsCol(userId), id), {
                ...patch,
                updatedAt: serverTimestamp(),
            });
        },
        [userId],
    );

    const removeItem = useCallback(
        async (id: ItemId) => {
            if (!userId) throw new Error("Not authenticated");
            await deleteDoc(doc(itemsCol(userId), id));
        },
        [userId],
    );

    return { items, loading, addItem, updateItem, removeItem };
}
