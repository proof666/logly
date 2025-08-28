import { Stack, Button, useMediaQuery, useTheme } from "@mui/material";
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
    const theme = useTheme();
    const isBelowMd = useMediaQuery(theme.breakpoints.down("md")); // < 900px
    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyItems={{ xs: "stretch" }}
        >
            <DatePicker
                label="From"
                value={from}
                onChange={onChangeFrom}
                disabled={showAll}
                slotProps={{ textField: { fullWidth: isBelowMd } }}
            />
            <DatePicker
                label="To"
                value={to}
                onChange={onChangeTo}
                disabled={showAll}
                slotProps={{ textField: { fullWidth: isBelowMd } }}
            />
            <Button
                variant={showAll ? "contained" : "outlined"}
                onClick={onToggleShowAll}
                sx={{ whiteSpace: "nowrap", minWidth: { xs: "100%", sm: "100px" } }}
            >
                {showAll ? "Showing all" : "Show all"}
            </Button>
        </Stack>
    );
}
