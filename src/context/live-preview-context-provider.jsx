import React, { createContext, useContext, useEffect, useState } from "react";
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import { onEntryChange } from "../sdk/entry";

const LivePreviewContext = createContext(null);

// Single subscription for the whole app (same as the csr starter). Components
// fetch on mount and refetch when this counter changes (hash arrival / edits).
export const LivePreviewProvider = ({ children }) => {
  const [lpTs, setLpTs] = useState(0);

  useEffect(() => {
    // Visual Builder URLs (?live_preview&builder) make the SDK fire the callback
    // synchronously on register despite skipInitialRender; the mount fetch already
    // used that hash, so ignore that call.
    let registering = true;
    const id = onEntryChange(() => !registering && setLpTs((n) => n + 1), {
      skipInitialRender: true,
    });
    registering = false;
    return () => ContentstackLivePreview.unsubscribeOnEntryChange(id);
  }, []);

  return (
    <LivePreviewContext.Provider value={lpTs}>
      {children}
    </LivePreviewContext.Provider>
  );
};

export const useLivePreviewCtx = () => useContext(LivePreviewContext);
