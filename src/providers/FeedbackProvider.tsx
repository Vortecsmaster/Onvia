import React, { createContext, useContext, useEffect, useState } from "react";
import { Toast } from "../components/feedback/Toast";
const Context = createContext<(message: string) => void>(() => undefined);
export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({ message: "", id: 0 });
  useEffect(() => {
    if (!state.message) return;
    const timer = setTimeout(
      () => setState((s) => ({ ...s, message: "" })),
      3200,
    );
    return () => clearTimeout(timer);
  }, [state]);
  return (
    <Context.Provider
      value={(message) => setState({ message, id: Date.now() })}
    >
      {children}
      <Toast message={state.message} />
    </Context.Provider>
  );
}
export const useNotify = () => useContext(Context);
