import React, { createContext, useContext } from "react";
import type { Services } from "../domain/contracts";

const Context = createContext<Services | null>(null);

export function ServicesProvider({
  children,
  services,
}: {
  children: React.ReactNode;
  services: Services;
}) {
  return <Context.Provider value={services}>{children}</Context.Provider>;
}

export function useServices() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("ServicesProvider missing");
  return ctx;
}
