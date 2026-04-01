import React, { useState, useEffect } from "react";
import { PimaCalendar } from "./PimaCalendar";
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from "./ui/popover";
import { CalendarIcon, Loader2, X } from "lucide-react";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { cn } from "./ui/utils";
import type { PimaDatePickerProps, PimaDateRange } from "../types/pima-components";
import { TimePickerPanel } from "./PimaTimePicker";
import "../styles/datepicker.css";
import "../styles/form-layout.css";

/**
 * SafeButton: filters out Figma runtime props (_fgT, _fgS, _fgB)
 * that cause React DOM warnings when passed via Radix asChild.
 */
const FIGMA_PROPS = new Set(["_fgT", "_fgS", "_fgB"]);

const SafeButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (!FIGMA_PROPS.has(k)) clean[k] = v;
  }
  return <button ref={ref} {...(clean as React.ButtonHTMLAttributes<HTMLButtonElement>)} />;
});
SafeButton.displayName = "SafeButton";

export type { PimaDatePickerProps };

// ─── 格式化工具 ────────────────────────────────────────────────────────────────

function formatDate(date: Date | undefined, format: string = "yyyy-MM-dd"): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return format
    .replace("yyyy", String(year))
    .replace("MM", month)
    .replace("dd", day);
}

function formatTime(h: number, m: number, s: number, showSeconds: boolean): string {
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
}

function formatDateTime(date: Date | undefined, showSeconds: boolean): string {
  if (!date) return "";
  return `${formatDate(date)} ${formatTime(date.getHours(), date.getMinutes(), date.getSeconds(), showSeconds)}`;
}

function formatTimeOnly(date: Date | undefined, showSeconds: boolean): string {
  if (!date) return "";
  return formatTime(date.getHours(), date.getMinutes(), date.getSeconds(), showSeconds);
}

function formatRangeValue(range: PimaDateRange | undefined): string {
  if (!range?.from) return "";
  const from = formatDate(range.from);
  const to = range.to ? formatDate(range.to) : "...";
  return `${from} ~ ${to}`;
}

// ─── Week / Month / Year 格式化工具 ─────────────────────────────────────────────

/** 获取 ISO 周号 */
function getISOWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** 获取某日期所在周的周一 */
function getWeekMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // 周日时退6天
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** 获取某日期所在周的周日 */
function getWeekSunday(d: Date): Date {
  const monday = getWeekMonday(d);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  return sunday;
}

function formatWeek(date: Date | undefined): string {
  if (!date) return "";
  const monday = getWeekMonday(date);
  const sunday = getWeekSunday(date);
  const weekNum = getISOWeekNumber(monday);
  const mStr = `${String(monday.getMonth() + 1).padStart(2, "0")}/${String(monday.getDate()).padStart(2, "0")}`;
  const sStr = `${String(sunday.getMonth() + 1).padStart(2, "0")}/${String(sunday.getDate()).padStart(2, "0")}`;
  return `${monday.getFullYear()}年 第${weekNum}周 (${mStr} - ${sStr})`;
}

function formatMonth(date: Date | undefined): string {
  if (!date) return "";
  return `${date.getFullYear()}年 ${date.getMonth() + 1}月`;
}

function formatYear(date: Date | undefined): string {
  if (!date) return "";
  return `${date.getFullYear()}年`;
}

const MONTH_LABELS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

// ─── MonthPickerPanel 月份选择面板 ───────────────────────────────────────────────

