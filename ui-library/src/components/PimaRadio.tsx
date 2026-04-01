import * as RadioGroup from "@radix-ui/react-radio-group";
import { cn } from "./ui/utils";
import type { PimaRadioOption, PimaRadioProps } from "../types/pima-components";
import "../styles/radio.css";
import "../styles/form-layout.css";

export type { PimaRadioOption, PimaRadioProps };

export function PimaRadio({
  options,
  value,
  onValueChange,
  disabled = false,
  error = false,
  success = false,
  variant = "default",
  size = "default",
  orientation = "vertical",
  radioStyle = "default",
  helperText,
  label,
  required = false,
  layout = "vertical",
  labelWidth,
  className,
  ...props
}: PimaRadioProps & React.HTMLAttributes<HTMLDivElement>) {
  const getVariant = () => {
    if (error || variant === "error") return "error";
    if (success || variant === "success") return "success";
    return "default";
  };

  const currentVariant = getVariant();

  const itemsClassName = cn(
    "wm-radio-group__items",
    `wm-radio-group__items--${orientation}`,
    {
      "wm-radio-group__items--solid": radioStyle === "solid",
    }
  );

  const isHorizontal = layout === "horizontal";
  const labelStyle: React.CSSProperties | undefined =
    isHorizontal && labelWidth
      ? { width: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth }
      : undefined;

  const controlContent = (
    <>
      <RadioGroup.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        className={itemsClassName}
      >
        {options.map((option) => {
          const isChecked = value === option.value;
          const isDisabled = disabled || option.disabled;

          const itemClassName = cn(
            "wm-radio-item",
            `wm-radio-item--${size}`,
            {
              "wm-radio-item--disabled": isDisabled,
              "wm-radio-item--checked": isChecked,
              "wm-radio-item--error": currentVariant === "error",
              "wm-radio-item--success": currentVariant === "success",
              "wm-radio-item--card": radioStyle === "card",
              "wm-radio-item--button": radioStyle === "button",
              "wm-radio-item--solid": radioStyle === "solid",
            }
          );

          const buttonClassName = cn(
            "wm-radio-item__button",
            `wm-radio-item__button--${size}`,
            {
              "wm-radio-item__button--checked": isChecked,
              "wm-radio-item__button--disabled": isDisabled,
              "wm-radio-item__button--error": currentVariant === "error",
              "wm-radio-item__button--success": currentVariant === "success",
            }
          );

          const labelClassName = cn(
            "wm-radio-item__label",
            `wm-radio-item__label--${size}`,
            {
              "wm-radio-item__label--disabled": isDisabled,
            }
          );

          const indicatorClassName = cn(
            "wm-radio-item__indicator",
            `wm-radio-item__indicator--${size}`
          );

          return (
            <RadioGroup.Item
              key={option.value}
              value={option.value}
              disabled={isDisabled}
              className={itemClassName}
            >
              <div className={buttonClassName}>
                <RadioGroup.Indicator className={indicatorClassName} />
              </div>
              <label className={labelClassName}>
                {option.description ? (
                  <div className="wm-radio-item__content">
                    <span>{option.label}</span>
                    <span className="wm-radio-item__description">
                      {option.description}
                    </span>
                  </div>
                ) : (
                  option.label
                )}
              </label>
            </RadioGroup.Item>
          );
        })}
      </RadioGroup.Root>

      {helperText && (
        <p
          className={cn(
            "wm-radio-group__helper",
            `wm-radio-group__helper--${currentVariant}`
          )}
        >
          {helperText}
        </p>
      )}
    </>
  );

  return (
    <div className={cn("wm-radio-group", { "wm-radio-group--horizontal-layout": isHorizontal }, className)} {...props}>
      {label && (
        <label
          className={isHorizontal ? "wm-form-label--horizontal" : "wm-radio-group__label"}
          style={labelStyle}
        >
          {isHorizontal && required && <span className="wm-form-label__required">*</span>}
          {label}
          {!isHorizontal && required && <span className="wm-radio-group__label-required">*</span>}
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
