import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import "../styles/progress.css";

export interface PimaProgressProps {
  /**
   * The current progress value (0-100)
   * @default 0
   */
  value?: number;
  
  /**
   * The size of the progress bar
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * The color variant of the progress bar
   * @default 'primary'
   */
  variant?: 'primary' | 'success';
  
  /**
   * Whether to show the progress text
   * @default false
   */
  showText?: boolean;
  
  /**
   * Custom text format function
   */
  format?: (percent: number) => string;
  
  /**
   * Additional class names
   */
  className?: string;
}

export const PimaProgress: React.FC<PimaProgressProps> = ({
  value = 0,
  size = 'md',
  variant = 'primary',
  showText = false,
  format = (percent) => `${percent}%`,
  className = '',
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  const rootClass = `wm-progress wm-progress--${size} wm-progress--${variant} ${className}`;
  
  return (
    <div className={rootClass}>
      <Progress.Root 
        className="wm-progress__root" 
        value={clampedValue}
        aria-label="Progress"
      >
        <Progress.Indicator
          className="wm-progress__indicator"
          style={{
            transform: `translateX(-${100 - clampedValue}%)`,
          }}
        />
      </Progress.Root>
      {showText && (
        <span className="wm-progress__text" aria-live="polite">
          {format(clampedValue)}
        </span>
      )}
    </div>
  );
};
