/**
 * PimaStatistic — 统计数值组件
 * 视觉参考 Ant Design Statistic，适配 WM 设计系统
 * 支持前/后缀、趋势箭头、倒计时、加载态、分组（含卡片式）
 */
import React, { useState, useEffect, useRef } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "./ui/utils";
import "../styles/statistic.css";

// ========== Types ==========
export type StatisticSize = "sm" | "default" | "lg";
export type StatisticColor =
  | "default"
  | "primary"
  | "success"
  | "error"
  | "warning";
export type TrendDirection = "up" | "down";

export interface PimaStatisticProps {
  /** 标题 */
  title?: React.ReactNode;
  /** 数值 */
  value?: number | string;
  /** 精度（小数位数） */
  precision?: number;
  /** 千分位分隔符，默认 "," */
  groupSeparator?: string;
  /** 小数分隔符，默认 "." */
  decimalSeparator?: string;
  /** 前缀（文字或图标） */
  prefix?: React.ReactNode;
  /** 后缀（文字或图标） */
  suffix?: React.ReactNode;
  /** 尺寸 */
  size?: StatisticSize;
  /** 数值颜色 */
  color?: StatisticColor;
  /** 描述文本（数值下方） */
  description?: React.ReactNode;
  /** 趋势方向 */
  trend?: TrendDirection;
  /** 趋势文本（如 "+12.5%"） */
  trendValue?: string;
  /** 加载中 */
  loading?: boolean;
  /** 额外 className */
  className?: string;
  /** 额外 style */
  style?: React.CSSProperties;
}

/** 格式化数值（千分位 + 精度） */
function formatValue(
  value: number | string,
  precision?: number,
  groupSeparator = ",",
  decimalSeparator = "."
): string {
  if (typeof value === "string") return value;

  let formatted: string;
  if (precision !== undefined) {
    formatted = value.toFixed(precision);
  } else {
    formatted = String(value);
  }

  const parts = formatted.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
  return parts.join(decimalSeparator);
}

// ========== 主组件 ==========
export function PimaStatistic({
  title,
  value,
  precision,
  groupSeparator = ",",
  decimalSeparator = ".",
  prefix,
  suffix,
  size = "default",
  color = "default",
  description,
  trend,
  trendValue,
  loading = false,
  className,
  style,
}: PimaStatisticProps) {
  const displayValue =
    value !== undefined
      ? formatValue(value, precision, groupSeparator, decimalSeparator)
      : "—";

  const valueClassName = cn(
    "wm-statistic__value",
    size !== "default" && `wm-statistic__value--${size}`,
    color !== "default" && `wm-statistic__value--${color}`
  );

  const rootClassName = cn(
    "wm-statistic",
    color !== "default" && `wm-statistic--${color}`,
    size !== "default" && `wm-statistic--${size}`,
    className
  );

  const skeletonClassName = cn(
    "wm-statistic__skeleton",
    size === "sm" && "wm-statistic__skeleton--sm",
    size === "lg" && "wm-statistic__skeleton--lg"
  );

  const hasFooter = description || trend;

  return (
    <div className={rootClassName} style={style}>
      {title && <div className="wm-statistic__title">{title}</div>}

      <div className="wm-statistic__content">
        {loading ? (
          <div className={skeletonClassName} />
        ) : (
          <div className="wm-statistic__value-row">
            {prefix && (
              <span className="wm-statistic__prefix">{prefix}</span>
            )}
            <span className={valueClassName}>{displayValue}</span>
            {suffix && (
              <span className="wm-statistic__suffix">{suffix}</span>
            )}
          </div>
        )}

        {hasFooter && !loading && (
          <div className="wm-statistic__footer">
            {trend && (
              <span
                className={cn(
                  "wm-statistic__trend",
                  `wm-statistic__trend--${trend}`
                )}
              >
                <span className="wm-statistic__trend-icon">
                  {trend === "up" ? <ArrowUp /> : <ArrowDown />}
                </span>
                {trendValue && <span>{trendValue}</span>}
              </span>
            )}
            {description && (
              <span className="wm-statistic__description">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== 倒计时组件 ==========
export interface PimaCountdownProps {
  /** 标题 */
  title?: React.ReactNode;
  /** 目标时间（时间戳 ms 或 Date） */
  target: number | Date;
  /** 格式化模板，默认 "HH:mm:ss" */
  format?: string;
  /** 倒计时结束回调 */
  onFinish?: () => void;
  /** 尺寸 */
  size?: StatisticSize;
  /** 数值颜色 */
  color?: StatisticColor;
  /** 前缀 */
  prefix?: React.ReactNode;
  /** 后缀 */
  suffix?: React.ReactNode;
  /** 额外 className */
  className?: string;
}

function padZero(n: number): string {
  return String(n).padStart(2, "0");
}

function formatCountdown(diff: number, format: string): string {
  if (diff <= 0) {
    return format
      .replace("DD", "00")
      .replace("HH", "00")
      .replace("mm", "00")
      .replace("ss", "00");
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return format
    .replace("DD", padZero(days))
    .replace("HH", padZero(hours))
    .replace("mm", padZero(minutes))
    .replace("ss", padZero(seconds));
}

export function PimaCountdown({
  title,
  target,
  format = "HH:mm:ss",
  onFinish,
  size = "default",
  color = "default",
  prefix,
  suffix,
  className,
}: PimaCountdownProps) {
  const targetMs = typeof target === "number" ? target : target.getTime();
  const finishedRef = useRef(false);

  const [display, setDisplay] = useState(() =>
    formatCountdown(targetMs - Date.now(), format)
  );

  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    finishedRef.current = false;
    const timer = setInterval(() => {
      const diff = targetMs - Date.now();
      setDisplay(formatCountdown(diff, format));
      if (diff <= 0 && !finishedRef.current) {
        finishedRef.current = true;
        clearInterval(timer);
        onFinishRef.current?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetMs, format]);

  const valueClassName = cn(
    "wm-statistic__value",
    "wm-statistic__countdown",
    size !== "default" && `wm-statistic__value--${size}`,
    color !== "default" && `wm-statistic__value--${color}`
  );

  const rootClassName = cn(
    "wm-statistic",
    color !== "default" && `wm-statistic--${color}`,
    size !== "default" && `wm-statistic--${size}`,
    className
  );

  return (
    <div className={rootClassName}>
      {title && <div className="wm-statistic__title">{title}</div>}
      <div className="wm-statistic__content">
        <div className="wm-statistic__value-row">
          {prefix && (
            <span className="wm-statistic__prefix">{prefix}</span>
          )}
          <span className={valueClassName}>{display}</span>
          {suffix && (
            <span className="wm-statistic__suffix">{suffix}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== 分组容器 ==========
export interface PimaStatisticGroupProps {
  /** 是否显示分隔线 */
  divider?: boolean;
  /** 卡片式背景 */
  card?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function PimaStatisticGroup({
  divider = false,
  card = false,
  children,
  className,
}: PimaStatisticGroupProps) {
  return (
    <div
      className={cn(
        "wm-statistic-group",
        divider && "wm-statistic-group--divider",
        card && "wm-statistic-group--card",
        className
      )}
    >
      {children}
    </div>
  );
}
