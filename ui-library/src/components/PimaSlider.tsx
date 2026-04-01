import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/slider.css';
import { PimaInputNumber } from './PimaInputNumber';

export interface SliderMark {
  value: number;
  label?: string | React.ReactNode;
}

export interface PimaSliderProps {
  /** 当前值 (单滑块) */
  value?: number;
  /** 默认值 (单滑块) */
  defaultValue?: number;
  /** 值变化回调 */
  onChange?: (value: number) => void;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步长 */
  step?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 标记点 */
  marks?: Record<number, string | SliderMark> | SliderMark[];
  /** 是否显示提示 */
  tooltip?: boolean;
  /** 样式类名 */
  className?: string;
}

export interface PimaRangeSliderProps {
  /** 当前值 (范围滑块) */
  value?: [number, number];
  /** 默认值 (范围滑块) */
  defaultValue?: [number, number];
  /** 值变化回调 */
  onChange?: (value: [number, number]) => void;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步长 */
  step?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 标记点 */
  marks?: Record<number, string | SliderMark> | SliderMark[];
  /** 是否显示提示 */
  tooltip?: boolean;
  /** 是否允许范围重叠 */
  allowCross?: boolean;
  /** 样式类名 */
  className?: string;
}

export interface PimaSliderWithInputProps {
  /** 当前值 */
  value?: number;
  /** 默认值 */
  defaultValue?: number;
  /** 值变化回调 */
  onChange?: (value: number) => void;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步长 */
  step?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 样式类名 */
  className?: string;
}

/**
 * 单滑块组件
 */
