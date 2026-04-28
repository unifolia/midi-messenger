// Genuinely the most complex part of this app

import {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";

const INTERACTIVE_SELECTOR = "select, input, button, textarea, .react-colorful";

const useDragReorder = (
  items: { id: number }[],
  onCommit: (orderedIds: number[]) => void,
) => {
  const [orderedIds, setOrderedIds] = useState<number[]>(() =>
    items.map((i) => i.id),
  );
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const orderedIdsRef = useRef(orderedIds);
  const onCommitRef = useRef(onCommit);
  const itemElsRef = useRef(new Map<number, HTMLElement>());
  const prevRectsRef = useRef(new Map<number, DOMRect>());
  const needsFlipRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragActiveRef = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    onCommitRef.current = onCommit;
  }, [onCommit]);

  useEffect(() => () => cleanupRef.current?.(), []);

  useEffect(() => {
    if (dragActiveRef.current) return;
    const newIds = items.map((i) => i.id);
    setOrderedIds(newIds);
    orderedIdsRef.current = newIds;
  }, [items]);

  useEffect(() => {
    orderedIdsRef.current = orderedIds;
  }, [orderedIds]);

  useLayoutEffect(() => {
    if (!needsFlipRef.current) return;
    needsFlipRef.current = false;

    const oldRects = prevRectsRef.current;

    itemElsRef.current.forEach((el, id) => {
      if (id === draggedId) return;

      const oldRect = oldRects.get(id);
      if (!oldRect) return;

      const newRect = el.getBoundingClientRect();
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;

      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

      el.getAnimations().forEach((a) => a.cancel());

      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: "translate(0, 0)" },
        ],
        {
          duration: 200,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        },
      );
    });
  }, [orderedIds, draggedId]);

  const snapshotRects = () => {
    itemElsRef.current.forEach((el) => {
      el.getAnimations().forEach((a) => a.cancel());
    });
    const rects = new Map<number, DOMRect>();
    itemElsRef.current.forEach((el, id) => {
      rects.set(id, el.getBoundingClientRect());
    });
    prevRectsRef.current = rects;
    needsFlipRef.current = true;
  };

  const computeTargetIndex = (
    pointerX: number,
    pointerY: number,
    dragId: number,
  ): number => {
    const currentOrder = orderedIdsRef.current;

    const slots: { id: number; rect: DOMRect }[] = [];
    for (const id of currentOrder) {
      if (id === dragId) continue;
      const el = itemElsRef.current.get(id);
      if (!el) continue;
      slots.push({ id, rect: el.getBoundingClientRect() });
    }

    let singleColumn = true;
    for (let i = 1; i < slots.length; i++) {
      if (slots[i].rect.top < slots[i - 1].rect.bottom - 1) {
        singleColumn = false;
        break;
      }
    }

    for (let i = 0; i < slots.length; i++) {
      const { rect } = slots[i];

      if (singleColumn) {
        const midY = rect.top + rect.height / 2;
        if (pointerY < midY) return i;
      } else {
        const midX = rect.left + rect.width / 2;
        if (pointerY < rect.top) return i;
        if (pointerY < rect.bottom && pointerX < midX) return i;
      }
    }

    return slots.length;
  };

  const refCacheRef = useRef(
    new Map<number, (el: HTMLElement | null) => void>(),
  );
  const registerRef = useCallback((id: number) => {
    let fn = refCacheRef.current.get(id);
    if (!fn) {
      fn = (el: HTMLElement | null) => {
        if (el) itemElsRef.current.set(id, el);
        else {
          itemElsRef.current.delete(id);
          refCacheRef.current.delete(id);
        }
      };
      refCacheRef.current.set(id, fn);
    }
    return fn;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent, id: number) => {
    const target = e.target as HTMLElement;
    if (target.closest(INTERACTIVE_SELECTOR)) return;
    if (e.button !== 0) return;

    const el = itemElsRef.current.get(id);
    if (!el) return;

    e.preventDefault();

    const rect = el.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    let clone: HTMLElement | null = null;
    let activated = false;
    let finished = false;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    const originalOrder = [...orderedIdsRef.current];

    const activate = () => {
      activated = true;
      dragActiveRef.current = true;

      clone = el.cloneNode(true) as HTMLElement;
      const currentRect = el.getBoundingClientRect();

      clone.style.position = "fixed";
      clone.style.left = `${currentRect.left}px`;
      clone.style.top = `${currentRect.top}px`;
      clone.style.width = `${currentRect.width}px`;
      clone.style.height = `${currentRect.height}px`;
      clone.style.zIndex = "9999";
      clone.style.margin = "0";
      clone.style.pointerEvents = "none";
      clone.style.opacity = "0.85";
      clone.style.boxShadow = "0 20px 60px rgba(0,0,0,0.5)";
      clone.style.cursor = "grabbing";
      clone.style.willChange = "left, top";
      clone.style.transition = "box-shadow 200ms, opacity 200ms";

      document.body.appendChild(clone);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";

      el.style.opacity = "0";
      el.style.transition = "none";

      setDraggedId(id);
    };

    const onMove = (me: PointerEvent) => {
      if (!activated) {
        const dx = me.clientX - startX;
        const dy = me.clientY - startY;
        if (Math.sqrt(dx * dx + dy * dy) < 5) return;
        activate();
      }

      if (clone) {
        clone.style.left = `${me.clientX - offsetX}px`;
        clone.style.top = `${me.clientY - offsetY}px`;
      }

      const targetIdx = computeTargetIndex(me.clientX, me.clientY, id);
      const currentOrder = orderedIdsRef.current;
      const withoutDragged = currentOrder.filter((cid) => cid !== id);
      const newOrder = [...withoutDragged];
      newOrder.splice(targetIdx, 0, id);

      if (newOrder.some((nid, i) => nid !== currentOrder[i])) {
        snapshotRects();
        orderedIdsRef.current = newOrder;
        setOrderedIds(newOrder);
      }
    };

    const cleanup = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    const abort = () => {
      if (finished) return;
      finished = true;
      cleanup();
      if (settleTimer !== null) {
        clearTimeout(settleTimer);
        settleTimer = null;
      }
      if (clone) clone.remove();
      el.style.opacity = "";
      el.style.transition = "";
      dragActiveRef.current = false;
      cleanupRef.current = null;
    };

    const onUp = () => {
      if (finished) return;
      cleanup();

      if (!activated || !clone) {
        finished = true;
        dragActiveRef.current = false;
        cleanupRef.current = null;
        return;
      }

      const suppressClick = (ce: MouseEvent) => {
        ce.stopPropagation();
        ce.preventDefault();
      };
      document.addEventListener("click", suppressClick, { capture: true });
      requestAnimationFrame(() => {
        document.removeEventListener("click", suppressClick, {
          capture: true,
        });
      });

      const finalRect = el.getBoundingClientRect();
      clone.style.transition =
        "left 200ms cubic-bezier(0.25, 1, 0.5, 1), top 200ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 200ms, opacity 200ms";
      clone.style.left = `${finalRect.left}px`;
      clone.style.top = `${finalRect.top}px`;
      clone.style.boxShadow = "";
      clone.style.opacity = "1";

      const cloneToRemove = clone;
      settleTimer = setTimeout(() => {
        settleTimer = null;
        if (finished) return;
        finished = true;
        cloneToRemove.remove();
        el.style.opacity = "";
        el.style.transition = "";
        setDraggedId(null);
        dragActiveRef.current = false;
        cleanupRef.current = null;
        onCommitRef.current(orderedIdsRef.current);
      }, 200);
    };

    const onKeyDown = (ke: KeyboardEvent) => {
      if (ke.key === "Escape") {
        snapshotRects();
        orderedIdsRef.current = originalOrder;
        setOrderedIds(originalOrder);
        setDraggedId(null);
        abort();
      }
    };

    cleanupRef.current = abort;
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("keydown", onKeyDown);
  }, []);

  return {
    orderedIds,
    draggedId,
    handlePointerDown,
    registerRef,
    containerRef,
  };
};

export default useDragReorder;
