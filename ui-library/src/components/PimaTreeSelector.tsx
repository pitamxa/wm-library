import { useState, useRef, useEffect, useCallback, useMemo, forwardRef } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Loader2, ChevronDown, ChevronRight, Check, X, Search, Minus } from "lucide-react";
import { cn } from "./ui/utils";
import type {
  PimaTreeNode,
  PimaTreeSelectorProps,
} from "../types/pima-components";
import "../styles/selector.css";
import "../styles/checkbox.css";
import "../styles/form-layout.css";

export type { PimaTreeSelectorProps, PimaTreeNode };

/**
 * SafeButton: strips Figma-internal props (_fgT, _fgS, _fgB, etc.)
 * that Radix's `asChild` / Slot forwards onto DOM elements.
 */
const SafeButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) {
      if (!k.startsWith("_fg")) {
        clean[k] = v;
      }
    }
    return <button ref={ref} {...(clean as React.ButtonHTMLAttributes<HTMLButtonElement>)} />;
  }
);

// ========== Helper utilities ==========

/** Collect all leaf values from a tree node */
function getAllLeafValues(nodes: PimaTreeNode[]): string[] {
  const result: string[] = [];
  const walk = (list: PimaTreeNode[]) => {
    for (const n of list) {
      if (n.children && n.children.length > 0) {
        walk(n.children);
      } else {
        result.push(n.value);
      }
    }
  };
  walk(nodes);
  return result;
}

/** Collect all non-disabled leaf values */
function getEnabledLeafValues(nodes: PimaTreeNode[]): string[] {
  const result: string[] = [];
  const walk = (list: PimaTreeNode[], parentDisabled: boolean) => {
    for (const n of list) {
      const disabled = parentDisabled || !!n.disabled;
      if (n.children && n.children.length > 0) {
        walk(n.children, disabled);
      } else if (!disabled) {
        result.push(n.value);
      }
    }
  };
  walk(nodes, false);
  return result;
}

/** Collect all node values (branches + leaves) */
function getAllNodeValues(nodes: PimaTreeNode[]): string[] {
  const result: string[] = [];
  const walk = (list: PimaTreeNode[]) => {
    for (const n of list) {
      result.push(n.value);
      if (n.children && n.children.length > 0) {
        walk(n.children);
      }
    }
  };
  walk(nodes);
  return result;
}

/** Build a value→label map for all nodes */
function buildLabelMap(nodes: PimaTreeNode[]): Map<string, string> {
  const map = new Map<string, string>();
  const walk = (list: PimaTreeNode[]) => {
    for (const n of list) {
      map.set(n.value, n.label);
      if (n.children && n.children.length > 0) {
        walk(n.children);
      }
    }
  };
  walk(nodes);
  return map;
}

/** Get the check-state for a parent node given the current selection */
function getNodeCheckState(
  node: PimaTreeNode,
  selectedSet: Set<string>,
  cascade: boolean
): "checked" | "indeterminate" | "unchecked" {
  if (!node.children || node.children.length === 0) {
    return selectedSet.has(node.value) ? "checked" : "unchecked";
  }
  if (!cascade) {
    return selectedSet.has(node.value) ? "checked" : "unchecked";
  }
  const leaves = getAllLeafValues([node]);
  const checkedCount = leaves.filter((v) => selectedSet.has(v)).length;
  if (checkedCount === 0) return "unchecked";
  if (checkedCount === leaves.length) return "checked";
  return "indeterminate";
}

/** Check if a node or any descendant matches a search query */
function nodeMatchesSearch(node: PimaTreeNode, query: string): boolean {
  const q = query.toLowerCase();
  if (node.label.toLowerCase().includes(q) || node.value.toLowerCase().includes(q)) {
    return true;
  }
  if (node.children) {
    return node.children.some((child) => nodeMatchesSearch(child, q));
  }
  return false;
}

// ========== TreeNode sub-component ==========

