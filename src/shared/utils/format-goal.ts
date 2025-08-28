import { Item } from "../types";

export const formatGoal = (g: NonNullable<Item["goal"]>) => {
    const dir = g.direction === "atLeast" ? "At least" : "At most";
    const per = g.period === "day" ? "per day" : g.period === "week" ? "per week" : "per month";
    return `${dir} ${g.value} ${per}`;
};
