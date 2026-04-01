import React, { useState, useEffect, useRef, useCallback } from "react";
import "../styles/anchor.css";

/* ========== Types ========== */
export interface AnchorLinkItem {
  key: string;
  href: string;
  title: string;
  children?: AnchorLinkItem[];
}

export interface PimaAnchorProps {
  /** 锚点链接列表 */
  items: AnchorLinkItem[];
  /** 水平 / 垂直方向 */
  direction?: "vertical" | "horizontal";
  /** 固定偏移量（滚动到目标时的顶部偏移） */
  offsetTop?: number;
  /** 当前激活的锚点 key（受控） */
  activeKey?: string;
  /** 激活锚点变更回调 */
  onChange?: (key: string) => void;
  /** 点击锚点的回调，返回 false 阻止默认滚动 */
  onClick?: (e: React.MouseEvent, link: AnchorLinkItem) => void;
  /** 是否使用 replaceState 替代 pushState */
  replace?: boolean;
  /** 是否显示轨道背景 */
  railBackground?: boolean;
  /** 容器滚动元素，默认 window */
  getContainer?: () => HTMLElement | Window;
  /** 自定义类名 */
  className?: string;
}

/* ========== 扁平化辅助 ========== */
function flattenItems(items: AnchorLinkItem[]): AnchorLinkItem[] {
  const result: AnchorLinkItem[] = [];
  items.forEach((item) => {
    result.push(item);
    if (item.children) {
      result.push(...flattenItems(item.children));
    }
  });
  return result;
}

/* ========== Component ========== */
export function PimaAnchor({
  items,
  direction = "vertical",
  offsetTop = 0,
  activeKey: controlledKey,
  onChange,
  onClick,
  replace = false,
  railBackground = false,
  getContainer,
  className = "",
}: PimaAnchorProps) {
  const flatItems = flattenItems(items);
  const [internalActive, setInternalActive] = useState<string>(
    flatItems[0]?.key ?? ""
  );
  const activeKey = controlledKey ?? internalActive;
  const railRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const setActive = useCallback(
    (key: string) => {
      if (controlledKey === undefined) {
        setInternalActive(key);
      }
      onChange?.(key);
    },
    [controlledKey, onChange]
  );

  /* 滚动监听 */
  useEffect(() => {
    const container = getContainer?.() ?? window;
    const handleScroll = () => {
      let currentKey = flatItems[0]?.key ?? "";
      for (const item of flatItems) {
        const id = item.href.replace(/^#/, "");
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offsetTop + 10) {
            currentKey = item.key;
          }
        }
      }
      setActive(currentKey);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [flatItems, offsetTop, getContainer, setActive]);

  /* 指示条位置更新 */
  useEffect(() => {
    const linkEl = linkRefs.current.get(activeKey);
    const indicator = indicatorRef.current;
    const rail = railRef.current;
    if (!linkEl || !indicator || !rail) return;

    const railRect = rail.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();

    if (direction === "horizontal") {
      indicator.style.left = `${linkRect.left - railRect.left}px`;
      indicator.style.width = `${linkRect.width}px`;
      indicator.style.top = "";
      indicator.style.height = "";
    } else {
      const linkPaddingTop = parseFloat(getComputedStyle(linkEl).paddingTop) || 0;
      const lineHeight =
        parseFloat(getComputedStyle(linkEl).lineHeight) || linkRect.height;
      indicator.style.top = `${linkRect.top - railRect.top + linkPaddingTop}px`;
      indicator.style.height = `${lineHeight}px`;
      indicator.style.left = "";
      indicator.style.width = "";
    }
  }, [activeKey, direction]);

  const handleClick = (e: React.MouseEvent, item: AnchorLinkItem) => {
    if (onClick) {
      onClick(e, item);
      if (e.defaultPrevented) return;
    }

    e.preventDefault();
    const id = item.href.replace(/^#/, "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setActive(item.key);

    if (replace) {
      window.history.replaceState(null, "", item.href);
    }
  };

  const renderLink = (item: AnchorLinkItem, isChild = false) => (
    <li key={item.key} className="pima-anchor__item">
      <a
        ref={(el) => {
          if (el) linkRefs.current.set(item.key, el);
        }}
        href={item.href}
        className={`pima-anchor__link${
          activeKey === item.key ? " pima-anchor__link--active" : ""
        }${isChild ? " pima-anchor__link--child" : ""}`}
        onClick={(e) => handleClick(e, item)}
      >
        {item.title}
      </a>
      {item.children && item.children.length > 0 && (
        <ul className="pima-anchor__list">
          {item.children.map((child) => renderLink(child, true))}
        </ul>
      )}
    </li>
  );

  const rootCls = [
    "pima-anchor",
    direction === "horizontal" ? "pima-anchor--horizontal" : "",
    replace ? "pima-anchor--replace" : "",
    railBackground ? "pima-anchor--rail-bg" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls}>
      <div ref={railRef} className="pima-anchor__rail">
        <div ref={indicatorRef} className="pima-anchor__indicator" />
      </div>
      <ul className="pima-anchor__list">
        {items.map((item) => renderLink(item))}
      </ul>
    </div>
  );
}

/* ========== 静态锚点（不监听滚动，纯导航展示） ========== */
export function PimaAnchorStatic({
  items,
  activeKey,
  onChange,
  className = "",
}: {
  items: AnchorLinkItem[];
  activeKey?: string;
  onChange?: (key: string) => void;
  className?: string;
}) {
  const [internal, setInternal] = useState(items[0]?.key ?? "");
  const current = activeKey ?? internal;

  const handleClick = (e: React.MouseEvent, item: AnchorLinkItem) => {
    e.preventDefault();
    if (activeKey === undefined) setInternal(item.key);
    onChange?.(item.key);
  };

  const renderLink = (item: AnchorLinkItem, isChild = false) => (
    <li key={item.key} className="pima-anchor__item">
      <a
        href={item.href}
        className={`pima-anchor__link${
          current === item.key ? " pima-anchor__link--active" : ""
        }${isChild ? " pima-anchor__link--child" : ""}`}
        onClick={(e) => handleClick(e, item)}
      >
        {item.title}
      </a>
      {item.children && item.children.length > 0 && (
        <ul className="pima-anchor__list">
          {item.children.map((child) => renderLink(child, true))}
        </ul>
      )}
    </li>
  );

  return (
    <div className={`pima-anchor pima-anchor--static ${className}`}>
      <ul className="pima-anchor__list">
        {items.map((item) => renderLink(item))}
      </ul>
    </div>
  );
}