import React from "react";
import { X } from "lucide-react";
import "../styles/tag.css";

export interface PimaTagProps {
  /** 标签文本内容 */
  children: React.ReactNode;
  /** 变体类型 */
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  /** 尺寸 */
  size?: "sm" | "default" | "lg";
  /** 样式类型 */
  tagStyle?: "filled" | "outlined" | "light";
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭回调 */
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** 点击回调 */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 左侧图标 */
  icon?: React.ReactNode;
  /** 自定义颜色 */
  color?: string;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

export const PimaTag: React.FC<PimaTagProps> = ({
  children,
  variant = "primary",
  size = "default",
  tagStyle = "filled",
  closable = false,
  onClose,
  onClick,
  disabled = false,
  icon,
  color,
  className = "",
  style,
}) => {
  const baseClass = "wm-tag";
  
  // 构建类名
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--${size}`,
    `${baseClass}--${tagStyle}`,
    onClick && !disabled ? `${baseClass}--clickable` : "",
    disabled ? `${baseClass}--disabled` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 处理关闭事件
  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!disabled && onClose) {
      onClose(e);
    }
  };

  // 处理点击事件
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  // 自定义颜色样式
  const customStyle = color
    ? {
        ...style,
        backgroundColor: tagStyle === "filled" ? color : tagStyle === "light" ? undefined : "transparent",
        borderColor: tagStyle === "light" ? "transparent" : color,
        color: tagStyle === "filled" ? "#FFFFFF" : color,
      }
    : style;

  return (
    <div
      className={classes}
      onClick={handleClick}
      style={customStyle}
      role={onClick ? "button" : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      onKeyDown={
        onClick && !disabled
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick(e as any);
              }
            }
          : undefined
      }
    >
      {/* 左侧图标 */}
      {icon && <span className={`${baseClass}__icon`}>{icon}</span>}

      {/* 文本内容 */}
      <span className={`${baseClass}__text`}>{children}</span>

      {/* 关闭按钮 */}
      {closable && (
        <button
          className={`${baseClass}__close`}
          onClick={handleClose}
          disabled={disabled}
          aria-label="关闭标签"
          type="button"
          tabIndex={-1}
        >
          <X className={`${baseClass}__close-icon`} />
        </button>
      )}
    </div>
  );
};

PimaTag.displayName = "PimaTag";