import React, { forwardRef, useState } from 'react';
import { X, Search } from 'lucide-react';
import { cn } from './ui/utils';
import "../styles/search.css";

export interface PimaSearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Callback triggered when search is executed (Enter key or button click) */
  onSearch?: (value: string) => void;
  /** Callback triggered when clear button is clicked */
  onClear?: () => void;
  /** Whether to show the clear button when input has value */
  showClearButton?: boolean;
  /** Visual status of the input */
  status?: 'default' | 'focus' | 'error' | 'disabled';
  /** Error message to display below the input */
  error?: string;
  /** Label text displayed above the input */
  label?: string;
  /** Size variant of the search input */
  size?: 'sm' | 'default' | 'lg';
  /** Custom class name */
  className?: string;
}

export const PimaSearch = forwardRef<HTMLInputElement, PimaSearchProps>(
  ({ 
    onSearch, 
    onClear, 
    showClearButton = true, 
    status = 'default',
    size = 'default',
    error,
    label,
    className = '',
    placeholder = '\u8bf7\u8f93\u5165\u5173\u952e\u5b57',
    id,
    value,
    defaultValue,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    
    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value) : internalValue;
    
    // Generate unique ID for accessibility
    const inputId = id || `search-input-${Math.random().toString(36).substr(2, 9)}`;
    
    // Determine disabled state
    const isDisabled = props.disabled || status === 'disabled';

    const showClear = showClearButton && currentValue.length > 0 && !isDisabled && isHovered;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      props.onChange?.(e);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent triggering parent clicks if any
      
      // Create a synthetic event
      const event = {
        ...e,
        target: { ...e.target, value: '' },
        currentTarget: { ...e.currentTarget, value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      if (!isControlled) {
        setInternalValue('');
      }
      
      // We need to manually call onChange with empty value if the user expects it
      // But creating a true ChangeEvent is hard. 
      // Usually onClear is enough for logic, but if parent depends on onChange:
      if (props.onChange) {
        // This is a bit hacky but common for uncontrolled inputs clearing
        // Ideally, onClear should be used by parent to reset state if controlled.
      }
      
      onClear?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(currentValue);
      }
      // Support ESC to clear
      if (e.key === 'Escape' && currentValue && showClearButton) {
        if (!isControlled) setInternalValue('');
        onClear?.();
      }
      props.onKeyDown?.(e);
    };

    const handleSearchClick = () => {
      if (onSearch && !isDisabled) {
        onSearch(currentValue);
      }
    };

    const clearButtonElement = (
      <button
        type="button"
        onClick={handleClear}
        className="wm-search__clear-btn"
        aria-label={'\u6e05\u9664'}
      >
        <X className="wm-search__clear-icon" />
      </button>
    );

    const searchButtonElement = (
      <button
        type="button"
        onClick={handleSearchClick}
        disabled={isDisabled}
        className="wm-search__button"
        aria-label={'\u641c\u7d22'}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        <div className={cn("wm-search__button-bg", {
          // Additional dynamic classes if needed
        })} />
        <Search className="wm-search__search-icon" size={15} />
      </button>
    );

    return (
        <div className={cn("wm-search", className)}>
          {label && (
            <label htmlFor={inputId} className="wm-search__label">
              {label}
            </label>
          )}
          
          <div 
            className={cn(
              "wm-search__container",
              `wm-search__container--${size}`,
              {
                "wm-search__container--focus": isFocused || status === 'focus',
                "wm-search__container--error": status === 'error' || error,
                "wm-search__container--disabled": isDisabled,
              }
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="search"
          >
            <div className="wm-search__content">
              <div className="wm-search__input-wrapper">
                <input
                  ref={ref}
                  id={inputId}
                  type="text"
                  value={currentValue}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                  }}
                  onBlur={(e) => {
                    setIsFocused(false);
                    props.onBlur?.(e);
                  }}
                  placeholder={placeholder}
                  className="wm-search__input"
                  disabled={isDisabled}
                  aria-invalid={!!(status === 'error' || error)}
                  aria-describedby={error ? `${inputId}-error` : undefined}
                  {...props}
                />
                
                {showClear && clearButtonElement}
              </div>
            </div>

            <div className="wm-search__button-wrapper">
              {searchButtonElement}
            </div>
          </div>
          
          {error && (
            <p 
              id={`${inputId}-error`}
              className="wm-search__error-msg"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
    );
  }
);

PimaSearch.displayName = 'PimaSearch';
