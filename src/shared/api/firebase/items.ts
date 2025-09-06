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
        const q = query(itemsCol(userId), orderBy("position", "asc"));
        const unsub = onSnapshot(q, (snap) => {
            const res: Item[] = snap.docs.map((d) => ({
                id: d.id,
                userId: userId,
                title: d.get("title"),
                description: d.get("description") ?? undefined,
                category: d.get("category") ?? undefined,
                icon: d.get("icon") ?? undefined,
                goal: d.get("goal") ?? undefined,
                position:
                    d.get("position") ??
                    (d.get("createdAt") as Timestamp)?.toMillis?.() ??
                    Date.now(),
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
            const maxPosition =
                items.length > 0 ? Math.max(...items.map((item) => item.position)) : 0;
            const newPosition = maxPosition + 1;
            await addDoc(itemsCol(userId), {
                userId,
                title: data.title,
                description: data.description ?? null,
                category: data.category ?? null,
                icon: data.icon ?? null,
                goal: data.goal ?? null,
                position: newPosition,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        },
        [userId, items],
    );

    const updateItem = useCallback(
        async (
            id: ItemId,
            patch: Partial<
                Pick<Item, "title" | "description" | "category" | "icon" | "position"> & {
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

    const updateItemPosition = useCallback(
        async (id: ItemId, position: number) => {
            if (!userId) throw new Error("Not authenticated");
            await updateDoc(doc(itemsCol(userId), id), {
                position,
                updatedAt: serverTimestamp(),
            });
        },
        [userId],
    );

    const updateItemsPositions = useCallback(
        async (reorderedItems: Item[]) => {
            if (!userId) throw new Error("Not authenticated");
            const batch = reorderedItems.map((item, index) =>
                updateDoc(doc(itemsCol(userId), item.id), {
                    position: index,
                    updatedAt: serverTimestamp(),
                }),
            );
            await Promise.all(batch);
        },
        [userId],
    );

    return {
        items,
        loading,
        addItem,
        updateItem,
        removeItem,
        updateItemPosition,
        updateItemsPositions,
    };
}