export const PimaSlider: React.FC<PimaSliderProps> = ({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  marks,
  tooltip = true,
  className = '',
}) => {
  const [value, setValue] = useState(controlledValue ?? defaultValue);
  const [dragging, setDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const normalizeValue = useCallback(
    (val: number) => {
      const normalized = Math.min(max, Math.max(min, val));
      if (step > 0) {
        const steps = Math.round((normalized - min) / step);
        return Math.min(max, min + steps * step);
      }
      return normalized;
    },
    [min, max, step]
  );

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!railRef.current) return value;
      const rect = railRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percent * (max - min);
      return normalizeValue(rawValue);
    },
    [min, max, value, normalizeValue]
  );

  const updateValue = useCallback(
    (newValue: number) => {
      setValue(newValue);
      onChange?.(newValue);
    },
    [onChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      isDraggingRef.current = true;
      setDragging(true);
      setShowTooltip(true);
      const newValue = getValueFromPosition(e.clientX);
      updateValue(newValue);
    },
    [disabled, getValueFromPosition, updateValue]
  );

  useEffect(() => {
    if (!isDraggingRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const newValue = getValueFromPosition(e.clientX);
      updateValue(newValue);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setDragging(false);
      setShowTooltip(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, getValueFromPosition, updateValue]);

  const percentage = ((value - min) / (max - min)) * 100;

  const processedMarks: SliderMark[] = React.useMemo(() => {
    if (!marks) return [];
    if (Array.isArray(marks)) return marks;
    return Object.entries(marks).map(([key, val]) => {
      if (typeof val === 'string') {
        return { value: Number(key), label: val };
      }
      return { value: Number(key), ...val };
    });
  }, [marks]);

  return (
    <div className={`pima-slider ${disabled ? 'pima-slider--disabled' : ''} ${className}`}>
      <div
        ref={railRef}
        className="pima-slider__rail"
        onMouseDown={handleMouseDown}
      >
        <div className="pima-slider__track" style={{ width: `${percentage}%` }} />
        <div
          className={`pima-slider__handle ${dragging ? 'pima-slider__handle--dragging' : ''}`}
          style={{ left: `${percentage}%` }}
          onMouseEnter={() => !disabled && setShowTooltip(true)}
          onMouseLeave={() => !dragging && setShowTooltip(false)}
        >
          {tooltip && showTooltip && (
            <div className="pima-slider__tooltip">
              {value}
            </div>
          )}
        </div>
      </div>
      {processedMarks.length > 0 && (
        <div className="pima-slider__marks">
          {processedMarks.map((mark) => {
            const markPercent = ((mark.value - min) / (max - min)) * 100;
            return (
              <div
                key={mark.value}
                className="pima-slider__mark"
                style={{ left: `${markPercent}%` }}
              >
                <span className="pima-slider__mark-dot" />
                {mark.label && (
                  <span className="pima-slider__mark-label">{mark.label}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * 范围滑块组件
 */
export const PimaRangeSlider: React.FC<PimaRangeSliderProps> = ({
  value: controlledValue,
  defaultValue = [0, 100],
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  marks,
  tooltip = true,
  allowCross = false,
  className = '',
}) => {
  const [value, setValue] = useState<[number, number]>(controlledValue ?? defaultValue);
  const [dragging, setDragging] = useState<'start' | 'end' | null>(null);
  const [showTooltip, setShowTooltip] = useState<'start' | 'end' | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<'start' | 'end' | null>(null);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const normalizeValue = useCallback(
    (val: number) => {
      const normalized = Math.min(max, Math.max(min, val));
      if (step > 0) {
        const steps = Math.round((normalized - min) / step);
        return Math.min(max, min + steps * step);
      }
      return normalized;
    },
    [min, max, step]
  );

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!railRef.current) return min;
      const rect = railRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percent * (max - min);
      return normalizeValue(rawValue);
    },
    [min, max, normalizeValue]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handle: 'start' | 'end') => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = handle;
      setDragging(handle);
      setShowTooltip(handle);
    },
    [disabled]
  );

  const handleRailClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || isDraggingRef.current) return;
      const clickValue = getValueFromPosition(e.clientX);
      const [start, end] = value;
      const distToStart = Math.abs(clickValue - start);
      const distToEnd = Math.abs(clickValue - end);
      
      let newValue: [number, number];
      if (distToStart < distToEnd) {
        newValue = allowCross
          ? [clickValue, end]
          : [Math.min(clickValue, end), end];
      } else {
        newValue = allowCross
          ? [start, clickValue]
          : [start, Math.max(clickValue, start)];
      }
      setValue(newValue);
      onChange?.(newValue);
    },
    [disabled, getValueFromPosition, value, onChange, allowCross]
  );

  useEffect(() => {
    if (!isDraggingRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const newVal = getValueFromPosition(e.clientX);
      const [start, end] = value;

      let newValue: [number, number];
      if (isDraggingRef.current === 'start') {
        newValue = allowCross
          ? [newVal, end]
          : [Math.min(newVal, end), end];
      } else {
        newValue = allowCross
          ? [start, newVal]
          : [start, Math.max(newVal, start)];
      }
      setValue(newValue);
      onChange?.(newValue);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = null;
      setDragging(null);
      setShowTooltip(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, getValueFromPosition, value, onChange, allowCross]);

  const startPercent = ((value[0] - min) / (max - min)) * 100;
  const endPercent = ((value[1] - min) / (max - min)) * 100;

  const processedMarks: SliderMark[] = React.useMemo(() => {
    if (!marks) return [];
    if (Array.isArray(marks)) return marks;
    return Object.entries(marks).map(([key, val]) => {
      if (typeof val === 'string') {
        return { value: Number(key), label: val };
      }
      return { value: Number(key), ...val };
    });
  }, [marks]);

  return (
    <div className={`pima-slider pima-slider--range ${disabled ? 'pima-slider--disabled' : ''} ${className}`}>
      <div
        ref={railRef}
        className="pima-slider__rail"
        onMouseDown={handleRailClick}
      >
        <div
          className="pima-slider__track"
          style={{
            left: `${startPercent}%`,
            width: `${endPercent - startPercent}%`,
          }}
        />
        <div
          className={`pima-slider__handle ${dragging === 'start' ? 'pima-slider__handle--dragging' : ''}`}
          style={{ left: `${startPercent}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'start')}
          onMouseEnter={() => !disabled && setShowTooltip('start')}
          onMouseLeave={() => dragging !== 'start' && setShowTooltip(null)}
        >
          {tooltip && showTooltip === 'start' && (
            <div className="pima-slider__tooltip">
              {value[0]}
            </div>
          )}
        </div>
        <div
          className={`pima-slider__handle ${dragging === 'end' ? 'pima-slider__handle--dragging' : ''}`}
          style={{ left: `${endPercent}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'end')}
          onMouseEnter={() => !disabled && setShowTooltip('end')}
          onMouseLeave={() => dragging !== 'end' && setShowTooltip(null)}
        >
          {tooltip && showTooltip === 'end' && (
            <div className="pima-slider__tooltip">
              {value[1]}
            </div>
          )}
        </div>
      </div>
      {processedMarks.length > 0 && (
        <div className="pima-slider__marks">
          {processedMarks.map((mark) => {
            const markPercent = ((mark.value - min) / (max - min)) * 100;
            return (
              <div
                key={mark.value}
                className="pima-slider__mark"
                style={{ left: `${markPercent}%` }}
              >
                <span className="pima-slider__mark-dot" />
                {mark.label && (
                  <span className="pima-slider__mark-label">{mark.label}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

PimaSlider.displayName = 'PimaSlider';
PimaRangeSlider.displayName = 'PimaRangeSlider';

/**
 * 带数字输入框的滑块组件 (参考 Ant Design)
 */
export const PimaSliderWithInput: React.FC<PimaSliderWithInputProps> = ({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className = '',
}) => {
  const [value, setValue] = useState(controlledValue ?? defaultValue);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const handleSliderChange = (val: number) => {
    setValue(val);
    onChange?.(val);
  };

  const handleInputChange = (val: number | null) => {
    if (val === null) return;
    // snap to step
    const clamped = Math.min(max, Math.max(min, val));
    const steps = Math.round((clamped - min) / step);
    const snapped = Math.min(max, min + steps * step);
    setValue(snapped);
    onChange?.(snapped);
  };

  return (
    <div className={`pima-slider-with-input ${disabled ? 'pima-slider-with-input--disabled' : ''} ${className}`}>
      <div className="pima-slider-with-input__slider">
        <PimaSlider
          value={value}
          onChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
      </div>
      <div className="pima-slider-with-input__input-number">
        <PimaInputNumber
          value={value}
          onValueChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          controls={true}
          variant="hover"
        />
      </div>
    </div>
  );
};

PimaSliderWithInput.displayName = 'PimaSliderWithInput';