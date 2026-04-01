import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { cn } from "./ui/utils";
import type { PimaInputProps } from "../types/pima-components";
import "../styles/input.css";
import "../styles/form-layout.css";

export type { PimaInputProps };

export function PimaInput({
  type = "text",
  value = "",
  onValueChange,
  disabled = false,
  error = false,
  success = false,
  variant = "default",
  size = "sm",
  label,
  helperText,
  required = false,
  placeholder,
  prefix,
  suffix,
  maxLength,
  showCount = false,
  readOnly = false,
  clearable = false,
  onClear,
  layout = "vertical",
  labelWidth,
  className,
}: PimaInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getVariant = () => {
    if (error || variant === "error") return "error";
    if (success || variant === "success") return "success";
    return "default";
  };

  const currentVariant = getVariant();
  const isDisabled = disabled || readOnly;
  const isPassword = type === "password";
  const currentType = isPassword && showPassword ? "text" : type;

  const showClear = !!value && value.length > 0 && !isDisabled && isHovered;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onValueChange) {
      onValueChange("");
    }
    onClear?.();
  };

  const isHorizontal = layout === "horizontal";

  const rootClassName = cn(
    "wm-input",
    `wm-input--${size}`,
    {
      "wm-input--disabled": isDisabled,
      "wm-input--error": currentVariant === "error",
      "wm-input--success": currentVariant === "success",
      "wm-input--focused": isFocused,
      "wm-input--horizontal": isHorizontal,
    },
    className
  );

  const inputWrapperClassName = cn(
    "wm-input__wrapper",
    `wm-input__wrapper--${size}`,
    {
      "wm-input__wrapper--disabled": isDisabled,
      "wm-input__wrapper--error": currentVariant === "error",
      "wm-input__wrapper--success": currentVariant === "success",
      "wm-input__wrapper--focused": isFocused,
      "wm-input__wrapper--with-prefix": prefix,
      "wm-input__wrapper--with-suffix": suffix || isPassword || clearable,
    }
  );

  const inputClassName = cn(
    "wm-input__field",
    `wm-input__field--${size}`,
    {
      "wm-input__field--disabled": isDisabled,
    }
  );

  const iconClassName = cn(
    "wm-input__icon",
    `wm-input__icon--${size}`
  );

  const currentLength = value.length;
  const showCounter = showCount || maxLength;

  const labelStyle: React.CSSProperties | undefined =
    isHorizontal && labelWidth
      ? { width: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth }
      : undefined;

  // Shared control + footer content
  const controlContent = (
    <>
      <div
        className={inputWrapperClassName}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {prefix && (
          <div className="wm-input__prefix">
            {prefix}
          </div>
        )}

        <input
          type={currentType}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isDisabled}
          readOnly={readOnly}
          placeholder={placeholder}
          maxLength={maxLength}
          className={inputClassName}
          aria-label={label}
          aria-invalid={currentVariant === "error"}
          aria-required={required}
        />

        <div className="wm-input__suffix">
          {showClear && (
            <button
              type="button"
              className="wm-input__clear-btn"
              onClick={handleClear}
              aria-label={"\u6E05\u9664"}
              tabIndex={-1}
            >
              <X className="wm-input__clear-icon" />
            </button>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="wm-input__password-toggle"
              tabIndex={-1}
              aria-label={showPassword ? "\u9690\u85CF\u5BC6\u7801" : "\u663E\u793A\u5BC6\u7801"}
            >
              {showPassword ? (
                <EyeOff className={iconClassName} />
              ) : (
                <Eye className={iconClassName} />
              )}
            </button>
          )}

          {suffix && (
            <div className="wm-input__suffix-content">
              {suffix}
            </div>
          )}
        </div>
      </div>

      {(helperText || showCounter) && (
        <div className="wm-input__footer">
          {helperText && (
            <p
              className={cn(
                "wm-input__helper",
                `wm-input__helper--${currentVariant}`
              )}
            >
              {helperText}
            </p>
          )}

          {showCounter && (
            <span
              className={cn(
                "wm-input__counter",
                {
                  "wm-input__counter--error": maxLength && currentLength > maxLength,
                  "wm-input__counter--warning": maxLength && currentLength > maxLength * 0.9,
                }
              )}
            >
              {maxLength ? (
                <>
                  <span className="wm-input__counter-current">{currentLength}</span>/{maxLength}
                </>
              ) : (
                <span className="wm-input__counter-current">{currentLength}</span>
              )}
            </span>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className={rootClassName}>
      {label && (
        <label
          className={isHorizontal ? "wm-form-label--horizontal" : "wm-input__label"}
          style={labelStyle}
        >
          {isHorizontal && required && <span className="wm-form-label__required">*</span>}
          {label}
          {!isHorizontal && required && <span className="wm-input__label-required">*</span>}
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
