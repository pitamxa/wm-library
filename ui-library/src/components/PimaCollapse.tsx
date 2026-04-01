import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from './ui/utils';
import '../styles/collapse.css';

/**
 * \u6298\u53E0\u9762\u677F\u5B50\u9879\u6570\u636E\u63A5\u53E3
 */
export interface CollapseItem {
  /** \u552F\u4E00\u6807\u8BC6 */
  key: string;
  /** \u6807\u9898 */
  title: React.ReactNode;
  /** \u5185\u5BB9 */
  children: React.ReactNode;
  /** \u5DE6\u4FA7\u56FE\u6807 */
  icon?: React.ReactNode;
  /** \u53F3\u4FA7\u989D\u5916\u5185\u5BB9 */
  extra?: React.ReactNode;
  /** \u662F\u5426\u7981\u7528 */
  disabled?: boolean;
}

/**
 * PimaCollapse \u7EC4\u4EF6 Props
 */
export interface PimaCollapseProps {
  /** \u6298\u53E0\u9762\u677F\u5B50\u9879\u6570\u636E */
  items: CollapseItem[];
  /** \u5F53\u524D\u5C55\u5F00\u7684\u9762\u677F key\uFF08\u53D7\u63A7\uFF09 */
  activeKeys?: string[];
  /** \u9ED8\u8BA4\u5C55\u5F00\u7684\u9762\u677F key\uFF08\u975E\u53D7\u63A7\uFF09 */
  defaultActiveKeys?: string[];
  /** \u5C55\u5F00/\u6536\u8D77\u56DE\u8C03 */
  onChange?: (activeKeys: string[]) => void;
  /** \u662F\u5426\u624B\u98CE\u7434\u6A21\u5F0F\uFF08\u6BCF\u6B21\u53EA\u5C55\u5F00\u4E00\u4E2A\uFF09 */
  accordion?: boolean;
  /** \u53D8\u4F53 */
  variant?: 'default' | 'bordered' | 'ghost';
  /** \u5C3A\u5BF8 */
  size?: 'sm' | 'default' | 'lg';
  /** \u7BAD\u5934\u4F4D\u7F6E */
  arrowPosition?: 'right' | 'left';
  /** \u662F\u5426\u5168\u90E8\u7981\u7528 */
  disabled?: boolean;
  /** \u81EA\u5B9A\u4E49\u7C7B\u540D */
  className?: string;
  /** \u81EA\u5B9A\u4E49\u6837\u5F0F */
  style?: React.CSSProperties;
}

/**
 * \u5355\u4E2A\u6298\u53E0\u9762\u677F\u5185\u5BB9\u533A\u57DF\uFF08\u5E26\u52A8\u753B\uFF09
 */
