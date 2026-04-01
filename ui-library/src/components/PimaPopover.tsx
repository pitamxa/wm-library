import React, { useState, useRef, useEffect, useCallback } from "react";
import type { PimaPopoverProps } from "../types/pima-components";
import "../styles/popover.css";

export type { PimaPopoverProps };

export const PimaPopover: React.FC<PimaPopoverProps> = ({
  title,
  content,
  children,
  placement = "top",
  trigger = "hover",
  size = "sm",
  showArrow = true,
  mouseEnterDelay = 100,
  mouseLeaveDelay = 150,
  disabled = false,
  className = "",
  overlayClassName = "",
  zIndex = 1000,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const popoverId = useRef(
    `popover-${Math.random().toString(36).substr(2, 9)}`
  );

  // Calculate popover position
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let top = 0;
    let left = 0;
    const gap = 8;
    const offsetY = -4; // Y轴整体上移4px

    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;

    switch (placement) {
      case "top":
        top = triggerRect.top + scrollY - popoverRect.height - gap + offsetY;
        left = scrollX + triggerCenterX - popoverRect.width / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + scrollY + gap + offsetY;
        left = scrollX + triggerCenterX - popoverRect.width / 2;
        break;
      case "left":
        top = scrollY + triggerCenterY - popoverRect.height / 2 + offsetY;
        left = triggerRect.left + scrollX - popoverRect.width - gap;
        break;
      case "right":
        top = scrollY + triggerCenterY - popoverRect.height / 2 + offsetY;
        left = triggerRect.right + scrollX + gap;
        break;
    }

    setPosition({ top, left });
  }, [placement]);

  // Show popover
  const show = useCallback(() => {
    if (disabled) return;
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    enterTimerRef.current = setTimeout(() => {
      setVisible(true);
    }, mouseEnterDelay);
  }, [disabled, mouseEnterDelay]);

  // Hide popover
  const hide = useCallback(() => {
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, mouseLeaveDelay);
  }, [mouseLeaveDelay]);

  // Toggle (click mode)
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
          popoverRef.current &&
          !popoverRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setVisible(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [trigger, visible]);

  // Trigger props
  const getTriggerProps = () => {
    const props: any = {
      "aria-describedby": visible ? popoverId.current : undefined,
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

  const baseClass = "wm-popover";
  const sizeClass = size !== "default" ? `${baseClass}--${size}` : "";
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
          ref={popoverRef}
          id={popoverId.current}
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
          <div className={`${baseClass}__inner`}>
            {title && <div className={`${baseClass}__title`}>{title}</div>}
            <div className={`${baseClass}__content`}>{content}</div>
          </div>
          {showArrow && <div className={`${baseClass}__arrow`} />}
        </div>
      )}
    </>
  );
};

PimaPopover.displayName = "PimaPopover";