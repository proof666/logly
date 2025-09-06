import { collection, getDocs, query, updateDoc, doc, orderBy } from "firebase/firestore";
import { db } from "./config";

export async function updateExistingItemsPositions(userId: string) {
    try {
        const itemsRef = collection(db, "users", userId, "items");
        const q = query(itemsRef, orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);

        const batch = snapshot.docs.map((document, index) =>
            updateDoc(doc(db, "users", userId, "items", document.id), {
                position: index,
            }),
        );

        await Promise.all(batch);
        console.log(`Updated ${batch.length} items with position field`);
    } catch (error) {
        console.error("Error updating items positions:", error);
    }
}
