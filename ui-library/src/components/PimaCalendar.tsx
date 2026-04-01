/**
 * PimaCalendar
 * 自定义日历组件，对齐设计稿：
 * - Caption: [<<] [<]  2026年 3月  [>] [>>]，蓝色导航图标，底部分割线
 * - 周首为日（日 一 二 三 四 五 六），字色浅灰
 * - 日期格有 hover 态：浅蓝底色 + 主题色文字
 * - 今日 / 选中：主题色填充 + 白色文字
 * - 底部可选"今天"快捷按钮
 */
import * as React from "react";
import { DayPicker, useNavigation } from "react-day-picker";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { cn } from "./ui/utils";
import "../styles/pima-calendar.css";

// ─── 自定义 Caption ───────────────────────────────────────────────────────────

interface PimaCaptionProps {
  displayMonth: Date;
}

function PimaCaption({ displayMonth }: PimaCaptionProps) {
  const { goToMonth } = useNavigation();
  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();

  return (
    <div className="wm-cal__caption">
      <button
        type="button"
        className="wm-cal__nav-btn"
        onClick={() => goToMonth(new Date(year - 1, month))}
        aria-label="上一年"
      >
        <ChevronsLeft className="wm-cal__nav-icon" />
      </button>
      <button
        type="button"
        className="wm-cal__nav-btn"
        onClick={() => goToMonth(new Date(year, month - 1))}
        aria-label="上一月"
      >
        <ChevronLeft className="wm-cal__nav-icon" />
      </button>

      <span className="wm-cal__caption-label">
        {year}年&nbsp;{month + 1}月
      </span>

      <button
        type="button"
        className="wm-cal__nav-btn"
        onClick={() => goToMonth(new Date(year, month + 1))}
        aria-label="下一月"
      >
        <ChevronRight className="wm-cal__nav-icon" />
      </button>
      <button
        type="button"
        className="wm-cal__nav-btn"
        onClick={() => goToMonth(new Date(year + 1, month))}
        aria-label="下一年"
      >
        <ChevronsRight className="wm-cal__nav-icon" />
      </button>
    </div>
  );
}

// ─── PimaCalendar Props ───────────────────────────────────────────────────────

interface PimaCalendarProps extends React.ComponentProps<typeof DayPicker> {
  /** 是否在底部显示"今天"快捷按钮 */
  showToday?: boolean;
  /** 点击"今天"按钮的回调，传入今天的 Date */
  onTodayClick?: (today: Date) => void;
}

// ─── PimaCalendar ─────────────────────────────────────────────────────────────

export function PimaCalendar({
  showToday = false,
  onTodayClick,
  ...props
}: PimaCalendarProps) {
  const isRange = props.mode === "range";

  const handleTodayClick = () => {
    const today = new Date();
    onTodayClick?.(today);
  };

  return (
    <div className="wm-cal__wrapper">
      <DayPicker
        showOutsideDays
        {...props}
        className={cn("wm-cal", props.className)}
        classNames={{
          months:              "wm-cal__months",
          month:               "wm-cal__month",
          caption:             "wm-cal__caption-wrapper",
          caption_label:       "wm-cal__caption-label-hidden",
          nav:                 "wm-cal__nav-hidden",
          nav_button:          "wm-cal__nav-btn-hidden",
          nav_button_previous: "",
          nav_button_next:     "",
          table:               "wm-cal__table",
          head_row:            "wm-cal__head-row",
          head_cell:           "wm-cal__head-cell",
          row:                 "wm-cal__row",
          cell: cn(
            "wm-cal__cell",
            isRange && "wm-cal__cell--range"
          ),
          day:              "wm-cal__day",
          day_selected:     "wm-cal__day--selected",
          day_today:        "wm-cal__day--today",
          day_outside:      "wm-cal__day--outside",
          day_disabled:     "wm-cal__day--disabled",
          day_range_start:  "wm-cal__day--range-start",
          day_range_end:    "wm-cal__day--range-end",
          day_range_middle: "wm-cal__day--range-middle",
          day_hidden:       "wm-cal__day--hidden",
          ...props.classNames,
        }}
        components={{
          Caption:   PimaCaption as any,
          IconLeft:  () => null,
          IconRight: () => null,
          ...props.components,
        }}
      />

      {showToday && (
        <div className="wm-cal__footer">
          <button
            type="button"
            className="wm-cal__today-btn"
            onClick={handleTodayClick}
          >
            今天
          </button>
        </div>
      )}
    </div>
  );
}
