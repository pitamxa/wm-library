import { useState, useRef, useEffect, useCallback, useMemo, forwardRef } from "react";
import * as Select from "@radix-ui/react-select";
import * as Popover from "@radix-ui/react-popover";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Loader2, ChevronDown, Check, X, Search, Minus } from "lucide-react";
import { cn } from "./ui/utils";

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

import type {
  PimaSelectorOption,
  PimaSelectorProps,
  PimaSelectorSingleProps,
  PimaSelectorMultipleProps,
} from "../types/pima-components";
import "../styles/selector.css";
import "../styles/checkbox.css";
import "../styles/form-layout.css";

export type { PimaSelectorOption, PimaSelectorProps };

// ========== 内部：溢出标签悬浮弹出 ==========
function OverflowPopover({
  size,
  selectedLabels,
  isDisabled,
  onRemove,
  overflowCount,
}: {
  size: string;
  selectedLabels: { value: string; label: string }[];
  isDisabled: boolean;
  onRemove: (val: string, e: React.MouseEvent) => void;
  overflowCount: number;
}) {
  const [hoverOpen, setHoverOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setHoverOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setHoverOpen(false), 150);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <Popover.Root open={hoverOpen} onOpenChange={setHoverOpen}>
      <Popover.Trigger asChild>
        <span
          className={cn("wm-mselector__tag", "wm-mselector__tag--overflow", `wm-mselector__tag--${size}`)}
          onPointerEnter={handleEnter}
          onPointerLeave={handleLeave}
        >
          +{overflowCount}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="wm-mselector__overflow-popover"
          side="bottom"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onPointerEnter={handleEnter}
          onPointerLeave={handleLeave}
          onPointerDownOutside={() => setHoverOpen(false)}
        >
          <div className="wm-mselector__overflow-list">
            {selectedLabels.map((item) => (
              <span key={item.value} className={cn("wm-mselector__tag", `wm-mselector__tag--${size}`)}>
                <span className="wm-mselector__tag-text">{item.label}</span>
                {!isDisabled && (
                  <span
                    role="button"
                    tabIndex={0}
                    className="wm-mselector__tag-close"
                    onClick={(e) => onRemove(item.value, e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRemove(item.value, e as unknown as React.MouseEvent);
                      }
                    }}
                    aria-label={`\u79FB\u9664 ${item.label}`}
                  >
                    <X className="wm-mselector__tag-close-icon" />
                  </span>
                )}
              </span>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// ========== 内部：单选渲染 ==========
function SingleSelector({
  options,
  value,
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
}: PimaSelectorSingleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const getVariant = () => {
    if (error || variant === "error") return "error";
    if (success || variant === "success") return "success";
    return "default";
  };

  const currentVariant = getVariant();
  const isDisabled = disabled || loading;
  const showClear = !!value && !isDisabled && !loading && isHovered;

  const selectedLabel = useMemo(() => {
    if (!value) return "";
    const found = options.find((o) => o.value === value);
    return found ? found.label : value;
  }, [value, options]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const q = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  const enabledOptions = useMemo(
    () => filteredOptions.filter((o) => !o.disabled),
    [filteredOptions]
  );

  const handleClearPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange?.("");
  };

  const handleClearKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onValueChange?.("");
    }
  };

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setHighlightedIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [open, searchable]);

  const handleSelectOption = useCallback(
    (optionValue: string) => {
      onValueChange?.(optionValue);
      setOpen(false);
    },
    [onValueChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    const items = enabledOptions;
    if (items.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < items.length) {
          handleSelectOption(items[highlightedIndex].value);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

  const handleInlineSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && searchQuery === "" && value) {
      e.preventDefault();
      onValueChange?.("");
      return;
    }
    handleKeyDown(e);
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

  const isHorizontal = layout === "horizontal";

  const triggerClassName = cn(
    "wm-selector__trigger",
    `wm-selector__trigger--${size}`,
    `wm-selector__trigger--${currentVariant === "default" ? "default-state" : currentVariant}`,
    { "wm-selector__trigger--disabled": isDisabled },
    className
  );

  const iconClassName = cn("wm-selector__icon", `wm-selector__icon--${size}`);

  const labelStyle: React.CSSProperties | undefined =
    isHorizontal && labelWidth
      ? { width: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth }
      : undefined;

  // ---- Searchable: use Popover-based approach (like multi selector) ----
  if (searchable) {
    const searchableTriggerClassName = cn(
      "wm-selector__trigger",
      "wm-sselector__trigger",
      `wm-selector__trigger--${size}`,
      `wm-selector__trigger--${currentVariant === "default" ? "default-state" : currentVariant}`,
      {
        "wm-selector__trigger--disabled": isDisabled,
        "wm-sselector__trigger--active": open,
      },
      className
    );

    const controlContent = (
      <>
        <Popover.Root open={open} onOpenChange={isDisabled ? undefined : setOpen}>
          <Popover.Trigger asChild>
            <SafeButton
              type="button"
              className={searchableTriggerClassName}
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
                {loading && <Loader2 className={cn(iconClassName, "wm-selector__icon--loading")} />}
                {value && !searchQuery && (
                  <span className="wm-selector__trigger-value">{selectedLabel}</span>
                )}
                <input
                  ref={searchInputRef}
                  type="text"
                  className="wm-mselector__inline-search"
                  placeholder={value ? "" : placeholder}
                  value={searchQuery}
                  onChange={handleInlineInputChange}
                  onFocus={handleInlineInputFocus}
                  onKeyDown={handleInlineSearchKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  disabled={isDisabled}
                  aria-label={searchPlaceholder}
                />
              </div>
              <div className="wm-selector__trigger-icons">
                {showClear ? (
                  <span
                    role="button"
                    className="wm-selector__clear-btn"
                    onPointerDown={handleClearPointerDown}
                    onKeyDown={handleClearKeyDown}
                    aria-label={"\u6E05\u9664\u9009\u62E9"}
                    tabIndex={0}
                  >
                    <X className="wm-selector__clear-icon" />
                  </span>
                ) : open ? (
                  <Search
                    className={cn(iconClassName, "wm-selector__icon--search")}
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
              className={cn("wm-mselector__content", contentClassName)}
              sideOffset={5}
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="wm-mselector__list" role="listbox">
                {filteredOptions.length === 0 ? (
                  <div className="wm-selector__empty">
                    {searchQuery ? "\u65E0\u5339\u914D\u7ED3\u679C" : "\u6682\u65E0\u9009\u9879"}
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = value === option.value;
                    const isOptionDisabled = option.disabled;
                    const enabledIndex = enabledOptions.findIndex((o) => o.value === option.value);
                    const isHighlighted = enabledIndex === highlightedIndex;

                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "wm-mselector__item",
                          isSelected && "wm-mselector__item--selected",
                          isOptionDisabled && "wm-mselector__item--disabled",
                          isHighlighted && "wm-mselector__item--highlighted"
                        )}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={isOptionDisabled}
                        onClick={() => !isOptionDisabled && handleSelectOption(option.value)}
                      >
                        <span className="wm-mselector__item-label">{option.label}</span>
                        {option.description && (
                          <span className="wm-selector__item-description">{option.description}</span>
                        )}
                        {isSelected && (
                          <Check className="wm-selector__icon--check" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
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
        className={cn("wm-selector", `wm-selector--${size}`, { "wm-selector--horizontal": isHorizontal })}
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

  // ---- Non-searchable: use Radix Select ----
  const controlContent = (
    <>
      <Select.Root value={value} onValueChange={onValueChange} disabled={isDisabled}>
        <Select.Trigger className={triggerClassName} aria-label={label || placeholder}>
          <div className="wm-selector__trigger-content">
            {loading && <Loader2 className={cn(iconClassName, "wm-selector__icon--loading")} />}
            <Select.Value
              placeholder={placeholder}
              className={cn(
                "wm-selector__trigger-value",
                !value && "wm-selector__trigger-value--placeholder"
              )}
            />
          </div>
          <div className="wm-selector__trigger-icons">
            {showClear ? (
              <span
                role="button"
                className="wm-selector__clear-btn"
                onPointerDown={handleClearPointerDown}
                onKeyDown={handleClearKeyDown}
                aria-label={"\u6E05\u9664\u9009\u62E9"}
                tabIndex={0}
              >
                <X className="wm-selector__clear-icon" />
              </span>
            ) : (
              <Select.Icon>
                <ChevronDown className={cn(iconClassName, "wm-selector__icon--chevron")} />
              </Select.Icon>
            )}
          </div>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className={cn("wm-selector__content", contentClassName)}
            position="popper"
            sideOffset={5}
          >
            <Select.Viewport className="wm-selector__viewport">
              {options.length === 0 ? (
                <div className="wm-selector__empty">{"\u6682\u65E0\u9009\u9879"}</div>
              ) : (
                options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className="wm-selector__item"
                  >
                    <Select.ItemText>{option.label}</Select.ItemText>
                    {option.description && (
                      <span className="wm-selector__item-description">{option.description}</span>
                    )}
                    <Select.ItemIndicator className="wm-selector__item-indicator">
                      <Check className="wm-selector__icon--check" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))
              )}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {helperText && (
        <p className={cn("wm-selector__helper", `wm-selector__helper--${currentVariant}`)}>
          {helperText}
        </p>
      )}
    </>
  );

  return (
    <div
      className={cn("wm-selector", `wm-selector--${size}`, { "wm-selector--horizontal": isHorizontal })}
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

// ========== 内部：多选渲染 ==========
function MultipleSelector({
  options,
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
  showSelectAll = false,
  maxSelection,
  maxTagCount = 3,
}: PimaSelectorMultipleProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const getVariant = () => {
    if (error || variant === "error") return "error";
    if (success || variant === "success") return "success";
    return "default";
  };

  const currentVariant = getVariant();
  const isDisabled = disabled || loading;

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const q = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  const enabledOptions = useMemo(
    () => filteredOptions.filter((o) => !o.disabled),
    [filteredOptions]
  );
  const allSelected = enabledOptions.length > 0 && enabledOptions.every((o) => value.includes(o.value));
  const someSelected = enabledOptions.some((o) => value.includes(o.value));
  const isMaxReached = maxSelection !== undefined && value.length >= maxSelection;

  const selectedLabels = useMemo(() => {
    const labelMap = new Map(options.map((o) => [o.value, o.label]));
    return value.map((v) => ({ value: v, label: labelMap.get(v) || v }));
  }, [value, options]);

  const showClearAll = clearable && value.length > 0 && !isDisabled && isHovered;

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setHighlightedIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [open, searchable]);

  const handleToggleOption = useCallback(
    (optionValue: string) => {
      const isSelected = value.includes(optionValue);
      let next: string[];
      if (isSelected) {
        next = value.filter((v) => v !== optionValue);
      } else {
        if (isMaxReached) return;
        next = [...value, optionValue];
      }
      onValueChange?.(next);
    },
    [value, onValueChange, isMaxReached]
  );

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      const enabledValues = new Set(enabledOptions.map((o) => o.value));
      onValueChange?.(value.filter((v) => !enabledValues.has(v)));
    } else {
      const enabledValues = enabledOptions.map((o) => o.value);
      const current = new Set(value);
      const toAdd = enabledValues.filter((v) => !current.has(v));
      let next = [...value];
      for (const v of toAdd) {
        if (maxSelection !== undefined && next.length >= maxSelection) break;
        next.push(v);
      }
      onValueChange?.(next);
    }
  }, [allSelected, enabledOptions, value, onValueChange, maxSelection]);

  const handleRemoveTag = (optionValue: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange?.(value.filter((v) => v !== optionValue));
  };

  const handleClearAll = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange?.([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    const items = filteredOptions.filter((o) => !o.disabled);
    if (items.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < items.length) {
          handleToggleOption(items[highlightedIndex].value);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

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
          <OverflowPopover
            size={size}
            selectedLabels={selectedLabels}
            isDisabled={isDisabled}
            onRemove={(val, e) => handleRemoveTag(val, e)}
            overflowCount={overflowCount}
          />
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
    handleKeyDown(e);
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
            ref={triggerRef}
            type="button"
            className={triggerClassName}
            disabled={isDisabled}
            aria-label={label || placeholder}
            aria-expanded={open}
            onKeyDown={!searchable ? handleKeyDown : undefined}
            onClick={() => {
              if (searchable && searchInputRef.current) {
                searchInputRef.current.focus();
              }
            }}
          >
            <div className="wm-mselector__trigger-content">
              {loading && <Loader2 className={cn(iconClassName, "wm-selector__icon--loading")} />}
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
            className={cn("wm-mselector__content", contentClassName)}
            sideOffset={5}
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {showSelectAll && filteredOptions.length > 0 && (
              <div className="wm-mselector__select-all" onClick={handleSelectAll}>
                <RadixCheckbox.Root
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  tabIndex={-1}
                  className={cn(
                    "wm-checkbox-item__box",
                    "wm-checkbox-item__box--default",
                    {
                      "wm-checkbox-item__box--checked": allSelected,
                      "wm-checkbox-item__box--indeterminate": !allSelected && someSelected,
                    }
                  )}
                  onCheckedChange={() => {}}
                  style={{ pointerEvents: "none" }}
                >
                  <RadixCheckbox.Indicator forceMount className="wm-checkbox-item__indicator">
                    {allSelected ? (
                      <Check className="wm-checkbox-item__icon wm-checkbox-item__icon--default" />
                    ) : someSelected ? (
                      <Minus className="wm-checkbox-item__icon wm-checkbox-item__icon--default" />
                    ) : null}
                  </RadixCheckbox.Indicator>
                </RadixCheckbox.Root>
                <span className="wm-mselector__select-all-text">{"\u5168\u9009"}</span>
              </div>
            )}

            <div className="wm-mselector__list" role="listbox" aria-multiselectable="true">
              {filteredOptions.length === 0 ? (
                <div className="wm-selector__empty">
                  {searchQuery ? "\u65E0\u5339\u914D\u7ED3\u679C" : "\u6682\u65E0\u9009\u9879"}
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  const isOptionDisabled = option.disabled || (!isSelected && isMaxReached);
                  const enabledIndex = enabledOptions.findIndex((o) => o.value === option.value);
                  const isHighlighted = enabledIndex === highlightedIndex;

                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "wm-mselector__item",
                        isSelected && "wm-mselector__item--selected",
                        isOptionDisabled && "wm-mselector__item--disabled",
                        isHighlighted && "wm-mselector__item--highlighted"
                      )}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={isOptionDisabled}
                      onClick={() => !isOptionDisabled && handleToggleOption(option.value)}
                    >
                      <RadixCheckbox.Root
                        checked={isSelected}
                        tabIndex={-1}
                        className={cn(
                          "wm-checkbox-item__box",
                          "wm-checkbox-item__box--default",
                          {
                            "wm-checkbox-item__box--checked": isSelected,
                            "wm-checkbox-item__box--disabled": isOptionDisabled,
                          }
                        )}
                        onCheckedChange={() => {}}
                        style={{ pointerEvents: "none" }}
                      >
                        <RadixCheckbox.Indicator className="wm-checkbox-item__indicator">
                          <Check className="wm-checkbox-item__icon wm-checkbox-item__icon--default" />
                        </RadixCheckbox.Indicator>
                      </RadixCheckbox.Root>
                      <span className="wm-mselector__item-label">{option.label}</span>
                      {option.description && (
                        <span className="wm-selector__item-description">{option.description}</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {maxSelection !== undefined && (
              <div className="wm-mselector__footer">
                {"\u5DF2\u9009 "}
                {value.length}/{maxSelection}
              </div>
            )}
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
      className={cn("wm-selector", `wm-selector--${size}`, { "wm-selector--horizontal": isHorizontal })}
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

// ========== 对外导出：统一 PimaSelector ==========
export function PimaSelector({
  mode,
  options,
  value,
  onValueChange,
  placeholder,
  disabled,
  loading,
  error,
  success,
  variant,
  size,
  helperText,
  label,
  required,
  clearable,
  layout,
  labelWidth,
  className,
  contentClassName,
  searchable,
  maxSelection,
  showSelectAll,
  selectAllLabel,
}: PimaSelectorProps) {
  const cleanProps = {
    options,
    value,
    onValueChange,
    placeholder,
    disabled,
    loading,
    error,
    success,
    variant,
    size,
    helperText,
    label,
    required,
    clearable,
    layout,
    labelWidth,
    className,
    contentClassName,
  } as any;
  if (mode === "multiple") {
    return (
      <MultipleSelector
        {...cleanProps}
        mode="multiple"
        searchable={searchable}
        maxSelection={maxSelection}
        showSelectAll={showSelectAll}
        selectAllLabel={selectAllLabel}
      />
    );
  }
  return <SingleSelector {...cleanProps} mode="single" searchable={searchable} />;
}