import { useEffect, useMemo, useState } from "react";
import { auth, googleProvider } from "./config";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { AppUser } from "../../types";

export const mapFirebaseUser = (u: User | null): AppUser | null => {
  if (!u) return null;
  return {
    id: u.uid,
    displayName: u.displayName,
    email: u.email,
    photoURL: u.photoURL,
  };
};

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u: User | null) => {
      setUser(mapFirebaseUser(u));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const actions = useMemo(
    () => ({
      signInWithGoogle: async () => {
        await signInWithPopup(auth, googleProvider);
      },
      signOut: async () => {
        await signOut(auth);
      },
    }),
    []
  );

  return { user, loading, ...actions };
}
