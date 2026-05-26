"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BannerDesign } from "../banner-design";
import { cloneDesign, createDefaultDesign, mergeDesign, sanitizeDesign } from "../banner-design";
import {
  decodeDesignFromHash,
  loadDesignLocal,
  saveDesignLocal,
} from "../design-persistence";

const MAX_UNDO = 50;
const HISTORY_GROUP_MS = 500;

const historyKeyForPatch = (partial: Partial<BannerDesign>) =>
  Object.keys(partial).sort().join("|");

export function useBannerStore() {
  const [design, setDesign] = useState<BannerDesign>(createDefaultDesign);
  const [compareDesign, setCompareDesign] = useState<BannerDesign | null>(null);
  const [savedDesigns, setSavedDesigns] = useState<{ id: string; name: string; design: BannerDesign }[]>(
    [],
  );
  const undoStack = useRef<BannerDesign[]>([]);
  const redoStack = useRef<BannerDesign[]>([]);
  const lastPatchKey = useRef<string | null>(null);
  const lastPatchAt = useRef(0);
  const hydrated = useRef(false);
  const [historyMeta, setHistoryMeta] = useState({ undoCount: 0, redoCount: 0 });

  const syncHistoryMeta = useCallback(() => {
    setHistoryMeta({
      undoCount: undoStack.current.length,
      redoCount: redoStack.current.length,
    });
  }, []);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const fromHash = typeof window !== "undefined" ? decodeDesignFromHash(window.location.hash) : null;
    const fromLocal = loadDesignLocal();
    const initial = sanitizeDesign(fromHash ?? fromLocal ?? createDefaultDesign());
    const saved = (() => {
      try {
        const raw = localStorage.getItem("banner-builders-saved-designs");
        return raw
          ? (JSON.parse(raw) as { id: string; name: string; design: BannerDesign }[])
          : null;
      } catch {
        return null;
      }
    })();

    queueMicrotask(() => {
      setDesign(initial);
      if (saved) setSavedDesigns(saved);
    });
  }, []);

  const pushHistory = useCallback((prev: BannerDesign) => {
    undoStack.current.push(cloneDesign(prev));
    if (undoStack.current.length > MAX_UNDO) undoStack.current.shift();
    redoStack.current = [];
    syncHistoryMeta();
  }, [syncHistoryMeta]);

  const resetHistoryGroup = useCallback(() => {
    lastPatchKey.current = null;
    lastPatchAt.current = 0;
  }, []);

  const setDesignWithHistory = useCallback((next: BannerDesign | ((p: BannerDesign) => BannerDesign)) => {
    setDesign((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      pushHistory(prev);
      resetHistoryGroup();
      return resolved;
    });
  }, [pushHistory, resetHistoryGroup]);

  const patch = useCallback(
    (partial: Partial<BannerDesign>) => {
      const key = historyKeyForPatch(partial);
      setDesign((prev) => {
        const next = mergeDesign(prev, partial);
        const now = Date.now();
        const grouped =
          key.length > 0 &&
          lastPatchKey.current === key &&
          now - lastPatchAt.current < HISTORY_GROUP_MS;

        if (!grouped) {
          undoStack.current.push(cloneDesign(prev));
          if (undoStack.current.length > MAX_UNDO) undoStack.current.shift();
        }

        redoStack.current = [];
        lastPatchKey.current = key;
        lastPatchAt.current = now;
        syncHistoryMeta();
        return next;
      });
    },
    [syncHistoryMeta],
  );

  const patchSilent = useCallback((partial: Partial<BannerDesign>) => {
    setDesign((prev) => mergeDesign(prev, partial));
  }, []);

  const undo = useCallback(() => {
    const prev = undoStack.current.pop();
    if (!prev) return;
    setDesign((current) => {
      redoStack.current.push(cloneDesign(current));
      resetHistoryGroup();
      syncHistoryMeta();
      return prev;
    });
  }, [resetHistoryGroup, syncHistoryMeta]);

  const redo = useCallback(() => {
    const next = redoStack.current.pop();
    if (!next) return;
    setDesign((current) => {
      undoStack.current.push(cloneDesign(current));
      resetHistoryGroup();
      syncHistoryMeta();
      return next;
    });
  }, [resetHistoryGroup, syncHistoryMeta]);

  const resetDesign = useCallback(() => {
    setDesignWithHistory(createDefaultDesign());
  }, [setDesignWithHistory]);

  const duplicateToCompare = useCallback(() => {
    setCompareDesign(cloneDesign(design));
  }, [design]);

  const loadDesign = useCallback((d: BannerDesign) => {
    setDesignWithHistory(d);
  }, [setDesignWithHistory]);

  const persistLocal = useCallback(() => {
    saveDesignLocal(design);
  }, [design]);

  const addSavedDesign = useCallback((name: string) => {
    const entry = { id: `${Date.now()}`, name, design: cloneDesign(design) };
    setSavedDesigns((list) => {
      const next = [...list, entry];
      localStorage.setItem("banner-builders-saved-designs", JSON.stringify(next));
      return next;
    });
  }, [design]);

  return {
    design,
    setDesign: setDesignWithHistory,
    patch,
    patchSilent,
    compareDesign,
    setCompareDesign,
    savedDesigns,
    undo,
    redo,
    canUndo: historyMeta.undoCount > 0,
    canRedo: historyMeta.redoCount > 0,
    undoCount: historyMeta.undoCount,
    redoCount: historyMeta.redoCount,
    resetDesign,
    duplicateToCompare,
    loadDesign,
    persistLocal,
    addSavedDesign,
  };
}