interface TreeNodeRowProps {
  node: PimaTreeNode;
  level: number;
  expandedKeys: Set<string>;
  selectedSet: Set<string>;
  cascade: boolean;
  onToggleExpand: (key: string) => void;
  onToggleSelect: (node: PimaTreeNode) => void;
  parentDisabled?: boolean;
  searchQuery: string;
}

function TreeNodeRow({
  node,
  level,
  expandedKeys,
  selectedSet,
  cascade,
  onToggleExpand,
  onToggleSelect,
  parentDisabled = false,
  searchQuery,
}: TreeNodeRowProps) {
  const hasChildren = !!(node.children && node.children.length > 0);
  const isExpanded = expandedKeys.has(node.value);
  const isDisabled = parentDisabled || !!node.disabled;
  const checkState = getNodeCheckState(node, selectedSet, cascade);

  // Filter out nodes that don't match search
  if (searchQuery && !nodeMatchesSearch(node, searchQuery)) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "wm-treeselector__node",
          isDisabled && "wm-treeselector__node--disabled"
        )}
        style={{ paddingLeft: `${12 + level * 20}px` }}
        onClick={() => !isDisabled && onToggleSelect(node)}
        role="option"
        aria-selected={checkState === "checked"}
        aria-disabled={isDisabled}
      >
        {/* Expand arrow for branches */}
        <span
          className="wm-treeselector__arrow"
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggleExpand(node.value);
          }}
        >
          {hasChildren && (
            <ChevronRight
              className={cn(
                "wm-treeselector__arrow-icon",
                isExpanded && "wm-treeselector__arrow-icon--expanded"
              )}
            />
          )}
        </span>

        {/* Checkbox */}
        <RadixCheckbox.Root
          checked={checkState === "checked" ? true : checkState === "indeterminate" ? "indeterminate" : false}
          tabIndex={-1}
          className={cn(
            "wm-checkbox-item__box",
            "wm-checkbox-item__box--default",
            {
              "wm-checkbox-item__box--checked": checkState === "checked",
              "wm-checkbox-item__box--indeterminate": checkState === "indeterminate",
              "wm-checkbox-item__box--disabled": isDisabled,
            }
          )}
          onCheckedChange={() => {}}
          style={{ pointerEvents: "none" }}
        >
          <RadixCheckbox.Indicator forceMount className="wm-checkbox-item__indicator">
            {checkState === "checked" ? (
              <Check className="wm-checkbox-item__icon wm-checkbox-item__icon--default" />
            ) : checkState === "indeterminate" ? (
              <Minus className="wm-checkbox-item__icon wm-checkbox-item__icon--default" />
            ) : null}
          </RadixCheckbox.Indicator>
        </RadixCheckbox.Root>

        {/* Label */}
        <span className="wm-treeselector__node-label">{node.label}</span>
      </div>

      {/* Render children if expanded */}
      {hasChildren && isExpanded && (
        node.children!.map((child) => (
          <TreeNodeRow
            key={child.value}
            node={child}
            level={level + 1}
            expandedKeys={expandedKeys}
            selectedSet={selectedSet}
            cascade={cascade}
            onToggleExpand={onToggleExpand}
            onToggleSelect={onToggleSelect}
            parentDisabled={isDisabled}
            searchQuery={searchQuery}
          />
        ))
      )}
    </>
  );
}

// ========== Main PimaTreeSelector ==========

