"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  panel: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultTabId?: string;
}

export function Tabs({ items, defaultTabId }: TabsProps) {
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const initialTabId = defaultTabId ?? items[0]?.id ?? "";
  const [activeTabId, setActiveTabId] = useState(initialTabId);

  const focusTab = (index: number) => {
    const tab = tabRefs.current[index];
    tab?.focus();
    const nextItem = items[index];
    if (nextItem) {
      setActiveTabId(nextItem.id);
    }
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = items.length - 1;

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusTab(index === lastIndex ? 0 : index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusTab(index === 0 ? lastIndex : index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(lastIndex);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        setActiveTabId(items[index]?.id ?? activeTabId);
        break;
      default:
        break;
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div role="tablist" aria-label="Content tabs" className="flex flex-wrap gap-2 border-b border-[var(--color-border)] pb-2">
        {items.map((item, index) => {
          const tabId = `${baseId}-tab-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;
          const isSelected = item.id === activeTabId;

          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
                isSelected
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-background)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
              onClick={() => setActiveTabId(item.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => {
        const tabId = `${baseId}-tab-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;
        const isSelected = item.id === activeTabId;

        return (
          <div
            key={item.id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isSelected}
            tabIndex={0}
            className="rounded-b-xl border border-t-0 border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-muted)]"
          >
            {isSelected ? item.panel : null}
          </div>
        );
      })}
    </div>
  );
}
