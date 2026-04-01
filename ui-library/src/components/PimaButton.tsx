import { Loader2 } from "lucide-react";
import { cn } from "./ui/utils";
import type { PimaButtonProps } from "../types/pima-components";
import "../styles/button.css";

export type { PimaButtonProps };

export function PimaButton({
  variant = "primary",
  size = "default",
  disabled = false,
  loading = false,
  block = false,
  icon,
  iconRight,
  children,
  onClick,
  type = "button",
  className,
  style,
  ...props
}: PimaButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const isDisabled = disabled || loading;

  const buttonClassName = cn(
    "wm-button",
    `wm-button--${variant}`,
    `wm-button--${size}`,
    {
      "wm-button--disabled": isDisabled,
      "wm-button--loading": loading,
      "wm-button--block": block,
      "wm-button--icon-only": !children && (icon || iconRight),
    },
    className
  );

  const iconClassName = cn(
    "wm-button__icon",
    `wm-button__icon--${size}`
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={handleClick}
      className={buttonClassName}
      style={style}
      {...Object.fromEntries(Object.entries(props).filter(([k]) => !k.startsWith('_fg')))}
    >
      {loading && (
        <Loader2 className={cn(iconClassName, "wm-button__icon--loading")} />
      )}

      {!loading && icon && (
        <span className={iconClassName}>
          {icon}
        </span>
      )}

      {children && (
        <span className="wm-button__text">
          {children}
        </span>
      )}

      {!loading && iconRight && (
        <span className={iconClassName}>
          {iconRight}
        </span>
      )}
    </button>
  );
}