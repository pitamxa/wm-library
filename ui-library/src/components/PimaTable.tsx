import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2, Inbox, Check, Minus, ChevronRight, ChevronDown, Plus } from 'lucide-react';
import * as Checkbox from "@radix-ui/react-checkbox";
import { PimaPagination, PimaPaginationProps } from './PimaPagination';
import { cn } from "./ui/utils";
import '../styles/table.css';
import '../styles/checkbox.css';

export interface ColumnType<T> {
  title: React.ReactNode;
  dataIndex?: keyof T;
  key?: string;
  width?: number | string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface ExpandableConfig<T> {
  /** 渲染展开行内容 */
  expandedRowRender: (record: T, index: number, expanded: boolean) => React.ReactNode;
  /** 判断行是否可展开，默认全部可展开 */
  rowExpandable?: (record: T) => boolean;
  /** 受控：当前展开的行 key 列表 */
  expandedRowKeys?: React.Key[];
  /** 展开/收起回调 */
  onExpand?: (expanded: boolean, record: T) => void;
  /** 展开/收起回调（keys 变化） */
  onExpandedRowsChange?: (expandedKeys: React.Key[]) => void;
  /** 默认展开的行 key 列表（非受控） */
  defaultExpandedRowKeys?: React.Key[];
}

export interface TreeConfig {
  /** 指定树形结构的 children 字段名，默认 'children' */
  childrenColumnName?: string;
  /** 默认展开的树节点 key 列表 */
  defaultExpandedRowKeys?: React.Key[];
  /** 是否默认展开所有树节点 */
  defaultExpandAll?: boolean;
  /** 缩进宽度（px），默认 24 */
  indentSize?: number;
}

export interface TableProps<T> {
  columns: ColumnType<T>[];
  dataSource: T[];
  rowKey?: string | ((record: T) => string);
  loading?: boolean;
  pagination?: false | PimaPaginationProps;
  rowSelection?: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  };
  size?: 'small' | 'default' | 'large';
  bordered?: boolean;
  striped?: boolean;
  className?: string;
  style?: React.CSSProperties;
  scroll?: { x?: number | string; y?: number | string };
  onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  /** 可展开行配置 */
  expandable?: ExpandableConfig<T>;
  /** 树形数据配置 */
  treeProps?: TreeConfig;
}

function getValue<T>(record: T, dataIndex?: keyof T) {
  if (dataIndex === undefined) return undefined;
  return record[dataIndex];
}

