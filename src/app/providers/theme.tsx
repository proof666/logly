import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createContext, PropsWithChildren, useMemo, useState, useContext, useEffect } from "react";

type Mode = "light" | "dark";

const ThemeModeContext = createContext<{ mode: Mode; toggle: () => void }>({
    mode: "light",
    toggle: () => {},
});

export function useThemeMode() {
    return useContext(ThemeModeContext);
}

export function ThemeModeProvider({ children }: PropsWithChildren) {
    const [mode, setMode] = useState<Mode>(() => (localStorage.getItem("mode") as Mode) || "light");
    useEffect(() => {
        localStorage.setItem("mode", mode);
    }, [mode]);
    const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
    const value = useMemo(
        () => ({
            mode,
            toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
        }),
        [mode],
    );
    return (
        <ThemeModeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <CssBaseline />
                    {children}
                </LocalizationProvider>
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
}
