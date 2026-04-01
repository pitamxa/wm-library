import React, { useState, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverAnchor } from "./ui/popover";
import { Clock, X, Loader2 } from "lucide-react";
import { cn } from "./ui/utils";
import type { PimaTimePickerProps } from "../types/pima-components";
import "../styles/datepicker.css";
import "../styles/form-layout.css";

export type { PimaTimePickerProps };

// ─── 格式化工具 ────────────────────────────────────────────────────────────────

function formatTime(h: number, m: number, s: number, showSeconds: boolean): string {
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
}

// ─── TimeColumn 内部组件 ─────────────────────────────────────────────────────────

interface TimeColumnProps {
  values: number[];
  selected: number;
  onSelect: (v: number) => void;
  open: boolean;
}

function TimeColumn({ values, selected, onSelect, open }: TimeColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ITEM_H = 32;

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = selected * ITEM_H;
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [open, selected]);

  return (
    <div className="wm-datepicker__time-col" ref={containerRef}>
      {values.map((v) => (
        <div
          key={v}
          className={cn(
            "wm-datepicker__time-item",
            v === selected && "wm-datepicker__time-item--selected"
          )}
          onClick={() => onSelect(v)}
        >
          {String(v).padStart(2, "0")}
        </div>
      ))}
    </div>
  );
}

// ─── 内部 TimePicker 面板（也供 DatePicker 内部使用） ─────────────────────────────

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const SECONDS = Array.from({ length: 60 }, (_, i) => i);

export interface TimePickerPanelProps {
  hour: number;
  minute: number;
  second: number;
  showSeconds: boolean;
  onChange: (h: number, m: number, s: number) => void;
  open: boolean;
  showHeader?: boolean;
}

