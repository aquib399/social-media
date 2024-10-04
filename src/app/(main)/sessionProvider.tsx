"use client";

import { createContext, useContext } from "react";
import { Session, User } from "lucia";
import Navbar from "./navbar";

interface SessionContext {
  user: User;
  session: Session;
}

const SessionContext = createContext<SessionContext | null>(null);

export function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  return (
    <SessionContext.Provider value={value}>
      <main className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto max-w-7xl p-3.5 sm:p-5">{children}</div>
      </main>
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
}
