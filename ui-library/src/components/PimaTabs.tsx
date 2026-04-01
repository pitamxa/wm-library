import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "./ui/utils";
import type { PimaTabsProps } from "../types/pima-components";
import "../styles/tabs.css";

export type { PimaTabsProps };

export function PimaTabs({
  items,
  activeKey: controlledActiveKey,
  defaultActiveKey,
  onChange,
  indicatorWidth,
  className,
}: PimaTabsProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [internalActiveKey, setInternalActiveKey] = useState(
    () => defaultActiveKey ?? items.find((item) => !item.disabled)?.key ?? ""
  );

  const activeKey = controlledActiveKey ?? internalActiveKey;

  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const updateIndicator = useCallback(() => {
    const nav = navRef.current;
    const activeTab = tabRefs.current.get(activeKey);
    if (!nav || !activeTab) {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    const tabLeft = tabRect.left - navRect.left + nav.scrollLeft;
    const tabWidth = tabRect.width;

    if (indicatorWidth !== undefined) {
      // Custom indicator width: center within tab
      const actualWidth = typeof indicatorWidth === "number" ? indicatorWidth : tabWidth;
      const offset = (tabWidth - actualWidth) / 2;
      setIndicatorStyle({
        left: tabLeft + offset,
        width: actualWidth,
        opacity: 1,
      });
    } else {
      // Default: indicator matches full tab width
      setIndicatorStyle({
        left: tabLeft,
        width: tabWidth,
        opacity: 1,
      });
    }
  }, [activeKey, indicatorWidth]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useEffect(() => {
    const handleResize = () => updateIndicator();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateIndicator]);

  const handleTabClick = (key: string, disabled?: boolean) => {
    if (disabled) return;
    if (controlledActiveKey === undefined) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabledItems = items.filter((item) => !item.disabled);
    const currentEnabledIndex = enabledItems.findIndex(
      (item) => item.key === items[index].key
    );

    let targetItem: typeof items[0] | undefined;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        targetItem = enabledItems[(currentEnabledIndex + 1) % enabledItems.length];
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        targetItem =
          enabledItems[
            (currentEnabledIndex - 1 + enabledItems.length) % enabledItems.length
          ];
        break;
      case "Home":
        e.preventDefault();
        targetItem = enabledItems[0];
        break;
      case "End":
        e.preventDefault();
        targetItem = enabledItems[enabledItems.length - 1];
        break;
    }

    if (targetItem) {
      handleTabClick(targetItem.key);
      tabRefs.current.get(targetItem.key)?.focus();
    }
  };

  const activePanel = items.find((item) => item.key === activeKey);

  return (
    <div className={cn("wm-tabs", className)}>
      <div className="wm-tabs__nav" ref={navRef} role="tablist">
        {items.map((item, index) => (
          <button
            key={item.key}
            ref={(el) => {
              if (el) {
                tabRefs.current.set(item.key, el);
              } else {
                tabRefs.current.delete(item.key);
              }
            }}
            type="button"
            role="tab"
            aria-selected={activeKey === item.key}
            aria-disabled={item.disabled}
            tabIndex={activeKey === item.key ? 0 : -1}
            className={cn(
              "wm-tabs__tab",
              {
                "wm-tabs__tab--active": activeKey === item.key,
                "wm-tabs__tab--disabled": item.disabled,
              }
            )}
            onClick={() => handleTabClick(item.key, item.disabled)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {item.label}
          </button>
        ))}
        <div className="wm-tabs__indicator" style={indicatorStyle} />
      </div>

      {activePanel?.children && (
        <div
          className="wm-tabs__panel"
          role="tabpanel"
          aria-labelledby={activeKey}
        >
          {activePanel.children}
        </div>
      )}
    </div>
  );
}