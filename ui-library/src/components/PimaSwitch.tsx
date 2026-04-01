import * as Switch from "@radix-ui/react-switch";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "./ui/utils";
import type { PimaSwitchProps } from "../types/pima-components";
import "../styles/switch.css";

export type { PimaSwitchProps };

export function PimaSwitch({
  checked = false,
  onCheckedChange,
  disabled = false,
  loading = false,
  error = false,
  success = false,
  variant = "default",
  size = "default",
  checkedText,
  uncheckedText,
  helperText,
  label,
  required = false,
  className,
}: PimaSwitchProps) {
  const getVariant = () => {
    if (error || variant === "error") return "error";
    if (success || variant === "success") return "success";
    return "default";
  };

  const currentVariant = getVariant();
  const isDisabled = disabled || loading;

  const rootClassName = cn(
    "wm-switch",
    `wm-switch--${size}`,
    {
      "wm-switch--disabled": isDisabled,
      "wm-switch--error": currentVariant === "error",
      "wm-switch--success": currentVariant === "success",
    },
    className
  );

  const switchClassName = cn(
    "wm-switch__control",
    `wm-switch__control--${size}`,
    {
      "wm-switch__control--checked": checked,
      "wm-switch__control--disabled": isDisabled,
      "wm-switch__control--error": currentVariant === "error",
      "wm-switch__control--success": currentVariant === "success",
    }
  );

  const thumbClassName = cn(
    "wm-switch__thumb",
    `wm-switch__thumb--${size}`,
    {
      "wm-switch__thumb--checked": checked,
    }
  );

  const iconClassName = cn(
    "wm-switch__icon",
    `wm-switch__icon--${size}`
  );

  return (
    <div className={rootClassName}>
      <div className="wm-switch__wrapper">
        <div className="wm-switch__container">
          {label && (
            <label className="wm-switch__label">
              {label}
              {required && <span className="wm-switch__label-required">*</span>}
            </label>
          )}

          <div className="wm-switch__control-wrapper">
            <Switch.Root
              checked={checked}
              onCheckedChange={onCheckedChange}
              disabled={isDisabled}
              className={switchClassName}
              aria-label={label}
            >
              <Switch.Thumb className={thumbClassName}>
                {loading && (
                  <Loader2 className={cn(iconClassName, "wm-switch__icon--loading")} />
                )}
              </Switch.Thumb>
            </Switch.Root>

            {!loading && currentVariant === "error" && (
              <AlertCircle className={cn(iconClassName, "wm-switch__icon--error")} />
            )}
            {!loading && currentVariant === "success" && (
              <CheckCircle2 className={cn(iconClassName, "wm-switch__icon--success")} />
            )}
          </div>
        </div>
      </div>

      {helperText && (
        <p
          className={cn(
            "wm-switch__helper",
            `wm-switch__helper--${currentVariant}`
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
