import { Stack, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";

type Props = {
    from: Dayjs;
    to: Dayjs;
    showAll: boolean;
    onChangeFrom: (v: Dayjs | null) => void;
    onChangeTo: (v: Dayjs | null) => void;
    onToggleShowAll: () => void;
};

export function DateFilters({
    from,
    to,
    showAll,
    onChangeFrom,
    onChangeTo,
    onToggleShowAll,
}: Props) {
    return (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <DatePicker label="From" value={from} onChange={onChangeFrom} disabled={showAll} />
            <DatePicker label="To" value={to} onChange={onChangeTo} disabled={showAll} />
            <Button
                variant={showAll ? "contained" : "outlined"}
                onClick={onToggleShowAll}
                sx={{ whiteSpace: "nowrap" }}
            >
                {showAll ? "Showing all" : "Show all"}
            </Button>
        </Stack>
    );
}
