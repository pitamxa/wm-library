import React, { useState, useRef, useEffect, useCallback } from "react";
import "../styles/tooltip.css";

export interface PimaTooltipProps {
  /** Tooltip content */
  content: React.ReactNode;
  /** Children element that triggers the tooltip */
  children: React.ReactElement;
  /** Placement of the tooltip */
  placement?: "top" | "bottom" | "left" | "right";
  /** Trigger mode */
  trigger?: "hover" | "click" | "focus";
  /** Size variant */
  size?: "sm" | "default" | "lg";
  /** Whether to show arrow */
  showArrow?: boolean;
  /** Delay before showing (ms) */
  mouseEnterDelay?: number;
  /** Delay before hiding (ms) */
  mouseLeaveDelay?: number;
  /** Whether disabled */
  disabled?: boolean;
  /** Custom class name for tooltip container */
  className?: string;
  /** Custom class name for tooltip content */
  overlayClassName?: string;
  /** z-index of tooltip */
  zIndex?: number;
}

export const PimaTooltip: React.FC<PimaTooltipProps> = ({
  content,
  children,
  placement = "top",
  trigger = "hover",
  size = "default",
  showArrow = true,
  mouseEnterDelay = 100,
  mouseLeaveDelay = 100,
  disabled = false,
  className = "",
  overlayClassName = "",
  zIndex = 1000,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substr(2, 9)}`);

  // Calculate tooltip position
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let top = 0;
    let left = 0;
    const gap = 4; // 统一使用4px间距

    // Calculate center positions
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;

    switch (placement) {
      case "top":
        top = triggerRect.top + scrollY - tooltipRect.height - gap;
        left = scrollX + triggerCenterX - tooltipRect.width / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + scrollY + gap;
        left = scrollX + triggerCenterX - tooltipRect.width / 2;
        break;
      case "left":
        top = scrollY + triggerCenterY - tooltipRect.height / 2;
        left = triggerRect.left + scrollX - tooltipRect.width - gap;
        break;
      case "right":
        top = scrollY + triggerCenterY - tooltipRect.height / 2;
        left = triggerRect.right + scrollX + gap;
        break;
    }

    setPosition({ top, left });
  }, [placement, showArrow]);

  // Show tooltip
  const show = useCallback(() => {
    if (disabled) return;

    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }

    enterTimerRef.current = setTimeout(() => {
      setVisible(true);
    }, mouseEnterDelay);
  }, [disabled, mouseEnterDelay]);

  // Hide tooltip
  const hide = useCallback(() => {
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
    }

    leaveTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, mouseLeaveDelay);
  }, [mouseLeaveDelay]);

  // Toggle tooltip (for click trigger)
  const toggle = useCallback(() => {
    if (disabled) return;
    setVisible((prev) => !prev);
  }, [disabled]);

  // Update position when visible
  useEffect(() => {
    if (visible) {
      calculatePosition();
      window.addEventListener("scroll", calculatePosition, true);
      window.addEventListener("resize", calculatePosition);

      return () => {
        window.removeEventListener("scroll", calculatePosition, true);
        window.removeEventListener("resize", calculatePosition);
      };
    }
  }, [visible, calculatePosition]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  // Click outside handler
  useEffect(() => {
    if (trigger === "click" && visible) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          tooltipRef.current &&
          !tooltipRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setVisible(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [trigger, visible]);

  // Prepare trigger props
  const getTriggerProps = () => {
    const props: any = {
      "aria-describedby": visible ? tooltipId.current : undefined,
    };

    if (trigger === "hover") {
      props.onMouseEnter = show;
      props.onMouseLeave = hide;
    } else if (trigger === "click") {
      props.onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggle();
      };
    } else if (trigger === "focus") {
      props.onFocus = show;
      props.onBlur = hide;
    }

    return props;
  };

  const baseClass = "wm-tooltip";
  const sizeClass = `${baseClass}--${size}`;
  const placementClass = `${baseClass}--${placement}`;
  const arrowClass = showArrow ? `${baseClass}--with-arrow` : "";

  return (
    <>
      <span
        ref={triggerRef}
        className={`${baseClass}-wrapper ${className}`.trim()}
        {...getTriggerProps()}
      >
        {children}
      </span>

      {visible && (
        <div
          ref={tooltipRef}
          id={tooltipId.current}
          className={`${baseClass} ${sizeClass} ${placementClass} ${arrowClass} ${overlayClassName}`.trim()}
          style={{
            position: "absolute",
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex,
          }}
          role="tooltip"
          onMouseEnter={trigger === "hover" ? show : undefined}
          onMouseLeave={trigger === "hover" ? hide : undefined}
        >
          <div className={`${baseClass}__content`}>{content}</div>
          {showArrow && <div className={`${baseClass}__arrow`} />}
        </div>
      )}
    </>
  );
};

PimaTooltip.displayName = "PimaTooltip";