function MonthPickerPanel({
  selected,
  onSelect,
}: {
  selected?: Date;
  onSelect: (date: Date) => void;
}) {
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? new Date().getFullYear());
  const selectedMonth = selected ? selected.getMonth() : -1;
  const selectedYear = selected?.getFullYear();

  return (
    <div className="wm-datepicker__panel">
      <div className="wm-datepicker__panel-header">
        <button type="button" className="wm-cal__nav-btn" onClick={() => setViewYear(viewYear - 1)} aria-label="上一年">
          <ChevronLeft className="wm-cal__nav-icon" />
        </button>
        <span className="wm-datepicker__panel-title">{viewYear}年</span>
        <button type="button" className="wm-cal__nav-btn" onClick={() => setViewYear(viewYear + 1)} aria-label="下一年">
          <ChevronRight className="wm-cal__nav-icon" />
        </button>
      </div>
      <div className="wm-datepicker__panel-grid wm-datepicker__panel-grid--4x3">
        {MONTH_LABELS.map((label, idx) => {
          const isSelected = selectedYear === viewYear && selectedMonth === idx;
          return (
            <button
              key={idx}
              type="button"
              className={cn("wm-datepicker__panel-cell", isSelected && "wm-datepicker__panel-cell--selected")}
              onClick={() => onSelect(new Date(viewYear, idx, 1))}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── YearPickerPanel 年份选择面板 ────────────────────────────────────────────────

function YearPickerPanel({
  selected,
  onSelect,
}: {
  selected?: Date;
  onSelect: (date: Date) => void;
}) {
  const currentYear = selected?.getFullYear() ?? new Date().getFullYear();
  const [decadeStart, setDecadeStart] = useState(Math.floor(currentYear / 10) * 10);
  const selectedYear = selected?.getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i);

  return (
    <div className="wm-datepicker__panel">
      <div className="wm-datepicker__panel-header">
        <button type="button" className="wm-cal__nav-btn" onClick={() => setDecadeStart(decadeStart - 10)} aria-label="上一个十年">
          <ChevronLeft className="wm-cal__nav-icon" />
        </button>
        <span className="wm-datepicker__panel-title">{decadeStart} - {decadeStart + 9}</span>
        <button type="button" className="wm-cal__nav-btn" onClick={() => setDecadeStart(decadeStart + 10)} aria-label="下一个十年">
          <ChevronRight className="wm-cal__nav-icon" />
        </button>
      </div>
      <div className="wm-datepicker__panel-grid wm-datepicker__panel-grid--4x3">
        {years.map((year) => {
          const isSelected = selectedYear === year;
          const isOutside = year < decadeStart || year > decadeStart + 9;
          return (
            <button
              key={year}
              type="button"
              className={cn(
                "wm-datepicker__panel-cell",
                isSelected && "wm-datepicker__panel-cell--selected",
                isOutside && "wm-datepicker__panel-cell--outside"
              )}
              onClick={() => onSelect(new Date(year, 0, 1))}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── PimaDatePicker 主组件 ──────────────────────────────────────────────────────

export function PimaDatePicker({
  mode = "date",
  date,
  onDateChange,
  dateRange,
  onDateRangeChange,
  showSeconds = false,
  disabled = false,
  loading = false,
  error = false,
  success = false,
  variant = "default",
  size = "sm",
  label,
  required = false,
  helperText,
  placeholder,
  format = "yyyy-MM-dd",
  minDate,
  maxDate,
  disabledDates,
  clearable = true,
  layout = "vertical",
  labelWidth,
  className,
}: PimaDatePickerProps) {
  const [open, setOpen] = useState(false);
  // range 模式：分别控制开始/结束日期弹窗
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // range 模式：分别控制开始/结束 input 的 hover 状态
  const [isStartHovered, setIsStartHovered] = useState(false);
  const [isEndHovered, setIsEndHovered] = useState(false);

  // datetime 模式：弹窗内的临时状态（未确认前不更新外部）
  const [tempDate, setTempDate] = useState<Date | undefined>(undefined);
  const [tempHour, setTempHour] = useState(0);
  const [tempMinute, setTempMinute] = useState(0);
  const [tempSecond, setTempSecond] = useState(0);

  // date / time 模式：input 的本地文本状态
  const getInitialInputValue = () => {
    if (mode === "date") return date ? formatDate(date, format) : "";
    return "";
  };
  const [inputValue, setInputValue] = useState<string>(getInitialInputValue);

  // range 模式：开始/结束 input 的本地文本状态
  const [startInputValue, setStartInputValue] = useState<string>(
    dateRange?.from ? formatDate(dateRange.from, format) : ""
  );
  const [endInputValue, setEndInputValue] = useState<string>(
    dateRange?.to ? formatDate(dateRange.to, format) : ""
  );

  // 每次打开 datetime 弹窗时，从外部 date 同步状态
  useEffect(() => {
    if (open && mode === "datetime") {
      setTempDate(date);
      setTempHour(date?.getHours() ?? 0);
      setTempMinute(date?.getMinutes() ?? 0);
      setTempSecond(date?.getSeconds() ?? 0);
    }
  }, [open]);

  // 外部 date 变化时同步 inputValue
  useEffect(() => {
    if (mode === "date") setInputValue(date ? formatDate(date, format) : "");
  }, [date]);

  // 外部 dateRange 变化时同步 range input 文本
  useEffect(() => {
    if (mode === "range") {
      setStartInputValue(dateRange?.from ? formatDate(dateRange.from, format) : "");
      setEndInputValue(dateRange?.to ? formatDate(dateRange.to, format) : "");
    }
  }, [dateRange?.from, dateRange?.to]);

  // ── 输入解析工具 ──────────────────────────────────────────────────────────────

  const parseDate = (str: string): Date | null => {
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const y = Number(match[1]), m = Number(match[2]), d = Number(match[3]);
    const result = new Date(y, m - 1, d);
    if (
      isNaN(result.getTime()) ||
      result.getFullYear() !== y ||
      result.getMonth() + 1 !== m ||
      result.getDate() !== d
    ) return null;
    return result;
  };

  const parseTime = (str: string): { h: number; m: number; s: number } | null => {
    const match = str.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
    if (!match) return null;
    const h = Number(match[1]), m = Number(match[2]), s = Number(match[3] ?? 0);
    if (h > 23 || m > 59 || s > 59) return null;
    return { h, m, s };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (mode === "date") {
      const parsed = parseDate(val);
      if (parsed) onDateChange?.(parsed);
    }
  };

  const handleInputBlur = () => {
    if (mode === "date") setInputValue(date ? formatDate(date, format) : "");
  };

  // range 模式 input 输入处理
  const handleStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStartInputValue(val);
    const parsed = parseDate(val);
    if (parsed) {
      // 若新的开始日期晚于已有结束日期，则清除结束日期
      const newTo = dateRange?.to && parsed > dateRange.to ? undefined : dateRange?.to;
      onDateRangeChange?.({ from: parsed, to: newTo });
    }
  };

  const handleEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEndInputValue(val);
    const parsed = parseDate(val);
    if (parsed) {
      // 若新的结束日期早于已有开始日期，则清除开始日期
      const newFrom = dateRange?.from && parsed < dateRange.from ? undefined : dateRange?.from;
      onDateRangeChange?.({ from: newFrom, to: parsed });
    }
  };

  const handleStartInputBlur = () => {
    setStartInputValue(dateRange?.from ? formatDate(dateRange.from, format) : "");
  };

  const handleEndInputBlur = () => {
    setEndInputValue(dateRange?.to ? formatDate(dateRange.to, format) : "");
  };

  const getVariant = () => {
    if (error || variant === "error") return "error";
    if (success || variant === "success") return "success";
    return "default";
  };

  const currentVariant = getVariant();
  const isDisabled = disabled || loading;

  const hasFilled = mode === "range" ? !!dateRange?.from : !!date;
  const showClear = clearable && hasFilled && !isDisabled && !loading && isHovered;

  const isHorizontal = layout === "horizontal";

  const defaultPlaceholder =
    mode === "datetime"
      ? "选择日期时间"
      : mode === "range"
      ? "选择日期区间"
      : mode === "week"
      ? "选择周"
      : mode === "month"
      ? "选择月份"
      : mode === "year"
      ? "选择年份"
      : "yyyy-MM-dd";

  const getTriggerValue = (): string => {
    if (mode === "range") return formatRangeValue(dateRange);
    if (mode === "datetime") return formatDateTime(date, showSeconds);
    if (mode === "week") return formatWeek(date);
    if (mode === "month") return formatMonth(date);
    if (mode === "year") return formatYear(date);
    return "";
  };

  const triggerValue = getTriggerValue();

  const getDisabledDates = (extra?: { before?: Date; after?: Date }) => {
    const matchers: any[] = [];
    if (minDate || extra?.before) matchers.push({ before: extra?.before ?? minDate });
    if (maxDate || extra?.after) matchers.push({ after: extra?.after ?? maxDate });
    if (disabledDates) {
      if (typeof disabledDates === "function") matchers.push(disabledDates);
      else if (Array.isArray(disabledDates)) matchers.push(...disabledDates);
    }
    return matchers.length > 0 ? matchers : undefined;
  };

  // ── 事件处理 ──────────────────────────────────────────────────────────────────

  const handleSingleSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate);
    setOpen(false);
  };

  const handleDateTimeCalendarSelect = (selectedDate: Date | undefined) => {
    setTempDate(selectedDate);
  };

  const handleConfirmDateTime = () => {
    if (tempDate) {
      const result = new Date(tempDate);
      result.setHours(tempHour, tempMinute, tempSecond, 0);
      onDateChange?.(result);
    }
    setOpen(false);
  };

  // range 模式：开始日期选择
  const handleStartSelect = (selectedDate: Date | undefined) => {
    const newTo = dateRange?.to && selectedDate && selectedDate > dateRange.to
      ? undefined
      : dateRange?.to;
    onDateRangeChange?.({ from: selectedDate, to: newTo });
    setStartOpen(false);
  };

  const handleEndSelect = (selectedDate: Date | undefined) => {
    const newFrom = dateRange?.from && selectedDate && selectedDate < dateRange.from
      ? undefined
      : dateRange?.from;
    onDateRangeChange?.({ from: newFrom, to: selectedDate });
    setEndOpen(false);
  };

  const handleClearPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDateChange?.(undefined);
  };

  const handleClearKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onDateChange?.(undefined);
    }
  };

  // range 模式：单独清除开始日期
  const handleClearStartPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDateRangeChange?.({ from: undefined, to: dateRange?.to });
  };

  const handleClearStartKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onDateRangeChange?.({ from: undefined, to: dateRange?.to });
    }
  };

  // range 模式：单独清除结束日期
  const handleClearEndPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDateRangeChange?.({ from: dateRange?.from, to: undefined });
  };

  const handleClearEndKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onDateRangeChange?.({ from: dateRange?.from, to: undefined });
    }
  };

  // ── 样式计算 ────────────────────────────────────────────────────────────────

  const rootClassName = cn(
    "wm-datepicker",
    `wm-datepicker--${size}`,
    {
      "wm-datepicker--disabled": isDisabled,
      "wm-datepicker--error": currentVariant === "error",
      "wm-datepicker--success": currentVariant === "success",
      "wm-datepicker--horizontal": isHorizontal,
    },
    className
  );

  const triggerClassName = cn(
    "wm-datepicker__trigger",
    `wm-datepicker__trigger--${size}`,
    {
      "wm-datepicker__trigger--disabled": isDisabled,
      "wm-datepicker__trigger--error": currentVariant === "error",
      "wm-datepicker__trigger--success": currentVariant === "success",
      "wm-datepicker__trigger--filled": hasFilled,
      "wm-datepicker__trigger--open": open,
    }
  );

  const iconClassName = cn("wm-datepicker__icon", `wm-datepicker__icon--${size}`);

  const labelStyle: React.CSSProperties | undefined =
    isHorizontal && labelWidth
      ? { width: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth }
      : undefined;

  // ── Popover 内容 ──────────────────────────────────────────────────────────────

  const renderPopoverContent = () => {
    if (mode === "datetime") {
      return (
        <div className="wm-datepicker__datetime-popup">
          <div className="wm-datepicker__datetime-body">
            <PimaCalendar
              mode="single"
              selected={tempDate}
              onSelect={handleDateTimeCalendarSelect}
              disabled={getDisabledDates()}
              initialFocus
            />
            <div className="wm-datepicker__datetime-divider" />
            <div className="wm-datepicker__time-section">
              <TimePickerPanel
                hour={tempHour}
                minute={tempMinute}
                second={tempSecond}
                showSeconds={true}
                onChange={(h, m, s) => { setTempHour(h); setTempMinute(m); setTempSecond(s); }}
                open={open}
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
                  setTempDate(now);
                  setTempHour(now.getHours());
                  setTempMinute(now.getMinutes());
                  setTempSecond(now.getSeconds());
                }}
              >
                此刻
              </button>
            </div>
            <div className="wm-datepicker__footer-actions">
              <button className="wm-datepicker__footer-btn" onClick={() => setOpen(false)}>取消</button>
              <button
                className="wm-datepicker__footer-btn wm-datepicker__footer-btn--primary"
                onClick={handleConfirmDateTime}
                disabled={!tempDate}
              >确认</button>
            </div>
          </div>
        </div>
      );
    }

    // week 模式：点击日期自动选中整周（周一至周日）
    if (mode === "week") {
      return (
        <div className="wm-datepicker__week-mode">
          <PimaCalendar
            mode="single"
            selected={date}
            onSelect={(selectedDate: Date | undefined) => {
              if (selectedDate) {
                const monday = getWeekMonday(selectedDate);
                onDateChange?.(monday);
              }
              setOpen(false);
            }}
            disabled={getDisabledDates()}
            initialFocus
            modifiers={date ? {
              weekRange: (d: Date) => {
                const monday = getWeekMonday(date);
                const sunday = getWeekSunday(date);
                return d >= monday && d <= sunday;
              },
            } : undefined}
            modifiersClassNames={date ? {
              weekRange: "wm-cal__day--week-range",
            } : undefined}
          />
        </div>
      );
    }

    // month 模式
    if (mode === "month") {
      return (
        <MonthPickerPanel
          selected={date}
          onSelect={(selectedDate) => {
            onDateChange?.(selectedDate);
            setOpen(false);
          }}
        />
      );
    }

    // year 模式
    if (mode === "year") {
      return (
        <YearPickerPanel
          selected={date}
          onSelect={(selectedDate) => {
            onDateChange?.(selectedDate);
            setOpen(false);
          }}
        />
      );
    }

    // date 模式（默认）
    return (
      <PimaCalendar
        mode="single"
        selected={date}
        onSelect={handleSingleSelect}
        disabled={getDisabledDates()}
        initialFocus
        showToday
        onTodayClick={(today) => handleSingleSelect(today)}
      />
    );
  };

  const contentClassName = cn(
    "wm-datepicker__content",
    mode === "datetime" && "wm-datepicker__content--datetime"
  );

  // ── Range 模式：两个独立 Popover ──────────────────────────────────────────────

  const rangeControl = (
    <div
      className={cn(
        "wm-datepicker__trigger--range-wrapper",
        {
          "wm-datepicker__trigger--range-wrapper--disabled": isDisabled,
          "wm-datepicker__trigger--range-wrapper--error": currentVariant === "error",
          "wm-datepicker__trigger--range-wrapper--success": currentVariant === "success",
        }
      )}
    >
      {/* ── 开始日期 ── */}
      <Popover open={startOpen} onOpenChange={setStartOpen}>
        <PopoverAnchor asChild>
          <div
            className={cn(
              "wm-datepicker__range-input",
              `wm-datepicker__range-input--${size}`,
              {
                "wm-datepicker__range-input--filled": !!dateRange?.from,
                "wm-datepicker__range-input--error": currentVariant === "error",
                "wm-datepicker__range-input--success": currentVariant === "success",
                "wm-datepicker__range-input--disabled": isDisabled,
                "wm-datepicker__range-input--open": startOpen,
              }
            )}
            onMouseEnter={() => setIsStartHovered(true)}
            onMouseLeave={() => setIsStartHovered(false)}
          >
            <input
              className="wm-datepicker__range-text-input"
              value={startInputValue}
              onChange={handleStartInputChange}
              onBlur={handleStartInputBlur}
              onFocus={() => { if (!isDisabled) { setStartOpen(true); setEndOpen(false); } }}
              onClick={() => { if (!isDisabled) { setStartOpen(true); setEndOpen(false); } }}
              placeholder="开始日期"
              disabled={isDisabled}
              autoComplete="off"
              spellCheck={false}
            />
            {loading ? (
              <Loader2 className={cn(iconClassName, "wm-datepicker__icon--loading")} />
            ) : clearable && !!dateRange?.from && !isDisabled && isStartHovered ? (
              <span
                className="wm-datepicker__clear-btn"
                onPointerDown={handleClearStartPointerDown}
                onKeyDown={handleClearStartKeyDown}
                role="button"
                tabIndex={0}
                aria-label="清除开始日期"
              >
                <X className="wm-datepicker__clear-icon" />
              </span>
            ) : (
              <CalendarIcon className={cn("wm-datepicker__range-input-icon", `wm-datepicker__icon--${size}`)} />
            )}
          </div>
        </PopoverAnchor>
        <PopoverContent className="wm-datepicker__content" align="start">
          <PimaCalendar
            mode="single"
            selected={dateRange?.from}
            onSelect={handleStartSelect}
            disabled={getDisabledDates({ after: dateRange?.to })}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* ── 分隔符 ── */}
      <span className="wm-datepicker__range-dash">–</span>

      {/* ── 结束日期 ── */}
      <Popover open={endOpen} onOpenChange={setEndOpen}>
        <PopoverAnchor asChild>
          <div
            className={cn(
              "wm-datepicker__range-input",
              `wm-datepicker__range-input--${size}`,
              {
                "wm-datepicker__range-input--filled": !!dateRange?.to,
                "wm-datepicker__range-input--error": currentVariant === "error",
                "wm-datepicker__range-input--success": currentVariant === "success",
                "wm-datepicker__range-input--disabled": isDisabled,
                "wm-datepicker__range-input--open": endOpen,
              }
            )}
            onMouseEnter={() => setIsEndHovered(true)}
            onMouseLeave={() => setIsEndHovered(false)}
          >
            <input
              className="wm-datepicker__range-text-input"
              value={endInputValue}
              onChange={handleEndInputChange}
              onBlur={handleEndInputBlur}
              onFocus={() => { if (!isDisabled) { setEndOpen(true); setStartOpen(false); } }}
              onClick={() => { if (!isDisabled) { setEndOpen(true); setStartOpen(false); } }}
              placeholder="结束日期"
              disabled={isDisabled}
              autoComplete="off"
              spellCheck={false}
            />
            {loading ? (
              <Loader2 className={cn(iconClassName, "wm-datepicker__icon--loading")} />
            ) : clearable && !!dateRange?.to && !isDisabled && isEndHovered ? (
              <span
                className="wm-datepicker__clear-btn"
                onPointerDown={handleClearEndPointerDown}
                onKeyDown={handleClearEndKeyDown}
                role="button"
                tabIndex={0}
                aria-label="清除结束日期"
              >
                <X className="wm-datepicker__clear-icon" />
              </span>
            ) : (
              <CalendarIcon className={cn("wm-datepicker__range-input-icon", `wm-datepicker__icon--${size}`)} />
            )}
          </div>
        </PopoverAnchor>
        <PopoverContent className="wm-datepicker__content" align="start">
          <PimaCalendar
            mode="single"
            selected={dateRange?.to}
            onSelect={handleEndSelect}
            disabled={getDisabledDates({ before: dateRange?.from })}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  // ── date / time 模式：可输入 + 图标打开选择器 ──────────────────────────────────

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
            <CalendarIcon className={cn(iconClassName, "wm-datepicker__icon--calendar")} />
          </button>
        )}
      </div>
    </div>
  );

  // ── datetime 模式：保留 SafeButton 触发器 ─────────────────────────────────────

  const datetimeTrigger = (
    <SafeButton
      type="button"
      className={triggerClassName}
      disabled={isDisabled}
      aria-label={label}
    >
      <div className="wm-datepicker__trigger-content">
        <span className="wm-datepicker__trigger-value">
          {triggerValue || (placeholder ?? defaultPlaceholder)}
        </span>
      </div>
      <div className="wm-datepicker__trigger-icons">
        {loading && (
          <Loader2 className={cn(iconClassName, "wm-datepicker__icon--loading")} />
        )}
        {showClear && (
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
        )}
        {!loading && !showClear && (
          <CalendarIcon className={cn(iconClassName, "wm-datepicker__icon--calendar")} />
        )}
      </div>
    </SafeButton>
  );

  const controlContent = (
    <>
      {mode === "range" ? (
        rangeControl
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          {mode === "date" ? (
            <>
              <PopoverAnchor asChild>{inputTrigger}</PopoverAnchor>
              <PopoverContent className={contentClassName} align="start">
                {renderPopoverContent()}
              </PopoverContent>
            </>
          ) : (
            <>
              <PopoverTrigger asChild>{datetimeTrigger}</PopoverTrigger>
              <PopoverContent className={contentClassName} align="start">
                {renderPopoverContent()}
              </PopoverContent>
            </>
          )}
        </Popover>
      )}

      {helperText && (
        <p className={cn("wm-datepicker__helper", `wm-datepicker__helper--${currentVariant}`)}>
          {helperText}
        </p>
      )}
    </>
  );

  return (
    <div
      className={rootClassName}
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