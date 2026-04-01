/**
 * WMDrawer - 抽屉组件
 * 基于Radix UI Dialog实现，从右侧滑出
 */

import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { PimaButton } from './PimaButton';
import '../styles/drawer.css';
import '../styles/theme.css';

export interface WMDrawerProps {
  /** 是否显示抽屉 */
  open?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
  /** 标题 */
  title?: React.ReactNode;
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean;
  /** 内容 */
  children?: React.ReactNode;
  /** 底部自定义内容 */
  footer?: React.ReactNode;
  /** 确认按钮文本 */
  okText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 确认回调 */
  onOk?: () => void | Promise<void>;
  /** 取消回调 */
  onCancel?: () => void;
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean;
  /** 自定义className */
  className?: string;
}

export const WMDrawer: React.FC<WMDrawerProps> = ({
  open = false,
  onClose,
  title,
  showCloseButton = true,
  children,
  footer,
  okText = '\u786E\u5B9A',
  cancelText = '\u53D6\u6D88',
  onOk,
  onCancel,
  maskClosable = true,
  className = '',
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleOk = async () => {
    if (onOk) {
      setLoading(true);
      try {
        await onOk();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const defaultFooter = (
    <>
      <PimaButton
        variant="secondary"
        size="sm"
        onClick={handleCancel}
        disabled={loading}
      >
        {cancelText}
      </PimaButton>
      <PimaButton
        variant="primary"
        size="sm"
        onClick={handleOk}
        disabled={loading}
        loading={loading}
      >
        {okText}
      </PimaButton>
    </>
  );

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="wm-drawer__overlay" />
        <Dialog.Content
          className={`wm-drawer ${className}`}
          onPointerDownOutside={(e) => {
            const target = e.target as HTMLElement;
            // 检查点击目标是否在 Radix Portal 内部（如 Select、Popover、DatePicker 等）
            if (
              target?.closest?.('[data-radix-popper-content-wrapper]') ||
              target?.closest?.('[data-radix-select-viewport]') ||
              target?.closest?.('[role="listbox"]') ||
              target?.closest?.('[data-radix-collection-item]')
            ) {
              e.preventDefault();
              return;
            }
            if (!maskClosable) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement;
            if (
              target?.closest?.('[data-radix-popper-content-wrapper]') ||
              target?.closest?.('[data-radix-select-viewport]') ||
              target?.closest?.('[role="listbox"]') ||
              target?.closest?.('[data-radix-collection-item]')
            ) {
              e.preventDefault();
              return;
            }
            if (!maskClosable) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (!maskClosable) {
              e.preventDefault();
            }
          }}
          onFocusOutside={(e) => {
            // 防止焦点移到 Radix Portal（Select/Popover/DatePicker）时关闭抽屉
            e.preventDefault();
          }}
        >
          {/* 关闭按钮 - 位于抽屉左侧外部，垂直居中 */}
          {showCloseButton && (
            <Dialog.Close asChild>
              <button
                className="wm-drawer__close"
                aria-label="关闭"
              >
                <X size={24} />
              </button>
            </Dialog.Close>
          )}

          {/* 标题栏 */}
          <div className="wm-drawer__header">
            {title && (
              <Dialog.Title className="wm-drawer__title">{title}</Dialog.Title>
            )}
          </div>

          {/* 内容区 */}
          {children && (
            <Dialog.Description asChild>
              <div className="wm-drawer__body">{children}</div>
            </Dialog.Description>
          )}

          {/* 底部按钮区 */}
          <div className="wm-drawer__footer">
            {footer !== undefined ? footer : defaultFooter}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default WMDrawer;