/**
 * PimaBadge — 徽标数组件
 * 支持数字徽标、圆点徽标，叠加在子元素右上角
 */
import React from "react";
import "../styles/badge.css";

export interface PimaBadgeProps {
  /** 徽标数值（为 0 且 showZero=false 时不显示） */
  count?: number;
  /** 仅显示小圆点，不显示数字 */
  dot?: boolean;
  /** count 为 0 时是否显示（仅 count 模式有效） */
  showZero?: boolean;
  /** 封顶数值，超出时显示 max+，默认 99 */
  max?: number;
  /** 自定义徽标颜色（CSS 颜色值） */
  color?: string;
  /** 是否隐藏徽标 */
  hidden?: boolean;
  /** 包裹的子元素 */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function PimaBadge({
  count,
  dot = false,
  showZero = false,
  max = 99,
  color,
  hidden = false,
  children,
  className = "",
  style,
}: PimaBadgeProps) {
  const standalone = !children;

  // 计算展示文本
  const displayText =
    count !== undefined
      ? count > max
        ? `${max}+`
        : String(count)
      : undefined;

  // 是否应该渲染徽标
  const showCount =
    !hidden &&
    !dot &&
    count !== undefined &&
    (showZero || count > 0);

  const showDot = !hidden && dot;

  const customColorStyle = color
    ? ({ "--badge-color": color } as React.CSSProperties)
    : undefined;

  const containerClass = [
    "wm-badge",
    standalone ? "wm-badge--standalone" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={containerClass} style={style}>
      {children}
      {showCount && (
        <span
          className={`wm-badge__count${color ? " wm-badge__count--custom" : ""}`}
          style={customColorStyle}
          aria-label={`${count} 条通知`}
        >
          {displayText}
        </span>
      )}
      {showDot && (
        <span
          className={`wm-badge__dot${color ? " wm-badge__dot--custom" : ""}`}
          style={customColorStyle}
          aria-label="有新消息"
        />
      )}
    </span>
  );
}
