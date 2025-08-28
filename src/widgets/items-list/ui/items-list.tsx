import { Item } from "../../../shared/types";
import React, { FC } from "react";
import { ItemRow } from "./item-row.js";

interface ItemsListProps {
    items: Item[];
}

export const ItemsList: FC<ItemsListProps> = ({ items }) => {
    return (
        <>
            {items.map((i) => (
                <ItemRow key={i.id} item={i} />
            ))}
        </>
    );
};
