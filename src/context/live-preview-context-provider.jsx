import React, { createContext, useContext, useEffect, useState } from "react";
import { onEntryChange } from "../sdk/entry";

const LivePreviewContext = createContext(null);

// Single subscription for the whole app (same as the csr starter). Components
// fetch on mount and refetch when this counter changes (hash arrival / edits).
export const LivePreviewProvider = ({ children }) => {
  const [lpTs, setLpTs] = useState(0);

  useEffect(() => {
    onEntryChange(() => setLpTs((n) => n + 1), { skipInitialRender: true });
  }, []);

  return (
    <LivePreviewContext.Provider value={lpTs}>
      {children}
    </LivePreviewContext.Provider>
  );
};

export const useLivePreviewCtx = () => useContext(LivePreviewContext);
