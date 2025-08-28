import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createContext, PropsWithChildren, useMemo, useState, useContext, useEffect } from "react";

type Mode = "light" | "dark";
const COLOR_PRESET = [
    "#C95E34",
    "#1976d2",
    "#388e3c",
    "#d32f2f",
    "#7b1fa2",
    "#fbc02d",
    "#0288d1",
    "#5d4037",
    "#455a64",
    "#009688",
] as const;

type ThemeSettings = {
    mode: Mode;
    color: string;
    toggleMode: () => void;
    setColor: (color: string) => void;
    preset: readonly string[];
};

const ThemeSettingsContext = createContext<ThemeSettings>({
    mode: "light",
    color: COLOR_PRESET[0],
    toggleMode: () => {},
    setColor: () => {},
    preset: COLOR_PRESET,
});

export function useThemeSettings() {
    return useContext(ThemeSettingsContext);
}

export function ThemeModeProvider({ children }: PropsWithChildren) {
    const [mode, setMode] = useState<Mode>(() => (localStorage.getItem("mode") as Mode) || "light");
    const [color, setColor] = useState<string>(
        () => localStorage.getItem("primaryColor") || COLOR_PRESET[0],
    );
    useEffect(() => {
        localStorage.setItem("mode", mode);
    }, [mode]);
    useEffect(() => {
        localStorage.setItem("primaryColor", color);
    }, [color]);
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: color,
                    },
                },
            }),
        [mode, color],
    );
    const value = useMemo(
        () => ({
            mode,
            color,
            toggleMode: () => setMode((m) => (m === "light" ? "dark" : "light")),
            setColor,
            preset: COLOR_PRESET,
        }),
        [mode, color],
    );
    return (
        <ThemeSettingsContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <CssBaseline />
                    {children}
                </LocalizationProvider>
            </ThemeProvider>
        </ThemeSettingsContext.Provider>
    );
}
