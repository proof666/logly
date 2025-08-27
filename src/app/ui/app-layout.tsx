import { AppBar, Box, Container, IconButton, Toolbar, Typography } from "@mui/material";
import { ArrowBack, Brightness4, Brightness7, Person } from "@mui/icons-material";
import { Link, Outlet, useLocation, useMatches, useNavigate, type UIMatch } from "react-router-dom";
import { useThemeSettings } from "../providers/theme";
import { useAuth } from "../../shared/api/firebase/auth";
import { useItems } from "../../shared/api/firebase/items";
import { useMemo } from "react";

export function AppLayout() {
    const { mode, toggleMode } = useThemeSettings();
    const navigate = useNavigate();
    const location = useLocation();
    const matches = useMatches();
    const { user } = useAuth();
    const { items } = useItems(user?.id ?? null);
    const isRoot = location.pathname === "/";
    const current = matches[matches.length - 1] as UIMatch | undefined;
    const itemIdParam = useMemo(() => {
        // Find any match that has an itemId param
        for (let i = matches.length - 1; i >= 0; i--) {
            const m = matches[i] as UIMatch | undefined;
            const id = m?.params?.itemId as string | undefined;
            if (id) return id;
        }
        return undefined;
    }, [matches]);
    const itemTitle = useMemo(() => {
        if (!itemIdParam) return undefined;
        const found = items.find((it) => it.id === itemIdParam);
        return found?.title;
    }, [items, itemIdParam]);
    const pageTitle =
        itemTitle ?? (current?.handle as { title?: string } | undefined)?.title ?? "Habit Logger";
    return (
        <Box sx={{ minHeight: "100%" }}>
            <AppBar position="static">
                <Toolbar>
                    {isRoot ? (
                        <Typography
                            component={Link}
                            to="/"
                            variant="h6"
                            sx={{ color: "inherit", textDecoration: "none", flexGrow: 1 }}
                        >
                            Habit Logger
                        </Typography>
                    ) : (
                        <>
                            <IconButton
                                color="inherit"
                                edge="start"
                                aria-label="back"
                                onClick={() => navigate(-1)}
                            >
                                <ArrowBack />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                                {pageTitle}
                            </Typography>
                        </>
                    )}
                    <IconButton color="inherit" onClick={toggleMode} aria-label="toggle theme">
                        {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    <IconButton color="inherit" component={Link} to="/profile" aria-label="profile">
                        <Person />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container className="container">
                <Outlet />
            </Container>
        </Box>
    );
}
