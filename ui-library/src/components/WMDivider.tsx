import React from 'react';
import '../styles/divider.css';

export interface WMDividerProps {
  /**
   * 分割线方向
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * 分割线上的文字内容
   */
  children?: React.ReactNode;
  
  /**
   * 文字位置（仅当有文字时生效）
   * @default 'center'
   */
  textPosition?: 'left' | 'center' | 'right';
  
  /**
   * 分割线样式
   * @default 'solid'
   */
  variant?: 'solid' | 'dashed';
  
  /**
   * 分割线粗细
   * @default 'normal'
   */
  thickness?: 'normal' | 'thick';
  
  /**
   * 上下间距（horizontal）或左右间距（vertical）
   * @default 'md' (8px)
   */
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * 自定义样式类名
   */
  className?: string;
  
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
}

export const WMDivider: React.FC<WMDividerProps> = ({
  orientation = 'horizontal',
  children,
  textPosition = 'center',
  variant = 'solid',
  thickness = 'normal',
  spacing = 'md',
  className = '',
  style,
}) => {
  const hasText = Boolean(children);
  
  const dividerClass = [
    'wm-divider',
    `wm-divider--${orientation}`,
    variant === 'dashed' && 'wm-divider--dashed',
    thickness === 'thick' && 'wm-divider--thick',
    `wm-divider--spacing-${spacing}`,
    hasText && `wm-divider--with-text-${textPosition}`,
    className,
  ].filter(Boolean).join(' ');

  if (hasText && orientation === 'horizontal') {
    return (
      <div className={dividerClass} style={style} role="separator">
        <div className="wm-divider__line" />
        <span className="wm-divider__text">{children}</span>
        <div className="wm-divider__line" />
      </div>
    );
  }

  return (
    <div className={dividerClass} style={style} role="separator">
      <div className="wm-divider__line" />
    </div>
  );
};

export default WMDivider;
