import React, { createContext, useContext, useEffect, useState } from "react";
import ContentstackLivePreview from "@contentstack/live-preview-utils";

const LivePreviewContext = createContext(null);

export const LivePreviewProvider = ({ children }) => {
  const [livePreview, setLivePreview] = useState(false);

  useEffect(() => {
    // Only initialize Live Preview if we're in the browser
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash && hash.includes("live_preview")) {
        setLivePreview(true);
      }
    }
  }, []);

  return (
    <LivePreviewContext.Provider value={{ livePreview }}>
      {children}
    </LivePreviewContext.Provider>
  );
};

export const useLivePreviewContext = () => {
  const context = useContext(LivePreviewContext);
  if (context === undefined) {
    throw new Error(
      "useLivePreviewContext must be used within a LivePreviewProvider"
    );
  }
  return context;
};
