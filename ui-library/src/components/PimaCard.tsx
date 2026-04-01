import { Loader2 } from "lucide-react";
import { cn } from "./ui/utils";
import type { PimaCardProps } from "../types/pima-components";
import "../styles/card.css";

export type { PimaCardProps };

/**
 * PimaCard 组件
 * 
 * 功能完备的卡片组件，支持：
 * - 三种变体：default、bordered、elevated
 * - 三种尺寸：sm、default、lg
 * - 完整的交互状态：hover、active、disabled
 * - 加载和验证状态
 * - 可选的header、footer区域
 * - 完全使用 design tokens，支持主题切换
 * - BEM 命名规范
 * - 完整的键盘导航和无障碍访问支持
 * 
 * @example
 * ```tsx
 * <PimaCard 
 *   title="卡片标题" 
 *   extra={<Button>操作</Button>}
 *   footer={<p>底部信息</p>}
 *   hoverable
 * >
 *   卡片内容
 * </PimaCard>
 * ```
 */
export function PimaCard({
  title,
  description,
  extra,
  children,
  footer,
  variant = "default",
  size = "default",
  hoverable = false,
  clickable = false,
  onClick,
  disabled = false,
  loading = false,
  error = false,
  success = false,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
}: PimaCardProps) {
  const isInteractive = clickable || !!onClick;

  // 根元素类名
  const rootClassName = cn(
    "wm-card",
    `wm-card--${variant}`,
    `wm-card--${size}`,
    {
      "wm-card--hoverable": hoverable && !disabled,
      "wm-card--clickable": isInteractive && !disabled,
      "wm-card--disabled": disabled,
      "wm-card--loading": loading,
      "wm-card--error": error,
      "wm-card--success": success,
    },
    className
  );

  // Header类名
  const headerCls = cn(
    "wm-card__header",
    `wm-card__header--${size}`,
    headerClassName
  );

  // Body类名
  const bodyCls = cn(
    "wm-card__body",
    `wm-card__body--${size}`,
    {
      "wm-card__body--loading": loading,
    },
    bodyClassName
  );

  // Footer类名
  const footerCls = cn(
    "wm-card__footer",
    `wm-card__footer--${size}`,
    footerClassName
  );

  // 处理点击事件
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  // 处理键盘事件（无障碍）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || loading) return;
    if ((e.key === "Enter" || e.key === " ") && isInteractive) {
      e.preventDefault();
      onClick?.(e as any);
    }
  };

  return (
    <div
      className={rootClassName}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      aria-busy={loading}
    >
      {/* Header区域 */}
      {(title || description || extra) && (
        <div className={headerCls}>
          {(title || description) && (
            <div className="wm-card__header-content">
              {title && (
                <div className="wm-card__title">
                  {title}
                </div>
              )}
              {description && (
                <div className="wm-card__description">
                  {description}
                </div>
              )}
            </div>
          )}
          {extra && (
            <div className="wm-card__extra">
              {extra}
            </div>
          )}
        </div>
      )}

      {/* Body区域 */}
      <div className={bodyCls}>
        {loading ? (
          <div className="wm-card__loading">
            <Loader2 className="wm-card__loading-icon" />
            <span className="wm-card__loading-text">加载中...</span>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Footer区域 */}
      {footer && !loading && (
        <div className={footerCls}>
          {footer}
        </div>
      )}
    </div>
  );
}
