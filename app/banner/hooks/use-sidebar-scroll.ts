import { useCallback, useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import type { BannerDesign } from "../banner-design";
import { clampFontSize } from "../utils";

type SidebarFieldProps = { onFocus: () => void };

export function useSidebarScroll(
  sidebarScrollRef: RefObject<HTMLDivElement | null>,
  patch: (p: Partial<BannerDesign>) => void,
  titleFontSize: number,
  subtitleFontSize: number,
) {
  const sidebarScrollTopRef = useRef(0);

  const rememberSidebarScroll = useCallback(() => {
    const el = sidebarScrollRef.current;
    if (el) sidebarScrollTopRef.current = el.scrollTop;
  }, [sidebarScrollRef]);

  const keepSidebarScroll = useCallback(() => {
    rememberSidebarScroll();
    const top = sidebarScrollTopRef.current;
    requestAnimationFrame(() => {
      const el = sidebarScrollRef.current;
      if (el) el.scrollTop = top;
    });
  }, [rememberSidebarScroll, sidebarScrollRef]);

  const sidebarFieldProps: SidebarFieldProps = {
    onFocus: keepSidebarScroll,
  };

  const handleFontSizeWheel = (
    e: React.WheelEvent<HTMLInputElement>,
    kind: "title" | "subtitle",
  ) => {
    e.preventDefault();
    e.stopPropagation();
    rememberSidebarScroll();
    const step = e.shiftKey ? 5 : 1;
    const delta = e.deltaY < 0 ? step : -step;
    if (kind === "title") {
      patch({ titleFontSize: clampFontSize(titleFontSize + delta) });
    } else {
      patch({ subtitleFontSize: clampFontSize(subtitleFontSize + delta) });
    }
  };

  const dispatchNumericInput = useCallback(
    (input: HTMLInputElement, direction: 1 | -1, steps: number) => {
      const restoreTop = sidebarScrollTopRef.current;

      try {
        if (direction > 0) input.stepUp(steps);
        else input.stepDown(steps);
      } catch {
        const fallbackStep = Number(input.step) || 1;
        const current = Number(input.value) || 0;
        input.value = String(current + fallbackStep * steps * direction);
      }

      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));

      requestAnimationFrame(() => {
        const el = sidebarScrollRef.current;
        if (el) el.scrollTop = restoreTop;
      });
    },
    [sidebarScrollRef],
  );

  useEffect(() => {
    const sidebar = sidebarScrollRef.current;
    if (!sidebar) return;
    const onScroll = () => {
      sidebarScrollTopRef.current = sidebar.scrollTop;
    };
    onScroll();
    sidebar.addEventListener("scroll", onScroll, { passive: true });
    return () => sidebar.removeEventListener("scroll", onScroll);
  }, [sidebarScrollRef]);

  useLayoutEffect(() => {
    const el = sidebarScrollRef.current;
    if (el) el.scrollTop = sidebarScrollTopRef.current;
  }, [titleFontSize, subtitleFontSize, sidebarScrollRef]);

  useEffect(() => {
    const sidebar = sidebarScrollRef.current;
    if (!sidebar) return;

    const onWheel = (e: WheelEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (!sidebar.contains(target)) return;

      const input = target.closest("input");
      if (!input) return;

      const wheelKind = input.dataset.wheelSize;
      if (wheelKind === "title" || wheelKind === "subtitle") {
        e.preventDefault();
        e.stopPropagation();
        rememberSidebarScroll();
        const step = e.shiftKey ? 5 : 1;
        const delta = e.deltaY < 0 ? step : -step;
        if (wheelKind === "title") {
          patch({ titleFontSize: clampFontSize(titleFontSize + delta) });
        } else {
          patch({ subtitleFontSize: clampFontSize(subtitleFontSize + delta) });
        }
        return;
      }

      if (input.type === "number") {
        e.preventDefault();
        e.stopPropagation();
        rememberSidebarScroll();
        const steps = e.shiftKey ? 5 : 1;
        const direction = e.deltaY < 0 ? 1 : -1;
        dispatchNumericInput(input, direction, steps);
        return;
      }

      if (input.getAttribute("inputmode") === "numeric") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    sidebar.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => sidebar.removeEventListener("wheel", onWheel, { capture: true });
  }, [
    dispatchNumericInput,
    rememberSidebarScroll,
    patch,
    titleFontSize,
    subtitleFontSize,
    sidebarScrollRef,
  ]);

  return {
    rememberSidebarScroll,
    sidebarFieldProps,
    handleFontSizeWheel,
  };
}
