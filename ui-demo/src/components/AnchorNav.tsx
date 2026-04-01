import React, { useState, useEffect, useCallback } from "react";
import "../styles/anchor-nav.css";

export interface AnchorNavItem {
  id: string;
  label: string;
}

export interface AnchorNavGroup {
  category: string;
  items: AnchorNavItem[];
}

interface AnchorNavProps {
  groups: AnchorNavGroup[];
}

export function AnchorNav({ groups }: AnchorNavProps) {
  const allItems = groups.flatMap((g) => g.items);
  const [activeId, setActiveId] = useState<string>(allItems[0]?.id ?? "");

  const handleClick = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveId(id);
      }
    },
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top
              ? prev
              : curr,
          );
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: "-10% 0px -70% 0px",
        threshold: 0,
      },
    );

    allItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [groups]);

  return (
    <nav className="anchor-nav" aria-label="组件导航">
      {groups.map((group) => (
        <div key={group.category} className="anchor-nav__group">
          <div className="anchor-nav__category">{group.category}</div>
          {group.items.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`anchor-nav__item${activeId === id ? " anchor-nav__item--active" : ""}`}
              onClick={(e) => handleClick(e, id)}
            >
              {label}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}