function PimaTableMain<T extends Record<string, any>>({
  columns,
  dataSource,
  rowKey = 'id',
  loading = false,
  pagination = {},
  rowSelection,
  size = 'default',
  bordered = false,
  striped = false,
  className = '',
  style,
  scroll,
  onRow,
  expandable,
  treeProps,
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<ColumnType<T> | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  // Handling internal pagination state if not controlled fully
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ===== Tree data logic =====
  const isTreeMode = !!treeProps;
  const childrenField = treeProps?.childrenColumnName || 'children';
  const indentSize = treeProps?.indentSize ?? 24;

  // Collect all keys for defaultExpandAll
  const getAllTreeKeys = useCallback((data: T[]): React.Key[] => {
    const keys: React.Key[] = [];
    const walk = (items: T[], idx: number) => {
      items.forEach((item, i) => {
        const key = typeof rowKey === 'function' ? rowKey(item) : (item[rowKey as string] || `${idx}-${i}`).toString();
        const children = (item as any)[childrenField] as T[] | undefined;
        if (children && children.length > 0) {
          keys.push(key);
          walk(children, idx + 1);
        }
      });
    };
    walk(data, 0);
    return keys;
  }, [rowKey, childrenField]);

  const [treeExpandedKeys, setTreeExpandedKeys] = useState<React.Key[]>(() => {
    if (treeProps?.defaultExpandAll) return getAllTreeKeys(dataSource);
    return treeProps?.defaultExpandedRowKeys || [];
  });

  interface FlattenedRow {
    record: T;
    depth: number;
    hasChildren: boolean;
    flatIndex: number;
  }

  const flattenTree = useCallback((data: T[], depth: number, expandedKeys: React.Key[]): FlattenedRow[] => {
    const result: FlattenedRow[] = [];
    data.forEach((item, _i) => {
      const key = typeof rowKey === 'function' ? rowKey(item) : (item[rowKey as string] || result.length).toString();
      const children = (item as any)[childrenField] as T[] | undefined;
      const hasChildren = !!(children && children.length > 0);
      result.push({ record: item, depth, hasChildren, flatIndex: result.length });
      if (hasChildren && expandedKeys.includes(key)) {
        const childRows = flattenTree(children!, depth + 1, expandedKeys);
        result.push(...childRows);
      }
    });
    return result;
  }, [rowKey, childrenField]);

  const toggleTreeExpand = useCallback((key: React.Key) => {
    setTreeExpandedKeys(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      }
      return [...prev, key];
    });
  }, []);

  // ===== Tree selection helpers =====
  /** 获取某节点所有后代 key */
  const getDescendantKeys = useCallback((data: T[], targetKey: React.Key, found?: boolean): React.Key[] => {
    const keys: React.Key[] = [];
    const walk = (items: T[], collecting: boolean) => {
      for (const item of items) {
        const k = typeof rowKey === 'function' ? rowKey(item) : (item[rowKey as string] || '').toString();
        const children = (item as any)[childrenField] as T[] | undefined;
        if (collecting) {
          keys.push(k);
          if (children?.length) walk(children, true);
        } else if (k === targetKey) {
          if (children?.length) walk(children, true);
        } else {
          if (children?.length) walk(children, false);
        }
      }
    };
    walk(data, !!found);
    return keys;
  }, [rowKey, childrenField]);

  /** 获取所有叶节点 key（用于整棵树全选判断） */
  const getAllLeafKeys = useCallback((data: T[]): React.Key[] => {
    const keys: React.Key[] = [];
    const walk = (items: T[]) => {
      for (const item of items) {
        const k = typeof rowKey === 'function' ? rowKey(item) : (item[rowKey as string] || '').toString();
        const children = (item as any)[childrenField] as T[] | undefined;
        if (children?.length) {
          keys.push(k);
          walk(children);
        } else {
          keys.push(k);
        }
      }
    };
    walk(data);
    return keys;
  }, [rowKey, childrenField]);

  /** 获取节点的直接子 key 列表（用于判断 indeterminate） */
  const getChildKeys = useCallback((record: T): React.Key[] => {
    const children = (record as any)[childrenField] as T[] | undefined;
    if (!children?.length) return [];
    return children.map(c => typeof rowKey === 'function' ? rowKey(c) : (c[rowKey as string] || '').toString());
  }, [rowKey, childrenField]);

  /** 递归判断节点是否处于半选状态 */
  const isTreeIndeterminate = useCallback((record: T, selectedKeys: React.Key[]): boolean => {
    const children = (record as any)[childrenField] as T[] | undefined;
    if (!children?.length) return false;
    const descKeys = getDescendantKeys(dataSource, typeof rowKey === 'function' ? rowKey(record) : (record[rowKey as string] || '').toString());
    if (descKeys.length === 0) return false;
    const selectedCount = descKeys.filter(k => selectedKeys.includes(k)).length;
    return selectedCount > 0 && selectedCount < descKeys.length;
  }, [childrenField, dataSource, rowKey, getDescendantKeys]);

  /** 递归判断节点是否全选（所有后代都被选中） */
  const isTreeAllChildrenSelected = useCallback((record: T, selectedKeys: React.Key[]): boolean => {
    const children = (record as any)[childrenField] as T[] | undefined;
    if (!children?.length) return selectedKeys.includes(typeof rowKey === 'function' ? rowKey(record) : (record[rowKey as string] || '').toString());
    const descKeys = getDescendantKeys(dataSource, typeof rowKey === 'function' ? rowKey(record) : (record[rowKey as string] || '').toString());
    return descKeys.length > 0 && descKeys.every(k => selectedKeys.includes(k));
  }, [childrenField, dataSource, rowKey, getDescendantKeys]);

  /** 获取从根到目标节点的所有祖先节点（不含自己） */
  const getAncestorKeys = useCallback((data: T[], targetKey: React.Key): React.Key[] => {
    const path: React.Key[] = [];
    const find = (items: T[], ancestors: React.Key[]): boolean => {
      for (const item of items) {
        const k = typeof rowKey === 'function' ? rowKey(item) : (item[rowKey as string] || '').toString();
        const children = (item as any)[childrenField] as T[] | undefined;
        if (k === targetKey) {
          path.push(...ancestors);
          return true;
        }
        if (children?.length) {
          if (find(children, [...ancestors, k])) return true;
        }
      }
      return false;
    };
    find(data, []);
    return path;
  }, [rowKey, childrenField]);

  /** 树形模式下的行选择处理（含级联） */
  const handleTreeSelectRow = useCallback((record: T) => {
    if (!rowSelection) return;
    const key = typeof rowKey === 'function' ? rowKey(record) : (record[rowKey as string] || '').toString();
    const currentKeys = [...rowSelection.selectedRowKeys];
    const isCurrentlySelected = currentKeys.includes(key);

    // 获取该节点的所有后代 key
    const descKeys = getDescendantKeys(dataSource, key);
    const selfAndDescKeys = [key, ...descKeys];

    let newKeys: React.Key[];
    if (isCurrentlySelected) {
      // 取消选中：移除自身及所有后代
      newKeys = currentKeys.filter(k => !selfAndDescKeys.includes(k));
    } else {
      // 选中：添加自身及所有后代
      newKeys = Array.from(new Set([...currentKeys, ...selfAndDescKeys]));
    }

    // 向上更新祖先节点状态
    const ancestors = getAncestorKeys(dataSource, key);
    for (const ancestorKey of [...ancestors].reverse()) {
      // 找到祖先节点，检查其所有后代是否全选
      const ancestorDescKeys = getDescendantKeys(dataSource, ancestorKey);
      const allDescSelected = ancestorDescKeys.every(k => newKeys.includes(k));
      if (allDescSelected) {
        if (!newKeys.includes(ancestorKey)) newKeys.push(ancestorKey);
      } else {
        newKeys = newKeys.filter(k => k !== ancestorKey);
      }
    }

    rowSelection.onChange(newKeys, []);
  }, [rowSelection, rowKey, dataSource, getDescendantKeys, getAncestorKeys]);

  /** 树形模式下的全选处理 */
  const handleTreeSelectAll = useCallback(() => {
    if (!rowSelection) return;
    const allKeys = getAllLeafKeys(dataSource);
    const allSelected = allKeys.every(k => rowSelection.selectedRowKeys.includes(k));
    if (allSelected) {
      rowSelection.onChange([], []);
    } else {
      rowSelection.onChange(allKeys, []);
    }
  }, [rowSelection, dataSource, getAllLeafKeys]);

  // ===== End tree data logic =====

  // Derive effective pagination props
  const effectivePagination = pagination === false ? false : {
    current: currentPage,
    pageSize: pageSize,
    total: dataSource.length,
    ...pagination,
  };

  const handleHeaderClick = (column: ColumnType<T>) => {
    if (!column.sorter) return;

    if (sortColumn?.key === column.key || sortColumn?.dataIndex === column.dataIndex) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') setSortDirection(null);
      else setSortDirection('asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const processedData = useMemo(() => {
    let data = [...dataSource];

    // Sorting
    if (sortColumn && sortDirection && typeof sortColumn.sorter === 'function') {
      data.sort((a, b) => {
        const result = (sortColumn.sorter as Function)(a, b);
        return sortDirection === 'asc' ? result : -result;
      });
    } else if (sortColumn && sortDirection) {
      // Default simple sorter if boolean true provided
      data.sort((a, b) => {
        const valA = getValue(a, sortColumn.dataIndex);
        const valB = getValue(b, sortColumn.dataIndex);
        if (valA === valB) return 0;
        const comparison = valA > valB ? 1 : -1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    // Pagination (Local if no onChange provided to handle it externally)
    if (effectivePagination && !pagination.onChange) { // Simplified check: if external control, user handles data slicing
       const startIndex = (effectivePagination.current! - 1) * effectivePagination.pageSize!;
       const endIndex = startIndex + effectivePagination.pageSize!;
       // If pagination.total is provided, assume server-side and don't slice.
       // If total is default (dataSource.length), then slice.
       if (effectivePagination.total === dataSource.length) {
          data = data.slice(startIndex, endIndex);
       }
    }

    return data;
  }, [dataSource, sortColumn, sortDirection, effectivePagination, pagination.onChange]);

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(record);
    return (record[rowKey as string] || index).toString();
  };

  const isSelected = (record: T, index: number) => {
    if (!rowSelection) return false;
    const key = getRowKey(record, index);
    return rowSelection.selectedRowKeys.includes(key);
  };

  const handleSelectAll = () => {
    if (!rowSelection) return;
    const allKeys = processedData.map((record, index) => getRowKey(record, index));
    const allSelected = allKeys.every(key => rowSelection.selectedRowKeys.includes(key));
    
    if (allSelected) {
      const newSelectedKeys = rowSelection.selectedRowKeys.filter(key => !allKeys.includes(key));
      rowSelection.onChange(newSelectedKeys, []); // Note: selectedRows logic needs full dataset access usually
    } else {
      // Simple union for select all current page
      const newKeys = Array.from(new Set([...rowSelection.selectedRowKeys, ...allKeys]));
      rowSelection.onChange(newKeys, processedData); 
    }
  };

  const handleSelectRow = (record: T, index: number) => {
    if (!rowSelection) return;
    const key = getRowKey(record, index);
    const selected = rowSelection.selectedRowKeys.includes(key);
    let newKeys;
    
    if (selected) {
      newKeys = rowSelection.selectedRowKeys.filter(k => k !== key);
    } else {
      newKeys = [...rowSelection.selectedRowKeys, key];
    }
    
    // Find all selected row objects from original dataSource
    const selectedRows = dataSource.filter((r, i) => newKeys.includes(getRowKey(r, i)));
    rowSelection.onChange(newKeys, selectedRows);
  };

  const allCurrentSelected = rowSelection && processedData.length > 0 && (
    isTreeMode
      ? getAllLeafKeys(processedData).every(k => rowSelection.selectedRowKeys.includes(k))
      : processedData.every((record, index) => isSelected(record, index))
  );
  const someCurrentSelected = rowSelection && (
    isTreeMode
      ? (rowSelection.selectedRowKeys.length > 0 && !allCurrentSelected)
      : (processedData.some((record, index) => isSelected(record, index)) && !allCurrentSelected)
  );

  const sizeClass = size === 'small' ? 'wm-table--sm' : size === 'large' ? 'wm-table--lg' : '';
  const borderClass = bordered ? 'wm-table-container--bordered' : '';
  const stripedClass = striped ? 'wm-table--striped' : '';

  // Expandable logic
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(expandable?.defaultExpandedRowKeys || []);

  // Use controlled expandedRowKeys if provided
  const effectiveExpandedKeys = expandable?.expandedRowKeys ?? expandedKeys;

  const isRowExpandable = useCallback((record: T) => {
    return expandable?.rowExpandable ? expandable.rowExpandable(record) : true;
  }, [expandable?.rowExpandable]);

  const toggleExpand = useCallback((record: T, index: number) => {
    const key = getRowKey(record, index);
    const isExpanded = effectiveExpandedKeys.includes(key);
    const newExpanded = !isExpanded;
    const newKeys = newExpanded
      ? [...effectiveExpandedKeys, key]
      : effectiveExpandedKeys.filter(k => k !== key);

    if (!expandable?.expandedRowKeys) {
      setExpandedKeys(newKeys);
    }
    expandable?.onExpand?.(newExpanded, record);
    expandable?.onExpandedRowsChange?.(newKeys);
  }, [effectiveExpandedKeys, expandable]);

  const isRowExpanded = useCallback((record: T, index: number) => {
    const key = getRowKey(record, index);
    return effectiveExpandedKeys.includes(key);
  }, [effectiveExpandedKeys]);

  // Fixed columns: detect and compute sticky offsets
  const hasFixedColumns = columns.some(col => col.fixed);
  const hasExpandable = !!expandable;

  // Compute extra columns count before user columns (selection + expand)
  const prefixColCount = (rowSelection ? 1 : 0) + (hasExpandable ? 1 : 0);
  const totalColCount = columns.length + prefixColCount;

  // Compute fixed column styles
  const getFixedCellStyle = (col: ColumnType<T>, colIndex: number): React.CSSProperties | undefined => {
    if (!col.fixed) return undefined;
    const style: React.CSSProperties = {
      position: 'sticky',
      zIndex: 1,
    };
    if (col.fixed === 'left') {
      // Calculate left offset: sum of widths of all prefix cols + previous fixed-left cols
      let left = 0;
      // Account for prefix columns (expand + selection)
      if (hasExpandable) left += 48;
      if (rowSelection) left += 48;
      for (let i = 0; i < colIndex; i++) {
        if (columns[i].fixed === 'left') {
          left += typeof columns[i].width === 'number' ? (columns[i].width as number) : 120;
        }
      }
      style.left = left;
    }
    if (col.fixed === 'right') {
      // Calculate right offset: sum of widths of subsequent fixed-right cols
      let right = 0;
      for (let i = colIndex + 1; i < columns.length; i++) {
        if (columns[i].fixed === 'right') {
          right += typeof columns[i].width === 'number' ? (columns[i].width as number) : 120;
        }
      }
      style.right = right;
    }
    return style;
  };

  const getFixedCellClass = (col: ColumnType<T>, colIndex: number): string => {
    if (!col.fixed) return '';
    const classes = [`wm-table__cell--fixed-${col.fixed}`];
    // Add shadow class for last fixed-left or first fixed-right
    if (col.fixed === 'left') {
      const isLast = !columns.slice(colIndex + 1).some(c => c.fixed === 'left');
      if (isLast) classes.push('wm-table__cell--fixed-left-last');
    }
    if (col.fixed === 'right') {
      const isFirst = !columns.slice(0, colIndex).some(c => c.fixed === 'right');
      if (isFirst) classes.push('wm-table__cell--fixed-right-first');
    }
    return classes.join(' ');
  };

  return (
    <div className={cn('wm-table-container', borderClass, { 'wm-table-container--has-fixed': hasFixedColumns }, className)} style={style}>
      <div className="wm-table__scroll-wrapper" style={{ 
        position: 'relative', 
        overflowX: scroll?.x || hasFixedColumns ? 'auto' : 'visible',
        overflowY: scroll?.y ? 'auto' : 'visible',
        maxHeight: scroll?.y
      }}>
        {loading && (
          <div className="wm-table__loading">
            <Loader2 className="wm-table__loading-spinner" size={32} />
          </div>
        )}
        
        <table className={cn('wm-table', sizeClass, stripedClass, { 'wm-table--fixed-columns': hasFixedColumns })} style={{ minWidth: scroll?.x }}>
          <TableHead style={{ 
            position: scroll?.y ? 'sticky' : undefined, 
            top: 0, 
            zIndex: 3,
            backgroundColor: 'var(--white)' 
          }}>
            <TableRow>
              {hasExpandable && (
                <CellTitle className="wm-table__expand-col" style={{ width: 48 }} />
              )}
              {rowSelection && (
                <CellTitle className="wm-table__selection-col">
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <TableCheckbox
                      checked={allCurrentSelected}
                      indeterminate={!!someCurrentSelected}
                      onChange={isTreeMode ? handleTreeSelectAll : handleSelectAll}
                      size="default"
                    />
                  </div>
                </CellTitle>
              )}
              {columns.map((col, index) => (
                <CellTitle
                  key={col.key || col.dataIndex as string || index}
                  className={cn(
                    col.sorter ? 'wm-table__th--sortable' : '',
                    getFixedCellClass(col, index)
                  )}
                  style={{ width: col.width, textAlign: col.align, ...getFixedCellStyle(col, index) }}
                  onClick={() => handleHeaderClick(col)}
                >
                  <div className="wm-table__th-content" style={{ justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start' }}>
                    {col.title}
                    {col.sorter && (
                      <div className={`wm-table__sorter ${
                        (sortColumn?.key === col.key || sortColumn?.dataIndex === col.dataIndex) ? 'wm-table__sorter--active' : ''
                      }`}>
                        <span className={`wm-table__sorter-up ${(sortColumn?.key === col.key && sortDirection === 'asc') ? 'active' : ''}`} />
                        <span className={`wm-table__sorter-down ${(sortColumn?.key === col.key && sortDirection === 'desc') ? 'active' : ''}`} />
                      </div>
                    )}
                  </div>
                </CellTitle>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {processedData.length > 0 ? (
              isTreeMode ? (
                // ===== Tree mode rendering =====
                (() => {
                  const flatRows = flattenTree(processedData, 0, treeExpandedKeys);
                  const selectionColCount = rowSelection ? 1 : 0;
                  const treeColCount = columns.length + selectionColCount;

                  return flatRows.map((flatRow, flatIdx) => {
                    const { record, depth, hasChildren } = flatRow;
                    const key = getRowKey(record, flatIdx);
                    const isExpanded = treeExpandedKeys.includes(key);

                    // Tree-aware checkbox state
                    const treeChecked = rowSelection
                      ? (hasChildren
                        ? isTreeAllChildrenSelected(record, rowSelection.selectedRowKeys)
                        : rowSelection.selectedRowKeys.includes(key))
                      : false;
                    const treeIndeterminate = rowSelection && hasChildren
                      ? isTreeIndeterminate(record, rowSelection.selectedRowKeys)
                      : false;

                    return (
                      <TableRow
                        key={key}
                        className={cn(
                          treeChecked ? 'wm-table__tr--selected' : '',
                          treeIndeterminate ? 'wm-table__tr--indeterminate' : ''
                        )}
                        {...onRow?.(record, flatIdx)}
                      >
                        {rowSelection && (
                          <CellContent className="wm-table__selection-col">
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <TableCheckbox
                                checked={treeChecked}
                                indeterminate={!!treeIndeterminate}
                                onChange={() => handleTreeSelectRow(record)}
                                size="default"
                              />
                            </div>
                          </CellContent>
                        )}
                        {columns.map((col, colIndex) => {
                          const isFirstCol = colIndex === 0;
                          const cellContent = col.render
                            ? col.render(getValue(record, col.dataIndex), record, flatIdx)
                            : getValue(record, col.dataIndex) as React.ReactNode;

                          return (
                            <CellContent
                              key={col.key || col.dataIndex as string || colIndex}
                              className={cn(
                                getFixedCellClass(col, colIndex),
                                isFirstCol ? 'wm-table__td--tree-cell' : ''
                              )}
                              style={{ textAlign: col.align, ...getFixedCellStyle(col, colIndex) }}
                            >
                              {isFirstCol ? (
                                <div className="wm-table__tree-indent-wrapper" style={{ paddingLeft: depth * indentSize }}>
                                  {hasChildren ? (
                                    <button
                                      type="button"
                                      className={cn(
                                        "wm-table__tree-expand-btn",
                                        isExpanded && "wm-table__tree-expand-btn--expanded"
                                      )}
                                      onClick={() => toggleTreeExpand(key)}
                                      aria-label={isExpanded ? '收起' : '展开'}
                                    >
                                      {isExpanded ? (
                                        <Minus className="wm-table__tree-expand-icon" strokeWidth={2} />
                                      ) : (
                                        <Plus className="wm-table__tree-expand-icon" strokeWidth={2} />
                                      )}
                                    </button>
                                  ) : (
                                    <span className="wm-table__tree-expand-placeholder" />
                                  )}
                                  <span className="wm-table__tree-cell-content">{cellContent}</span>
                                </div>
                              ) : (
                                cellContent
                              )}
                            </CellContent>
                          );
                        })}
                      </TableRow>
                    );
                  });
                })()
              ) : (
              // ===== Normal (non-tree) mode rendering =====
              processedData.flatMap((record, rowIndex) => {
                const rowKeyVal = getRowKey(record, rowIndex);
                const expanded = isRowExpanded(record, rowIndex);
                const canExpand = hasExpandable && isRowExpandable(record);
                const rows: React.ReactNode[] = [
                  <TableRow
                    key={rowKeyVal}
                    className={cn(
                      isSelected(record, rowIndex) ? 'wm-table__tr--selected' : '',
                      expanded ? 'wm-table__tr--expanded' : ''
                    )}
                    {...onRow?.(record, rowIndex)}
                  >
                    {hasExpandable && (
                      <CellContent className="wm-table__expand-col">
                        {canExpand && (
                          <button
                            type="button"
                            className="wm-table__expand-btn"
                            onClick={() => toggleExpand(record, rowIndex)}
                            aria-label={expanded ? '收起' : '展开'}
                          >
                            {expanded
                              ? <ChevronDown className="wm-table__expand-icon" />
                              : <ChevronRight className="wm-table__expand-icon" />
                            }
                          </button>
                        )}
                      </CellContent>
                    )}
                    {rowSelection && (
                      <CellContent className="wm-table__selection-col">
                         <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <TableCheckbox
                            checked={isSelected(record, rowIndex)}
                            onChange={() => handleSelectRow(record, rowIndex)}
                            size="default"
                          />
                        </div>
                      </CellContent>
                    )}
                    {columns.map((col, colIndex) => (
                      <CellContent
                        key={col.key || col.dataIndex as string || colIndex}
                        className={getFixedCellClass(col, colIndex)}
                        style={{ textAlign: col.align, ...getFixedCellStyle(col, colIndex) }}
                      >
                        {col.render
                          ? col.render(getValue(record, col.dataIndex), record, rowIndex)
                          : getValue(record, col.dataIndex) as React.ReactNode}
                      </CellContent>
                    ))}
                  </TableRow>,
                ];
                if (hasExpandable && expanded) {
                  rows.push(
                    <TableRow key={`${rowKeyVal}-expand`} className="wm-table__tr--expand-row">
                      <CellContent colSpan={totalColCount} className="wm-table__td--expand-content">
                        {expandable!.expandedRowRender(record, rowIndex, expanded)}
                      </CellContent>
                    </TableRow>
                  );
                }
                return rows;
              })
            )) : (
              <TableRow>
                <CellContent colSpan={totalColCount}>
                  <div className="wm-table__empty">
                    <Inbox className="wm-table__empty-icon" style={{ display: 'inline-block' }} />
                    <p>暂无数据</p>
                  </div>
                </CellContent>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>

      {effectivePagination && (
        <div className="wm-table__pagination">
          <span className="wm-table__pagination-total">
            共有 {effectivePagination.total || 0} 条
          </span>
          <PimaPagination
            {...effectivePagination}
            showTotal={false}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
              effectivePagination.onChange?.(page, size);
            }}
          />
        </div>
      )}
    </div>
  );
}

// Internal Checkbox Component for Table
function TableCheckbox({ checked, indeterminate, onChange, size = 'default' }: { checked: boolean, indeterminate?: boolean, onChange: (checked: boolean) => void, size?: 'sm' | 'default' | 'lg' }) {
  const boxClassName = cn(
    "wm-checkbox-item__box",
    `wm-checkbox-item__box--${size}`,
    {
      "wm-checkbox-item__box--checked": checked || indeterminate,
      "wm-checkbox-item__box--indeterminate": indeterminate,
    }
  );

  const iconClassName = cn(
    "wm-checkbox-item__icon",
    `wm-checkbox-item__icon--${size}`
  );

  return (
    <Checkbox.Root
      checked={indeterminate ? 'indeterminate' : checked}
      onCheckedChange={(c) => onChange(c === true)}
      className={boxClassName}
    >
      <Checkbox.Indicator className="wm-checkbox-item__indicator">
        {indeterminate ? (
          <Minus className={iconClassName} />
        ) : (
          <Check className={iconClassName} />
        )}
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}

// Sub-components
const TableHead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, children, ...props }, ref) => (
    <thead ref={ref} className={cn("wm-table__thead", className)} {...props}>
      {children}
    </thead>
  )
);
TableHead.displayName = "PimaTable.Head";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, children, ...props }, ref) => (
    <tbody ref={ref} className={cn("wm-table__tbody", className)} {...props}>
      {children}
    </tbody>
  )
);
TableBody.displayName = "PimaTable.Body";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, children, ...props }, ref) => (
    <tr ref={ref} className={cn("wm-table__tr", className)} {...props}>
      {children}
    </tr>
  )
);
TableRow.displayName = "PimaTable.Row";

const CellTitle = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, children, ...props }, ref) => (
    <th ref={ref} className={cn("wm-table__th", className)} {...props}>
      {children}
    </th>
  )
);
CellTitle.displayName = "PimaTable.Cell.Title";

const CellContent = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, children, ...props }, ref) => (
    <td ref={ref} className={cn("wm-table__td", className)} {...props}>
      {children}
    </td>
  )
);
CellContent.displayName = "PimaTable.Cell.Content";

export const PimaTable = Object.assign(PimaTableMain, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: {
    Title: CellTitle,
    Content: CellContent,
  },
});