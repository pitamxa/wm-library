import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './ui/breadcrumb';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from './ui/utils';
import '../styles/breadcrumb.css';

export interface BreadcrumbItemData {
  /** 唯一标识 */
  key: string;
  /** 显示文本 */
  label: string;
  /** 点击回调（最后一项不会触发） */
  onClick?: () => void;
  /** 链接地址（可选） */
  href?: string;
  /** 前缀图标 */
  icon?: React.ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
}

/** @deprecated 请使用 BreadcrumbItemData */
export type BreadcrumbItem = BreadcrumbItemData;

export interface PimaBreadcrumbProps {
  /** 面包屑数据项 */
  items: BreadcrumbItemData[];
  /** 自定义分隔符 */
  separator?: React.ReactNode;
  /** 尺寸 */
  size?: 'sm' | 'default' | 'lg';
  /**
   * 最大显示项数（超出时中间项折叠为省略号）
   * 设为 0 或不设表示全部显示
   */
  maxItems?: number;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/**
 * PimaBreadcrumb — 面包屑导航
 *
 * 内部基于 shadcn/ui Breadcrumb 原语，外层使用 Pima BEM CSS 变量体系覆盖样式。
 * shadcn Breadcrumb 底层为语义化 nav > ol > li 结构，遵循 WAI-ARIA Breadcrumb Pattern。
 */
export const PimaBreadcrumb: React.FC<PimaBreadcrumbProps> = ({
  items,
  separator,
  size = 'default',
  maxItems = 0,
  className = '',
  style,
}) => {
  const [expanded, setExpanded] = useState(false);

  const sizeClass = size !== 'default' ? `pima-breadcrumb--${size}` : '';

  const separatorNode = separator ?? <ChevronRight />;

  const shouldCollapse = maxItems > 0 && items.length > maxItems && !expanded;

  /* ---------- render helpers ---------- */

  const renderSep = (key: string) => (
    <BreadcrumbSeparator
      key={`sep-${key}`}
      className="pima-breadcrumb__separator"
    >
      {separatorNode}
    </BreadcrumbSeparator>
  );

  const renderIcon = (icon?: React.ReactNode) =>
    icon ? <span className="pima-breadcrumb__icon">{icon}</span> : null;

  const renderLink = (item: BreadcrumbItemData) => {
    const disabledClass = item.disabled ? 'pima-breadcrumb__link--disabled' : '';

    if (item.href && !item.disabled) {
      return (
        <BreadcrumbLink
          href={item.href}
          className={cn('pima-breadcrumb__link', disabledClass)}
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            if (item.onClick) {
              e.preventDefault();
              item.onClick();
            }
          }}
        >
          {renderIcon(item.icon)}
          <span>{item.label}</span>
        </BreadcrumbLink>
      );
    }

    // 没有 href 或禁用 → 用 button 包在 BreadcrumbLink(asChild) 里
    return (
      <BreadcrumbLink asChild className={cn('pima-breadcrumb__link', disabledClass)}>
        <button
          type="button"
          onClick={item.disabled ? undefined : item.onClick}
          disabled={item.disabled}
          aria-disabled={item.disabled || undefined}
        >
          {renderIcon(item.icon)}
          <span>{item.label}</span>
        </button>
      </BreadcrumbLink>
    );
  };

  const renderPage = (item: BreadcrumbItemData) => (
    <BreadcrumbPage className="pima-breadcrumb__current">
      {renderIcon(item.icon)}
      <span>{item.label}</span>
    </BreadcrumbPage>
  );

  /* ---------- build elements ---------- */

  const elements: React.ReactNode[] = [];

  if (shouldCollapse) {
    const tail = maxItems - 1;
    const tailItems = items.slice(items.length - tail);

    // 第一项
    const first = items[0];
    elements.push(
      <BreadcrumbItem key={first.key} className="pima-breadcrumb__item">
        {renderLink(first)}
      </BreadcrumbItem>
    );
    elements.push(renderSep('ellipsis-before'));

    // 省略号
    elements.push(
      <BreadcrumbItem key="__ellipsis__" className="pima-breadcrumb__item">
        <button
          type="button"
          className="pima-breadcrumb__ellipsis"
          onClick={() => setExpanded(true)}
          aria-label="展开更多面包屑"
        >
          <MoreHorizontal />
        </button>
      </BreadcrumbItem>
    );

    // 尾部项
    tailItems.forEach((item, idx) => {
      elements.push(renderSep(item.key));
      const isLast = idx === tailItems.length - 1;
      elements.push(
        <BreadcrumbItem key={item.key} className="pima-breadcrumb__item">
          {isLast ? renderPage(item) : renderLink(item)}
        </BreadcrumbItem>
      );
    });
  } else {
    items.forEach((item, idx) => {
      if (idx > 0) {
        elements.push(renderSep(item.key));
      }
      const isLast = idx === items.length - 1;
      elements.push(
        <BreadcrumbItem key={item.key} className="pima-breadcrumb__item">
          {isLast ? renderPage(item) : renderLink(item)}
        </BreadcrumbItem>
      );
    });
  }

  return (
    <Breadcrumb
      className={cn('pima-breadcrumb', sizeClass, className)}
      style={style}
    >
      <BreadcrumbList className="pima-breadcrumb__list">
        {elements}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
