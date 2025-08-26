import { Avatar, Button, Stack, Switch, Typography } from "@mui/material";
import { useAuth } from "../../shared/api/firebase/auth";
import { useThemeMode } from "../../app/providers/theme";

export function ProfilePage() {
    const { user, signOut, signInWithGoogle } = useAuth();
    const { mode, toggle } = useThemeMode();
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
                <Switch checked={mode === "dark"} onChange={toggle} />
            </Stack>
            <Button variant="outlined" color="error" onClick={signOut}>
                Sign out
            </Button>
        </Stack>
    );
}