export function PimaTreeSelector({
  treeData,
  value = [],
  onValueChange,
  placeholder = "\u8BF7\u9009\u62E9...",
  disabled = false,
  loading = false,
  error = false,
  success = false,
  variant = "default",
  size = "sm",
  helperText,
  label,
  required = false,
  clearable = false,
  layout = "vertical",
  labelWidth,
  className,
  contentClassName,
  searchable = false,
  searchPlaceholder = "\u641C\u7D22...",
  maxTagCount = 3,
  defaultExpandAll = false,
  cascade = true,
}: PimaTreeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Expanded keys state
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => {
    if (defaultExpandAll) {
      return new Set(getAllNodeValues(treeData));
    }
    return new Set<string>();
  });

  const selectedSet = useMemo(() => new Set(value), [value]);
  const labelMap = useMemo(() => buildLabelMap(treeData), [treeData]);

  const getVariant = () => {
    if (error || variant === "error") return "error";
    if (success || variant === "success") return "success";
    return "default";
  };

  const currentVariant = getVariant();
  const isDisabled = disabled || loading;

  const showClearAll = clearable && value.length > 0 && !isDisabled && isHovered;

  // Reset search when dropdown closes
  useEffect(() => {
    if (!open) setSearchQuery("");
  }, [open]);

  // Focus search input when opened
  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [open, searchable]);

  const handleToggleExpand = useCallback((key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const handleToggleSelect = useCallback(
    (node: PimaTreeNode) => {
      if (node.disabled) return;

      if (!cascade || !node.children || node.children.length === 0) {
        // Leaf node or non-cascade: toggle this value
        const nextVal = selectedSet.has(node.value)
          ? value.filter((v) => v !== node.value)
          : [...value, node.value];
        onValueChange?.(nextVal);
      } else {
        // Cascade mode: toggle all enabled leaves under this branch
        const leaves = getEnabledLeafValues([node]);
        const allChecked = leaves.every((v) => selectedSet.has(v));
        let nextVal: string[];
        if (allChecked) {
          // Un-check all
          const leafSet = new Set(leaves);
          nextVal = value.filter((v) => !leafSet.has(v));
        } else {
          // Check all
          const current = new Set(value);
          const toAdd = leaves.filter((v) => !current.has(v));
          nextVal = [...value, ...toAdd];
        }
        onValueChange?.(nextVal);
      }
    },
    [value, selectedSet, onValueChange, cascade]
  );

  const handleRemoveTag = (val: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange?.(value.filter((v) => v !== val));
  };

  const handleClearAll = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange?.([]);
  };

  // Tags
  const selectedLabels = useMemo(
    () => value.map((v) => ({ value: v, label: labelMap.get(v) || v })),
    [value, labelMap]
  );

  const isHorizontal = layout === "horizontal";

  const triggerClassName = cn(
    "wm-selector__trigger",
    "wm-mselector__trigger",
    `wm-selector__trigger--${size}`,
    `wm-selector__trigger--${currentVariant === "default" ? "default-state" : currentVariant}`,
    {
      "wm-selector__trigger--disabled": isDisabled,
      "wm-mselector__trigger--active": open,
    },
    className
  );

  const iconClassName = cn("wm-selector__icon", `wm-selector__icon--${size}`);

  const labelStyle: React.CSSProperties | undefined =
    isHorizontal && labelWidth
      ? { width: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth }
      : undefined;

  const renderTags = () => {
    if (value.length === 0) {
      if (searchable) {
        return null;
      }
      return <span className="wm-mselector__placeholder">{placeholder}</span>;
    }
    const visibleTags = selectedLabels.slice(0, maxTagCount);
    const overflowCount = selectedLabels.length - maxTagCount;
    return (
      <div className="wm-mselector__tags">
        {visibleTags.map((item) => (
          <span key={item.value} className={cn("wm-mselector__tag", `wm-mselector__tag--${size}`)}>
            <span className="wm-mselector__tag-text">{item.label}</span>
            {!isDisabled && (
              <span
                role="button"
                tabIndex={0}
                className="wm-mselector__tag-close"
                onClick={(e) => handleRemoveTag(item.value, e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleRemoveTag(item.value, e as unknown as React.MouseEvent);
                  }
                }}
                aria-label={`\u79FB\u9664 ${item.label}`}
              >
                <X className="wm-mselector__tag-close-icon" />
              </span>
            )}
          </span>
        ))}
        {overflowCount > 0 && (
          <span className={cn("wm-mselector__tag", "wm-mselector__tag--overflow", `wm-mselector__tag--${size}`)}>
            +{overflowCount}
          </span>
        )}
      </div>
    );
  };

  const handleInlineSearchKeyDown = (e: React.KeyboardEvent) => {
    // Backspace on empty input removes last tag
    if (e.key === "Backspace" && searchQuery === "" && value.length > 0) {
      e.preventDefault();
      const lastVal = value[value.length - 1];
      onValueChange?.(value.filter((v) => v !== lastVal));
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleInlineInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!open) {
      setOpen(true);
    }
  };

  const handleInlineInputFocus = () => {
    if (!open && !isDisabled) {
      setOpen(true);
    }
  };

  const controlContent = (
    <>
      <Popover.Root open={open} onOpenChange={isDisabled ? undefined : setOpen}>
        <Popover.Trigger asChild>
          <SafeButton
            type="button"
            className={triggerClassName}
            disabled={isDisabled}
            aria-label={label || placeholder}
            aria-expanded={open}
            onClick={() => {
              if (searchable && searchInputRef.current) {
                searchInputRef.current.focus();
              }
            }}
          >
            <div className="wm-mselector__trigger-content">
              {loading && (
                <Loader2 className={cn(iconClassName, "wm-selector__icon--loading")} />
              )}
              {renderTags()}
              {searchable && (
                <input
                  ref={searchInputRef}
                  type="text"
                  className="wm-mselector__inline-search"
                  placeholder={value.length === 0 ? placeholder : ""}
                  value={searchQuery}
                  onChange={handleInlineInputChange}
                  onFocus={handleInlineInputFocus}
                  onKeyDown={handleInlineSearchKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  disabled={isDisabled}
                  aria-label={searchPlaceholder}
                />
              )}
            </div>
            <div className="wm-selector__trigger-icons">
              {showClearAll ? (
                <span
                  role="button"
                  className="wm-selector__clear-btn"
                  onPointerDown={handleClearAll}
                  aria-label={"\u6E05\u9664\u6240\u6709\u9009\u62E9"}
                  tabIndex={0}
                >
                  <X className="wm-selector__clear-icon" />
                </span>
              ) : searchable && open ? (
                <Search
                  className={cn(
                    iconClassName,
                    "wm-selector__icon--search"
                  )}
                />
              ) : (
                <ChevronDown
                  className={cn(
                    iconClassName,
                    "wm-selector__icon--chevron",
                    open && "wm-mselector__chevron--open"
                  )}
                />
              )}
            </div>
          </SafeButton>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={cn("wm-mselector__content", "wm-treeselector__content", contentClassName)}
            sideOffset={5}
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {/* Tree list */}
            <div className="wm-mselector__list wm-treeselector__list" role="listbox" aria-multiselectable="true">
              {treeData.length === 0 ? (
                <div className="wm-selector__empty">{"\u6682\u65E0\u9009\u9879"}</div>
              ) : (
                treeData.map((node) => (
                  <TreeNodeRow
                    key={node.value}
                    node={node}
                    level={0}
                    expandedKeys={expandedKeys}
                    selectedSet={selectedSet}
                    cascade={cascade}
                    onToggleExpand={handleToggleExpand}
                    onToggleSelect={handleToggleSelect}
                    searchQuery={searchQuery}
                  />
                ))
              )}
            </div>

            {/* Footer count - removed */}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {helperText && (
        <p className={cn("wm-selector__helper", `wm-selector__helper--${currentVariant}`)}>
          {helperText}
        </p>
      )}
    </>
  );

  return (
    <div
      className={cn("wm-selector", `wm-selector--${size}`, {
        "wm-selector--horizontal": isHorizontal,
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label && (
        <label
          className={isHorizontal ? "wm-form-label--horizontal" : "wm-selector__label"}
          style={labelStyle}
        >
          {isHorizontal && required && <span className="wm-form-label__required">*</span>}
          {label}
          {!isHorizontal && required && <span className="wm-selector__label-required">*</span>}
          {isHorizontal && "\uFF1A"}
        </label>
      )}
      {isHorizontal ? (
        <div className="wm-form-body--horizontal">{controlContent}</div>
      ) : (
        controlContent
      )}
    </div>
  );
}