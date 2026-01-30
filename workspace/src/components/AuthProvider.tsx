"use client";

import { createContext, useContext } from "react";

const AuthContext = createContext<{ userId: string | null }>({
  userId: null,
});

export function AuthProvider({
  userId,
  children,
}: {
  userId: string | null;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ userId }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