export function TimePickerPanel({
  hour,
  minute,
  second,
  showSeconds,
  onChange,
  open,
  showHeader = true,
}: TimePickerPanelProps) {
  const formattedTime = formatTime(hour, minute, second, showSeconds);
  return (
    <>
      {showHeader && (
        <div className="wm-datepicker__time-header">
          <span className="wm-datepicker__time-header-text">{formattedTime}</span>
        </div>
      )}
      <div className="wm-datepicker__time-picker">
        <div className="wm-datepicker__time-cols">
          <TimeColumn
            values={HOURS}
            selected={hour}
            onSelect={(h) => onChange(h, minute, second)}
            open={open}
          />
          <div className="wm-datepicker__time-col-divider" />
          <TimeColumn
            values={MINUTES}
            selected={minute}
            onSelect={(m) => onChange(hour, m, second)}
            open={open}
          />
          {showSeconds && (
            <>
              <div className="wm-datepicker__time-col-divider" />
              <TimeColumn
                values={SECONDS}
                selected={second}
                onSelect={(s) => onChange(hour, minute, s)}
                open={open}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── PimaTimePicker 独立组件 ─────────────────────────────────────────────────────

export function PimaTimePicker({
  value,
  onChange,
  showSeconds = true,
  disabled = false,
  loading = false,
  error = false,
  success = false,
  size = "sm",
  label,
  required = false,
  helperText,
  placeholder,
  clearable = true,
  layout = "vertical",
  labelWidth,
  className,
}: PimaTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isDisabled = disabled || loading;

  // 临时状态：弹窗内的编辑值（未确认前不更新外部）
  const [tempHour, setTempHour] = useState(0);
  const [tempMinute, setTempMinute] = useState(0);
  const [tempSecond, setTempSecond] = useState(0);

  // input 本地文本
  const getInitialInputValue = () =>
    value ? formatTime(value.getHours(), value.getMinutes(), value.getSeconds(), showSeconds) : "";
  const [inputValue, setInputValue] = useState<string>(getInitialInputValue);

  // 打开弹窗时同步外部值
  useEffect(() => {
    if (open) {
      setTempHour(value?.getHours() ?? 0);
      setTempMinute(value?.getMinutes() ?? 0);
      setTempSecond(value?.getSeconds() ?? 0);
    }
  }, [open]);

  // 外部 value 变化时同步 inputValue
  useEffect(() => {
    setInputValue(
      value ? formatTime(value.getHours(), value.getMinutes(), value.getSeconds(), showSeconds) : ""
    );
  }, [value]);

  // 解析时间字符串
  const parseTime = (str: string): { h: number; m: number; s: number } | null => {
    const match = str.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
    if (!match) return null;
    const h = Number(match[1]),
      m = Number(match[2]),
      s = Number(match[3] ?? 0);
    if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) return null;
    return { h, m, s };
  };

  // 输入变化时实时解析（与 DatePicker date 模式一致）
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const parsed = parseTime(val);
    if (parsed) {
      // 实时同步面板临时值
      setTempHour(parsed.h);
      setTempMinute(parsed.m);
      setTempSecond(parsed.s);
    }
  };

  const handleInputBlur = () => {
    // 如果 popover 打开中，不处理 blur（让面板选择继续）
    if (open) return;
    const trimmed = inputValue.trim();
    if (!trimmed) {
      if (clearable) {
        onChange?.(undefined);
        setInputValue("");
      } else {
        setInputValue(
          value
            ? formatTime(value.getHours(), value.getMinutes(), value.getSeconds(), showSeconds)
            : ""
        );
      }
      return;
    }
    const parsed = parseTime(trimmed);
    if (parsed) {
      const result = new Date(value ?? new Date());
      result.setHours(parsed.h, parsed.m, parsed.s, 0);
      onChange?.(result);
      setInputValue(formatTime(parsed.h, parsed.m, parsed.s, showSeconds));
    } else {
      setInputValue(
        value
          ? formatTime(value.getHours(), value.getMinutes(), value.getSeconds(), showSeconds)
          : ""
      );
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  const hasFilled = !!value;
  const isHorizontal = layout === "horizontal";
  const showClear = clearable && hasFilled && isHovered && !isDisabled;

  const defaultPlaceholder = showSeconds ? "HH:mm:ss" : "HH:mm";

  const triggerClassName = cn(
    "wm-datepicker__trigger",
    `wm-datepicker__trigger--${size}`,
    {
      "wm-datepicker__trigger--disabled": isDisabled,
      "wm-datepicker__trigger--error": error,
      "wm-datepicker__trigger--success": success,
      "wm-datepicker__trigger--filled": hasFilled,
      "wm-datepicker__trigger--open": open,
    }
  );

  const iconClassName = cn("wm-datepicker__icon", `wm-datepicker__icon--${size}`);

  const labelStyle: React.CSSProperties | undefined =
    isHorizontal && labelWidth
      ? { width: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth }
      : undefined;

  // ── 清除处理（PointerDown 阻止 blur 导致关闭，与 DatePicker 一致） ─────────────

  const handleClearPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange?.(undefined);
    setInputValue("");
  };

  const handleClearKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onChange?.(undefined);
      setInputValue("");
    }
  };

  // 验证状态 helper 类名
  const helperClassName = cn("wm-datepicker__helper", {
    "wm-datepicker__helper--error": error,
    "wm-datepicker__helper--success": success,
  });

  // ── 输入触发器（与 DatePicker date 模式结构一致） ───────────────────────────────

  const inputTrigger = (
    <div
      className={triggerClassName}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        className="wm-datepicker__input"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        onFocus={() => { if (!isDisabled) setOpen(true); }}
        onClick={() => { if (!isDisabled) setOpen(true); }}
        placeholder={placeholder ?? defaultPlaceholder}
        disabled={isDisabled}
        aria-label={label}
        autoComplete="off"
        spellCheck={false}
      />
      <div className="wm-datepicker__trigger-icons">
        {loading ? (
          <Loader2 className={cn(iconClassName, "wm-datepicker__icon--loading")} />
        ) : showClear ? (
          <span
            className="wm-datepicker__clear-btn"
            onPointerDown={handleClearPointerDown}
            onKeyDown={handleClearKeyDown}
            role="button"
            tabIndex={0}
            aria-label="清除"
          >
            <X className="wm-datepicker__clear-icon" />
          </span>
        ) : (
          <button
            type="button"
            className="wm-datepicker__icon-btn"
            tabIndex={-1}
            onMouseDown={(e) => {
              e.preventDefault();
              if (!isDisabled) setOpen((prev) => !prev);
            }}
            aria-label="打开选择器"
          >
            <Clock className={cn(iconClassName, "wm-datepicker__icon--calendar")} />
          </button>
        )}
      </div>
    </div>
  );

  // ── 控制区内容 ──────────────────────────────────────────────────────────────────

  const controlContent = (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>{inputTrigger}</PopoverAnchor>
        <PopoverContent
          className="wm-datepicker__content wm-datepicker__content--datetime"
          align="start"
          sideOffset={4}
        >
          <div className="wm-datepicker__datetime-popup">
            <div className="wm-datepicker__datetime-body">
              <div className="wm-datepicker__time-section">
                <TimePickerPanel
                  hour={tempHour}
                  minute={tempMinute}
                  second={tempSecond}
                  showSeconds={showSeconds}
                  onChange={(h, m, s) => {
                    setTempHour(h);
                    setTempMinute(m);
                    setTempSecond(s);
                    setInputValue(formatTime(h, m, s, showSeconds));
                  }}
                  open={open}
                  showHeader={false}
                />
              </div>
            </div>
            <div className="wm-datepicker__footer">
              <div className="wm-datepicker__footer-actions">
                <button
                  type="button"
                  className="wm-datepicker__footer-now-btn"
                  onClick={() => {
                    const now = new Date();
                    setTempHour(now.getHours());
                    setTempMinute(now.getMinutes());
                    setTempSecond(now.getSeconds());
                    setInputValue(
                      formatTime(now.getHours(), now.getMinutes(), now.getSeconds(), showSeconds)
                    );
                  }}
                >
                  此刻
                </button>
              </div>
              <div className="wm-datepicker__footer-actions">
                <button
                  className="wm-datepicker__footer-btn wm-datepicker__footer-btn--primary"
                  onClick={() => {
                    const result = new Date(value ?? new Date());
                    result.setHours(tempHour, tempMinute, tempSecond, 0);
                    onChange?.(result);
                    setInputValue(formatTime(tempHour, tempMinute, tempSecond, showSeconds));
                    setOpen(false);
                  }}
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {helperText && <p className={helperClassName}>{helperText}</p>}
    </>
  );

  return (
    <div
      className={cn(
        "wm-datepicker",
        isHorizontal && "wm-form-horizontal",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label && (
        <label
          className={isHorizontal ? "wm-form-label--horizontal" : "wm-datepicker__label"}
          style={labelStyle}
        >
          {isHorizontal && required && <span className="wm-form-label__required">*</span>}
          {label}
          {!isHorizontal && required && <span className="wm-datepicker__label-required">*</span>}
          {isHorizontal && "："}
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