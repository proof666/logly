import {
  Avatar,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CardActionArea,
  Box,
} from "@mui/material";
import { Add, Edit, MoreVert } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useAuth } from "../../shared/api/firebase/auth";
import { useItems } from "../../shared/api/firebase/items";
import { Link, useNavigate } from "react-router-dom";

export function HomePage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { items, addItem } = useItems(user?.id ?? null);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<string>("");
  const iconChoices = useMemo(
    () => ["⭐️", "🔥", "💧", "🧠", "💪", "📚", "🧘", "🍎", "🛏️", "🧹"],
    []
  );

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
    <Stack spacing={3} mt={2}>
      <Card>
        <CardContent>
          <Typography variant="h6">Add item</Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <TextField
              size="small"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              size="small"
              label="Icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g. ⭐️"
              sx={{ width: 120 }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={async () => {
                if (title.trim()) {
                  await addItem({
                    title: title.trim(),
                    icon: icon || undefined,
                  });
                  setTitle("");
                  setIcon("");
                }
              }}
            >
              Add
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={1}>
        {items.map((i) => (
          <ItemCard
            key={i.id}
            item={{
              id: i.id,
              title: i.title,
              icon: i.icon,
              description: i.description,
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
}

function ItemCard({
  item,
}: {
  item: { id: string; title: string; icon?: string; description?: string };
}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  return (
    <Card>
      <Box sx={{ position: "relative" }}>
        <CardActionArea onClick={() => navigate(`/item/${item.id}`)}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center">
              {item.icon ? (
                <Avatar sx={{ width: 28, height: 28, fontSize: 18 }}>
                  {item.icon}
                </Avatar>
              ) : null}
              <Typography variant="h6">{item.title}</Typography>
            </Stack>
            {item.description && (
              <Typography color="text.secondary">{item.description}</Typography>
            )}
          </CardContent>
        </CardActionArea>
        <IconButton
          size="small"
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="actions"
        >
          <MoreVert />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          <MenuItem
            onClick={() => {
              navigate(`/item/${item.id}/edit`);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Card>
  );
}
