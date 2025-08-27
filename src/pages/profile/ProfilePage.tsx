import { Avatar, Button, Stack, Switch, Typography, Box, IconButton } from "@mui/material";
import { useAuth } from "../../shared/api/firebase/auth";
import { useThemeSettings } from "../../app/providers/theme";

export function ProfilePage() {
    const { user, signOut, signInWithGoogle } = useAuth();
    const { mode, toggleMode, color, setColor, preset } = useThemeSettings();
    if (!user) {
        return (
            <Stack spacing={2} alignItems="center" mt={4}>
                <Typography variant="h5">Sign in</Typography>
                <Button variant="contained" onClick={signInWithGoogle}>
                    Sign in with Google
                </Button>
            </Stack>
        );
    }
    return (
        <Stack spacing={2} mt={2} alignItems="center">
            <Avatar src={user.photoURL ?? undefined} sx={{ width: 72, height: 72 }} />
            <Typography variant="h6">{user.displayName}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Dark theme</Typography>
                <Switch checked={mode === "dark"} onChange={toggleMode} />
            </Stack>
            <Box mt={2}>
                <Typography variant="subtitle1" gutterBottom align="center">
                    Primary color
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center">
                    {preset.map((c) => (
                        <IconButton
                            key={c}
                            onClick={() => setColor(c)}
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: c,
                                border: color === c ? "2px solid #333" : "2px solid transparent",
                                boxShadow: color === c ? 2 : 0,
                                transition: "box-shadow 0.2s, border 0.2s",
                                "&:hover": { boxShadow: 4 },
                            }}
                        />
                    ))}
                </Stack>
            </Box>
            <Button variant="outlined" color="error" onClick={signOut}>
                Sign out
            </Button>
        </Stack>
    );
}
