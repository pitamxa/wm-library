import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import '../styles/menu.css';

export interface WMMenuItem {
  /**
   * 菜单项唯一标识
   */
  key: string;
  
  /**
   * 菜单项文本
   */
  label: string;
  
  /**
   * 子菜单项
   */
  children?: WMMenuItem[];
  
  /**
   * 是否禁用
   */
  disabled?: boolean;
  
  /**
   * 自定义图标
   */
  icon?: React.ReactNode;
}

export interface WMMenuProps {
  /**
   * 菜单项数据
   */
  items: WMMenuItem[];
  
  /**
   * 当前选中的菜单项 key
   */
  selectedKey?: string;
  
  /**
   * 默认展开的菜单项 key 数组
   */
  defaultOpenKeys?: string[];
  
  /**
   * 菜单项点击回调
   */
  onSelect?: (key: string, item: WMMenuItem) => void;
  
  /**
   * 紧凑模式
   * @default false
   */
  compact?: boolean;
  
  /**
   * 自定义样式类名
   */
  className?: string;
  
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
}

// 下拉箭头图标
const ChevronIcon: React.FC = () => (
  <ChevronDown
    width={10}
    height={6}
    style={{ color: 'var(--text-quaternary)', strokeWidth: '1.33333px' }}
  />
);

// 展开/收起图标（左右箭头）
const ExpandIcon: React.FC<{ expanded: boolean }> = ({ expanded }) =>
  expanded ? (
    <ChevronLeft
      width={6}
      height={7}
      style={{ color: 'var(--text-quaternary)', strokeWidth: '1.16667px' }}
    />
  ) : (
    <ChevronRight
      width={6}
      height={7}
      style={{ color: 'var(--text-quaternary)', strokeWidth: '1.16667px' }}
    />
  );

interface MenuItemComponentProps {
  item: WMMenuItem;
  level: number;
  selectedKey?: string;
  openKeys: string[];
  onToggle: (key: string) => void;
  onSelect?: (key: string, item: WMMenuItem) => void;
}

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
  item,
  level,
  selectedKey,
  openKeys,
  onToggle,
  onSelect,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = openKeys.includes(item.key);
  const isSelected = selectedKey === item.key;
  const isActive = hasChildren && isExpanded;

  const handleClick = () => {
    if (item.disabled) return;

    if (hasChildren) {
      onToggle(item.key);
    } else {
      onSelect?.(item.key, item);
    }
  };

  const itemClass = [
    'wm-menu-item',
    level === 2 && 'wm-menu-item--level-2',
    level === 3 && 'wm-menu-item--level-3',
    isExpanded && hasChildren && 'wm-menu-item--expanded',
    isActive && 'wm-menu-item--active',
    isSelected && 'wm-menu-item--selected',
    item.disabled && 'wm-menu-item--disabled',
  ].filter(Boolean).join(' ');

  return (
    <>
      <button
        className={itemClass}
        onClick={handleClick}
        disabled={item.disabled}
        type="button"
      >
        <div className="wm-menu-item__content">
          {item.icon && (
            <span className="wm-menu-item__icon-prefix">
              {item.icon}
            </span>
          )}
          <span className="wm-menu-item__text">{item.label}</span>
        </div>
        {hasChildren && level === 1 && (
          <div className="wm-menu-item__icon">
            <ChevronIcon />
          </div>
        )}
        {hasChildren && level === 2 && (
          <div className="wm-menu-item__icon">
            <ChevronIcon />
          </div>
        )}
      </button>
      
      {hasChildren && (
        <div 
          className={[
            'wm-menu-submenu',
            level === 2 && 'wm-menu-submenu--level-3',
            isExpanded && 'wm-menu-submenu--expanded',
          ].filter(Boolean).join(' ')}
        >
          {item.children!.map((child) => (
            <MenuItemComponent
              key={child.key}
              item={child}
              level={level + 1}
              selectedKey={selectedKey}
              openKeys={openKeys}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </>
  );
};

export const WMMenu: React.FC<WMMenuProps> = ({
  items,
  selectedKey,
  defaultOpenKeys = [],
  onSelect,
  compact = false,
  className = '',
  style,
}) => {
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);

  const handleToggle = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  const menuClass = [
    'wm-menu',
    compact && 'wm-menu--compact',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={menuClass} style={style}>
      {items.map((item) => (
        <MenuItemComponent
          key={item.key}
          item={item}
          level={1}
          selectedKey={selectedKey}
          openKeys={openKeys}
          onToggle={handleToggle}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default WMMenu;