function CollapseContent({
  expanded,
  size,
  children,
}: {
  expanded: boolean;
  size: 'sm' | 'default' | 'lg';
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(expanded ? undefined : 0);

  useEffect(() => {
    if (!innerRef.current) return;

    if (expanded) {
      const innerHeight = innerRef.current.scrollHeight;
      setHeight(innerHeight);
      // After transition, set to auto for dynamic content
      const timer = setTimeout(() => setHeight(undefined), 210);
      return () => clearTimeout(timer);
    } else {
      // First set to current height, then to 0
      const innerHeight = innerRef.current.scrollHeight;
      setHeight(innerHeight);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(0);
        });
      });
    }
  }, [expanded]);

  return (
    <div
      ref={contentRef}
      className="wm-collapse__content"
      role="region"
      style={{
        height: height === undefined ? 'auto' : `${height}px`,
        opacity: expanded ? 1 : 0,
        transition: 'height 200ms ease, opacity 200ms ease',
      }}
      aria-hidden={!expanded}
    >
      <div
        ref={innerRef}
        className={cn(
          'wm-collapse__content-inner',
          `wm-collapse__content-inner--${size}`
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * PimaCollapse \u7EC4\u4EF6
 *
 * \u529F\u80FD\u5B8C\u5907\u7684\u6298\u53E0\u9762\u677F\u7EC4\u4EF6\uFF0C\u652F\u6301\uFF1A
 * - \u4E09\u79CD\u53D8\u4F53\uFF1Adefault\u3001bordered\u3001ghost
 * - \u4E09\u79CD\u5C3A\u5BF8\uFF1Asm\u3001default\u3001lg
 * - \u624B\u98CE\u7434\u6A21\u5F0F\uFF08\u6BCF\u6B21\u53EA\u5C55\u5F00\u4E00\u4E2A\uFF09
 * - \u53D7\u63A7\u4E0E\u975E\u53D7\u63A7\u6A21\u5F0F
 * - \u7981\u7528\u72B6\u6001
 * - \u81EA\u5B9A\u4E49\u56FE\u6807\u3001\u989D\u5916\u5185\u5BB9
 * - \u5C55\u5F00/\u6536\u8D77\u52A8\u753B
 * - \u7BAD\u5934\u5DE6\u53F3\u4F4D\u7F6E\u5207\u6362
 * - \u5B8C\u6574\u7684\u952E\u76D8\u5BFC\u822A\u548C\u65E0\u969C\u788D\u8BBF\u95EE\u652F\u6301
 *
 * @example
 * ```tsx
 * <PimaCollapse
 *   items={[
 *     { key: '1', title: '\u6807\u9898\u4E00', children: <p>\u5185\u5BB9\u4E00</p> },
 *     { key: '2', title: '\u6807\u9898\u4E8C', children: <p>\u5185\u5BB9\u4E8C</p> },
 *   ]}
 *   accordion
 * />
 * ```
 */
export function PimaCollapse({
  items,
  activeKeys: controlledActiveKeys,
  defaultActiveKeys = [],
  onChange,
  accordion = false,
  variant = 'default',
  size = 'default',
  arrowPosition = 'left',
  disabled = false,
  className,
  style,
}: PimaCollapseProps) {
  const isControlled = controlledActiveKeys !== undefined;
  const [internalKeys, setInternalKeys] = useState<string[]>(defaultActiveKeys);
  const activeKeys = isControlled ? controlledActiveKeys : internalKeys;

  const handleToggle = useCallback(
    (key: string) => {
      let newKeys: string[];

      if (accordion) {
        newKeys = activeKeys.includes(key) ? [] : [key];
      } else {
        newKeys = activeKeys.includes(key)
          ? activeKeys.filter((k) => k !== key)
          : [...activeKeys, key];
      }

      if (!isControlled) {
        setInternalKeys(newKeys);
      }
      onChange?.(newKeys);
    },
    [activeKeys, accordion, isControlled, onChange]
  );

  const rootClassName = cn(
    'wm-collapse',
    `wm-collapse--${variant}`,
    className
  );

  return (
    <div className={rootClassName} style={style} role="presentation">
      {items.map((item) => {
        const isExpanded = activeKeys.includes(item.key);
        const isDisabled = disabled || item.disabled;
        const triggerId = `wm-collapse-trigger-${item.key}`;
        const contentId = `wm-collapse-content-${item.key}`;

        return (
          <div
            key={item.key}
            className={cn('wm-collapse__item', {
              'wm-collapse__item--disabled': isDisabled,
            })}
          >
            {/* Trigger */}
            <button
              id={triggerId}
              type="button"
              className={cn(
                'wm-collapse__trigger',
                `wm-collapse__trigger--${size}`,
                {
                  'wm-collapse__trigger--arrow-left': arrowPosition === 'left',
                }
              )}
              onClick={() => !isDisabled && handleToggle(item.key)}
              disabled={isDisabled}
              aria-expanded={isExpanded}
              aria-controls={contentId}
              aria-disabled={isDisabled}
            >
              <div className="wm-collapse__trigger-content">
                {item.icon && (
                  <span className="wm-collapse__trigger-icon">
                    {item.icon}
                  </span>
                )}
                <span className="wm-collapse__trigger-title">
                  {item.title}
                </span>
              </div>

              {item.extra && (
                <span
                  className="wm-collapse__trigger-extra"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.extra}
                </span>
              )}

              <span
                className={cn('wm-collapse__arrow', {
                  'wm-collapse__arrow--expanded': isExpanded,
                })}
              >
                <ChevronDown />
              </span>
            </button>

            {/* Content */}
            <CollapseContent expanded={isExpanded} size={size}>
              <div id={contentId} role="region" aria-labelledby={triggerId}>
                {item.children}
              </div>
            </CollapseContent>
          </div>
        );
      })}
    </div>
  );
}

export default PimaCollapse;