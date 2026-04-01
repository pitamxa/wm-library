import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, Minus, Plus } from "lucide-react";
import { cn } from "./ui/utils";
import "../styles/input-number.css";
import "../styles/form-layout.css";

export interface PimaInputNumberProps {
  /** 当前值 */
  value?: number | null;
  /** 值改变回调 */
  onValueChange?: (value: number | null) => void;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步长 */
  step?: number;
  /** 小数精度（小数位数） */
  precision?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readOnly?: boolean;
  /** 是否显示错误状态 */
  error?: boolean;
  /** 是否显示成功状态 */
  success?: boolean;
  /** 标签 */
  label?: string;
  /** 辅助文本 */
  helperText?: string;
  /** 是否必填 */
  required?: boolean;
  /** 占位符 */
  placeholder?: string;
  /** 前缀（文本或图标） */
  prefix?: React.ReactNode;
  /** 后缀（文本或图标） */
  suffix?: React.ReactNode;
  /** 是否显示步进按钮 */
  controls?: boolean;
  /** 变体样式：default（右侧上下箭头）| dial（左右加减拨轮）| hover（悬浮显示上下箭头） */
  variant?: "default" | "dial" | "hover";
  /** 表单布局 */
  layout?: "vertical" | "horizontal";
  /** 水平布局时标签列宽度 */
  labelWidth?: number | string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 将数值限制在 [min, max] 范围并对齐精度
 */
function clamp(val: number, min: number, max: number, precision?: number): number {
  let v = Math.max(min, Math.min(max, val));
  if (precision !== undefined && precision >= 0) {
    v = parseFloat(v.toFixed(precision));
  }
  return v;
}

export function PimaInputNumber({
  value,
  onValueChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision,
  disabled = false,
  readOnly = false,
  error = false,
  success = false,
  label,
  helperText,
  required = false,
  placeholder,
  prefix,
  suffix,
  controls = true,
  variant = "default",
  layout = "vertical",
  labelWidth,
  className,
}: PimaInputNumberProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputText, setInputText] = useState<string>(() =>
    value != null ? String(value) : ""
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value → inputText when not focused
  useEffect(() => {
    if (!isFocused) {
      setInputText(value != null ? String(value) : "");
    }
  }, [value, isFocused]);

  const getVariant = () => {
    if (error) return "error";
    if (success) return "success";
    return "default";
  };
  const currentVariant = getVariant();
  const isDisabled = disabled || readOnly;

  const canIncrement = value == null || value < max;
  const canDecrement = value == null || value > min;

  const commitValue = useCallback(
    (raw: string) => {
      if (raw === "" || raw === "-") {
        onValueChange?.(null);
        return;
      }
      const parsed = parseFloat(raw);
      if (isNaN(parsed)) {
        // revert
        setInputText(value != null ? String(value) : "");
        return;
      }
      const clamped = clamp(parsed, min, max, precision);
      onValueChange?.(clamped);
      setInputText(String(clamped));
    },
    [min, max, precision, onValueChange, value]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow intermediate typing: digits, minus, dot
    if (/^-?\d*\.?\d*$/.test(raw)) {
      setInputText(raw);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    commitValue(inputText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitValue(inputText);
      inputRef.current?.blur();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleStep(1);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      handleStep(-1);
    }
  };

  const handleStep = (direction: 1 | -1) => {
    if (isDisabled) return;
    const base = value ?? 0;
    const next = clamp(base + step * direction, min, max, precision);
    onValueChange?.(next);
  };

  const isHorizontal = layout === "horizontal";
  const isDial = variant === "dial";
  const isHover = variant === "hover";

  const wrapperClassName = cn(
    "wm-input-number__wrapper",
    "wm-input-number__wrapper--sm",
    {
      "wm-input-number__wrapper--focused": isFocused,
      "wm-input-number__wrapper--disabled": isDisabled,
      "wm-input-number__wrapper--error": currentVariant === "error",
      "wm-input-number__wrapper--success": currentVariant === "success",
      "wm-input-number__wrapper--with-prefix": !!prefix,
      "wm-input-number__wrapper--with-suffix": !!suffix,
      "wm-input-number__wrapper--with-controls": controls && !isDial,
      "wm-input-number__wrapper--dial": isDial,
      "wm-input-number__wrapper--hover-controls": isHover && controls,
    }
  );

  const fieldClassName = cn(
    "wm-input-number__field",
    "wm-input-number__field--sm",
    {
      "wm-input-number__field--disabled": isDisabled,
      "wm-input-number__field--dial": isDial,
    }
  );

  const labelStyle: React.CSSProperties | undefined =
    isHorizontal && labelWidth
      ? { width: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth }
      : undefined;

  /** 共用的 input 元素 */
  const inputElement = (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={inputText}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      readOnly={readOnly}
      placeholder={placeholder}
      className={fieldClassName}
      aria-label={label}
      aria-invalid={currentVariant === "error"}
      aria-required={required}
      aria-valuemin={min !== -Infinity ? min : undefined}
      aria-valuemax={max !== Infinity ? max : undefined}
      aria-valuenow={value ?? undefined}
      role="spinbutton"
    />
  );

  const controlContent = (
    <>
      {isDial ? (
        /* ===== 拨轮模式：[-] [input] [+] ===== */
        <div className={wrapperClassName}>
          <button
            type="button"
            className="wm-input-number__dial-btn wm-input-number__dial-btn--minus"
            onClick={() => handleStep(-1)}
            disabled={isDisabled || !canDecrement}
            tabIndex={-1}
            aria-label="减少"
          >
            <Minus className="wm-input-number__dial-icon" />
          </button>

          {prefix && <div className="wm-input-number__prefix">{prefix}</div>}
          {inputElement}
          {suffix && <div className="wm-input-number__suffix-content">{suffix}</div>}

          <button
            type="button"
            className="wm-input-number__dial-btn wm-input-number__dial-btn--plus"
            onClick={() => handleStep(1)}
            disabled={isDisabled || !canIncrement}
            tabIndex={-1}
            aria-label="增加"
          >
            <Plus className="wm-input-number__dial-icon" />
          </button>
        </div>
      ) : (
        /* ===== 默认模式：[input][▲▼] ===== */
        <div className={wrapperClassName}>
          {prefix && <div className="wm-input-number__prefix">{prefix}</div>}
          {inputElement}
          {suffix && <div className="wm-input-number__suffix-content">{suffix}</div>}

          {controls && (
            <div className="wm-input-number__controls">
              <button
                type="button"
                className="wm-input-number__control-btn wm-input-number__control-btn--up"
                onClick={() => handleStep(1)}
                disabled={isDisabled || !canIncrement}
                tabIndex={-1}
                aria-label="增加"
              >
                <ChevronUp className="wm-input-number__control-icon" />
              </button>
              <button
                type="button"
                className="wm-input-number__control-btn wm-input-number__control-btn--down"
                onClick={() => handleStep(-1)}
                disabled={isDisabled || !canDecrement}
                tabIndex={-1}
                aria-label="减少"
              >
                <ChevronDown className="wm-input-number__control-icon" />
              </button>
            </div>
          )}
        </div>
      )}

      {helperText && (
        <div className="wm-input-number__footer">
          <p
            className={cn(
              "wm-input-number__helper",
              `wm-input-number__helper--${currentVariant}`
            )}
          >
            {helperText}
          </p>
        </div>
      )}
    </>
  );

  return (
    <div
      className={cn(
        "wm-input-number",
        { "wm-input-number--horizontal": isHorizontal },
        className
      )}
    >
      {label && (
        <label
          className={
            isHorizontal ? "wm-form-label--horizontal" : "wm-input-number__label"
          }
          style={labelStyle}
        >
          {isHorizontal && required && (
            <span className="wm-form-label__required">*</span>
          )}
          {label}
          {!isHorizontal && required && (
            <span className="wm-input-number__label-required">*</span>
          )}
          {isHorizontal && "\uFF1A"}
        </label>
      )}

      {isHorizontal ? (
        <div className="wm-form-body--horizontal">{controlContent}</div>
      ) : (
        controlContent
      )}
    </div>
  );
}