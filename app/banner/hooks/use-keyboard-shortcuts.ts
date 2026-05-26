"use client";

import { useEffect } from "react";

type Handlers = {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onTitleSizeUp: () => void;
  onTitleSizeDown: () => void;
};

export function useKeyboardShortcuts(handlers: Handlers) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handlers.onUndo();
      } else if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        handlers.onRedo();
      } else if (mod && e.key === "s") {
        e.preventDefault();
        handlers.onSave();
      } else if (e.key === "=" || e.key === "+") {
        handlers.onTitleSizeUp();
      } else if (e.key === "-") {
        handlers.onTitleSizeDown();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlers]);
}
