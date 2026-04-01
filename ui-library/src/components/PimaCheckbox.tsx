import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "./ui/utils";
import type { PimaCheckboxOption, PimaCheckboxProps } from "../types/pima-components";
import "../styles/checkbox.css";
import "../styles/form-layout.css";

export type { PimaCheckboxOption, PimaCheckboxProps };

export function PimaCheckbox({
  options,
  value = [],
  onValueChange,
  disabled = false,
  error = false,
  success = false,
  variant = "default",
  size = "default",
  orientation = "vertical",
  checkboxStyle = "default",
  maxSelection,
  minSelection,
  helperText,
  label,
  required = false,
  layout = "vertical",
  labelWidth,
  className,
}: PimaCheckboxProps) {
  const getVariant = () => {
    if (error || variant === "error") return "error";
    if (success || variant === "success") return "success";
    return "default";
  };

  const currentVariant = getVariant();

  const handleCheckedChange = (optionValue: string, checked: boolean) => {
    if (!onValueChange) return;

    let newValue: string[];
    
    if (checked) {
      if (maxSelection && value.length >= maxSelection) {
        return;
      }
      newValue = [...value, optionValue];
    } else {
      if (minSelection && value.length <= minSelection) {
        return;
      }
      newValue = value.filter((v) => v !== optionValue);
    }

    onValueChange(newValue);
  };

  const itemsClassName = cn(
    "wm-checkbox-group__items",
    `wm-checkbox-group__items--${orientation}`
  );

  const allChecked = options.length > 0 && options.every(opt => !opt.disabled && value.includes(opt.value));
  const someChecked = value.length > 0 && value.length < options.filter(opt => !opt.disabled).length;

  const isHorizontal = layout === "horizontal";
  const labelStyle: React.CSSProperties | undefined =
    isHorizontal && labelWidth
      ? { width: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth }
      : undefined;

  const renderItems = () => (
    <div className={itemsClassName}>
      {options.map((option) => {
        const isChecked = value.includes(option.value);
        const isDisabled = disabled || option.disabled;
        const isIndeterminate = false;

        const itemClassName = cn(
          "wm-checkbox-item",
          `wm-checkbox-item--${size}`,
          {
            "wm-checkbox-item--disabled": isDisabled,
            "wm-checkbox-item--checked": isChecked,
            "wm-checkbox-item--error": currentVariant === "error",
            "wm-checkbox-item--success": currentVariant === "success",
          }
        );

        const boxClassName = cn(
          "wm-checkbox-item__box",
          `wm-checkbox-item__box--${size}`,
          {
            "wm-checkbox-item__box--checked": isChecked,
            "wm-checkbox-item__box--disabled": isDisabled,
            "wm-checkbox-item__box--error": currentVariant === "error",
            "wm-checkbox-item__box--success": currentVariant === "success",
            "wm-checkbox-item__box--indeterminate": isIndeterminate,
          }
        );

        const labelClassName = cn(
          "wm-checkbox-item__label",
          `wm-checkbox-item__label--${size}`,
          {
            "wm-checkbox-item__label--disabled": isDisabled,
          }
        );

        const iconClassName = cn(
          "wm-checkbox-item__icon",
          `wm-checkbox-item__icon--${size}`
        );

        return (
          <div key={option.value} className={itemClassName}>
            <Checkbox.Root
              checked={isChecked}
              onCheckedChange={(checked) => 
                handleCheckedChange(option.value, checked === true)
              }
              disabled={isDisabled}
              className={boxClassName}
              id={`checkbox-${option.value}`}
            >
              <Checkbox.Indicator className="wm-checkbox-item__indicator">
                {isIndeterminate ? (
                  <Minus className={iconClassName} />
                ) : (
                  <Check className={iconClassName} />
                )}
              </Checkbox.Indicator>
            </Checkbox.Root>
            
            <label 
              htmlFor={`checkbox-${option.value}`}
              className={labelClassName}
            >
              {option.description ? (
                <div className="wm-checkbox-item__content">
                  <span>{option.label}</span>
                  <span className="wm-checkbox-item__description">
                    {option.description}
                  </span>
                </div>
              ) : (
                option.label
              )}
            </label>
          </div>
        );
      })}
    </div>
  );

  const controlContent = (
    <>
      {renderItems()}

      {helperText && (
        <p
          className={cn(
            "wm-checkbox-group__helper",
            `wm-checkbox-group__helper--${currentVariant}`
          )}
        >
          {helperText}
        </p>
      )}
    </>
  );

  return (
    <div className={cn("wm-checkbox-group", { "wm-checkbox-group--horizontal-layout": isHorizontal }, className)}>
      {label && (
        <label
          className={isHorizontal ? "wm-form-label--horizontal" : "wm-checkbox-group__label"}
          style={labelStyle}
        >
          {isHorizontal && required && <span className="wm-form-label__required">*</span>}
          {label}
          {!isHorizontal && required && <span className="wm-checkbox-group__label-required">*</span>}
          {isHorizontal && "\uFF1A"}
        </label>
      )}

      {isHorizontal ? (
        <div className="wm-form-body--horizontal">
          {controlContent}
        </div>
      ) : (
        controlContent
      )}
    </div>
  );
}
