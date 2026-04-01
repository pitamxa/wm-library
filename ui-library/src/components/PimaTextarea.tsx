import { useState, useRef, useEffect } from "react";
import { cn } from "./ui/utils";
import type { PimaTextareaProps } from "../types/pima-components";
import "../styles/textarea.css";
import "../styles/form-layout.css";

export type { PimaTextareaProps };

export function PimaTextarea({
  value = "",
  onValueChange,
  disabled = false,
  error = false,
  success = false,
  variant = "default",
  size = "default",
  label,
  helperText,
  required = false,
  placeholder,
  maxLength,
  showCount = false,
  readOnly = false,
  rows = 4,
  minRows,
  maxRows,
  autoResize = false,
  layout = "vertical",
  labelWidth,
  className,
}: PimaTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const getVariant = () => {
    if (error || variant === "error") return "error";
    if (success || variant === "success") return "success";
    return "default";
  };

  const currentVariant = getVariant();
  const isDisabled = disabled || readOnly;

  // Auto-resize functionality
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";
      
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const minHeight = minRows ? lineHeight * minRows : 0;
      const maxHeight = maxRows ? lineHeight * maxRows : Infinity;
      
      let newHeight = textarea.scrollHeight;
      
      if (minRows && newHeight < minHeight) {
        newHeight = minHeight;
      }
      
      if (maxRows && newHeight > maxHeight) {
        newHeight = maxHeight;
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.overflowY = "hidden";
      }
      
      textarea.style.height = `${newHeight}px`;
    }
  }, [value, autoResize, minRows, maxRows]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  const isHorizontal = layout === "horizontal";

  const rootClassName = cn(
    "wm-textarea",
    `wm-textarea--${size}`,
    {
      "wm-textarea--disabled": isDisabled,
      "wm-textarea--error": currentVariant === "error",
      "wm-textarea--success": currentVariant === "success",
      "wm-textarea--focused": isFocused,
      "wm-textarea--horizontal": isHorizontal,
    },
    className
  );

  const textareaClassName = cn(
    "wm-textarea__input",
    `wm-textarea__input--${size}`,
    {
      "wm-textarea__input--disabled": isDisabled,
      "wm-textarea__input--error": currentVariant === "error",
      "wm-textarea__input--success": currentVariant === "success",
      "wm-textarea__input--auto-resize": autoResize,
    }
  );

  const currentLength = value.length;
  const showCounter = showCount || maxLength;

  const labelStyle: React.CSSProperties | undefined =
    isHorizontal && labelWidth
      ? { width: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth }
      : undefined;

  const controlContent = (
    <>
      <div className="wm-textarea__wrapper">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isDisabled}
          readOnly={readOnly}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={autoResize ? undefined : rows}
          className={cn(textareaClassName, { "wm-textarea__input--has-counter": showCounter })}
          aria-label={label}
          aria-invalid={currentVariant === "error"}
          aria-required={required}
        />

        {showCounter && (
          <span
            className={cn(
              "wm-textarea__counter",
              {
                "wm-textarea__counter--error": maxLength && currentLength > maxLength,
                "wm-textarea__counter--warning": maxLength && currentLength > maxLength * 0.9,
              }
            )}
          >
            {maxLength ? (
              <>
                <span className="wm-textarea__counter-current">{currentLength}</span>/{maxLength}
              </>
            ) : (
              <span className="wm-textarea__counter-current">{currentLength}</span>
            )}
          </span>
        )}
      </div>

      {helperText && (
        <p
          className={cn(
            "wm-textarea__helper",
            `wm-textarea__helper--${currentVariant}`
          )}
        >
          {helperText}
        </p>
      )}
    </>
  );

  return (
    <div className={rootClassName}>
      {label && (
        <label
          className={isHorizontal ? "wm-form-label--horizontal" : "wm-textarea__label"}
          style={labelStyle}
        >
          {isHorizontal && required && <span className="wm-form-label__required">*</span>}
          {label}
          {!isHorizontal && required && <span className="wm-textarea__label-required">*</span>}
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