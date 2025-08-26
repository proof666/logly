import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/api/firebase/auth";
import { useItems } from "../../shared/api/firebase/items";

export function ItemEditPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, updateItem, removeItem } = useItems(user?.id ?? null);
  const item = useMemo(
    () => items.find((i) => i.id === itemId),
    [items, itemId]
  );
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setIcon(item.icon ?? "");
      setDescription(item.description ?? "");
    }
  }, [item]);

  if (!item) return <Typography mt={2}>Item not found</Typography>;

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Edit item</Typography>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            sx={{ width: 160 }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={async () => {
                if (!itemId) return;
                await updateItem(itemId, {
                  title: title.trim() || item.title,
                  icon: icon || (null as any),
                  description: description || (null as any),
                });
                navigate(`/item/${itemId}`);
              }}
            >
              Save
            </Button>
            <Button
              color="error"
              variant="outlined"
              onClick={async () => {
                if (!itemId) return;
                await removeItem(itemId);
                navigate("/");
              }}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
