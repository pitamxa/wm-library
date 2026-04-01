import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./ui/utils";
import "../styles/loading.css";

export type LoadingSize = "sm" | "default" | "lg";
export type LoadingVariant = "primary" | "secondary" | "white" | "success" | "warning" | "error";

export interface PimaLoadingProps {
  /** Loading indicator size */
  size?: LoadingSize;
  /** Color variant */
  variant?: LoadingVariant;
  /** Optional text to display next to the spinner */
  text?: string;
  /** Orientation of text relative to spinner */
  orientation?: "horizontal" | "vertical";
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export function PimaLoading({
  size = "default",
  variant = "primary",
  text,
  orientation = "horizontal",
  className,
  style,
}: PimaLoadingProps) {
  const containerClassName = cn(
    "wm-loading-container",
    `wm-loading-container--${orientation}`,
    className
  );

  const loadingClassName = cn(
    "wm-loading",
    `wm-loading--${size}`,
    `wm-loading--${variant}`
  );

  return (
    <div className={containerClassName} style={style}>
      <div className={loadingClassName}>
        <Loader2 className="wm-loading__icon" />
      </div>
      {text && <span className="wm-loading__text">{text}</span>}
    </div>
  );
}
