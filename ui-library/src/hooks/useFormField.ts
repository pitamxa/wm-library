import { useState, useCallback } from "react";
import type { FormFieldState, ValidationRule } from "../types/pima-components";

/**
 * 表单字段 Hook 的返回类型
 */
interface UseFormFieldReturn extends FormFieldState {
  /** 设置字段值 */
  setValue: (value: string | string[]) => void;
  /** 设置错误状态 */
  setError: (error: boolean, message?: string) => void;
  /** 标记字段为已访问 */
  setTouched: (touched: boolean) => void;
  /** 重置字段状态 */
  reset: () => void;
  /** 验证字段 */
  validate: () => boolean;
}

/**
 * 表单字段管理 Hook
 * 
 * @param initialValue - 初始值
 * @param rules - 验证规则
 * 
 * @example
 * ```tsx
 * const field = useFormField("", {
 *   required: { message: "此字段为必填" },
 *   minLength: { value: 3, message: "至少3个字符" }
 * });
 * 
 * <PimaSelector
 *   value={field.value as string}
 *   onValueChange={field.setValue}
 *   error={field.error}
 *   helperText={field.errorMessage}
 * />
 * ```
 */
export function useFormField(
  initialValue: string | string[] = "",
  rules?: ValidationRule
): UseFormFieldReturn {
  const [value, setValueState] = useState<string | string[]>(initialValue);
  const [error, setErrorState] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [touched, setTouched] = useState(false);
  const [dirty, setDirty] = useState(false);

  const setValue = useCallback((newValue: string | string[]) => {
    setValueState(newValue);
    setDirty(true);
  }, []);

  const setError = useCallback((hasError: boolean, message?: string) => {
    setErrorState(hasError);
    setErrorMessage(message);
  }, []);

  const reset = useCallback(() => {
    setValueState(initialValue);
    setErrorState(false);
    setErrorMessage(undefined);
    setTouched(false);
    setDirty(false);
  }, [initialValue]);

  const validate = useCallback((): boolean => {
    if (!rules) return true;

    // 必填验证
    if (rules.required) {
      const isEmpty = Array.isArray(value) 
        ? value.length === 0 
        : !value || value.trim() === "";
      
      if (isEmpty) {
        const message = typeof rules.required === "object" 
          ? rules.required.message 
          : "此字段为必填";
        setError(true, message);
        return false;
      }
    }

    // 最小长度验证
    if (rules.minLength && typeof value === "string") {
      const minLength = typeof rules.minLength === "number" 
        ? rules.minLength 
        : rules.minLength.value;
      
      if (value.length < minLength) {
        const message = typeof rules.minLength === "object" 
          ? rules.minLength.message 
          : `至少需要 ${minLength} 个字符`;
        setError(true, message);
        return false;
      }
    }

    // 最大长度验证
    if (rules.maxLength && typeof value === "string") {
      const maxLength = typeof rules.maxLength === "number" 
        ? rules.maxLength 
        : rules.maxLength.value;
      
      if (value.length > maxLength) {
        const message = typeof rules.maxLength === "object" 
          ? rules.maxLength.message 
          : `最多 ${maxLength} 个字符`;
        setError(true, message);
        return false;
      }
    }

    // 正则表达式验证
    if (rules.pattern && typeof value === "string") {
      const pattern = rules.pattern instanceof RegExp 
        ? rules.pattern 
        : rules.pattern.value;
      
      if (!pattern.test(value)) {
        const message = rules.pattern instanceof RegExp 
          ? "格式不正确" 
          : rules.pattern.message;
        setError(true, message);
        return false;
      }
    }

    // 自定义验证
    if (rules.validate) {
      const result = rules.validate(value);
      if (typeof result === "string") {
        setError(true, result);
        return false;
      }
      if (!result) {
        setError(true, "验证失败");
        return false;
      }
    }

    setError(false);
    return true;
  }, [value, rules, setError]);

  return {
    value,
    error,
    errorMessage,
    touched,
    dirty,
    setValue,
    setError,
    setTouched,
    reset,
    validate,
  };
}
