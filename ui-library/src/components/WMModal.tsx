/**
 * WMModal - Modal组件
 * 基于Radix UI Dialog实现，支持各种状态和尺寸
 */

import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Loader2, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { PimaButton } from './PimaButton';
import '../styles/modal.css';
import '../styles/theme.css';

export type ModalSize = 'small' | 'default' | 'large';
export type ModalStatus = 'default' | 'loading' | 'success' | 'error' | 'warning' | 'info';

export interface WMModalProps {
  /** 是否显示Modal */
  open?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
  /** 标题 */
  title?: React.ReactNode;
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean;
  /** 内容 */
  children?: React.ReactNode;
  /** 底部按钮配置 */
  footer?: React.ReactNode;
  /** 确认按钮文本 */
  okText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 确认回调 */
  onOk?: () => void | Promise<void>;
  /** 取消回调 */
  onCancel?: () => void;
  /** 尺寸 */
  size?: ModalSize;
  /** 状态 */
  status?: ModalStatus;
  /** 是否禁用确认按钮 */
  okButtonDisabled?: boolean;
  /** 是否显示取消按钮 */
  showCancelButton?: boolean;
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean;
  /** 是否居中显示 */
  centered?: boolean;
  /** 纯内容模式（不显示关闭按钮和底部操作） */
  contentOnly?: boolean;
  /** header下方和footer上方显示分割线 */
  bordered?: boolean;
  /** 自定义className */
  className?: string;
}

const StatusIcons: Record<Exclude<ModalStatus, 'default'>, React.ReactNode> = {
  loading: <Loader2 size={20} className="wm-modal__status-icon--loading" />,
  success: <CheckCircle size={20} className="wm-modal__status-icon--success" />,
  error: <AlertCircle size={20} className="wm-modal__status-icon--error" />,
  warning: <AlertTriangle size={20} className="wm-modal__status-icon--warning" />,
  info: <Info size={20} className="wm-modal__status-icon--info" />,
};

export const WMModal: React.FC<WMModalProps> = ({
  open = false,
  onClose,
  title,
  showCloseButton = true,
  children,
  footer,
  okText = '确定',
  cancelText = '取消',
  onOk,
  onCancel,
  size = 'default',
  status = 'default',
  okButtonDisabled = false,
  showCancelButton = true,
  maskClosable = true,
  centered = true,
  contentOnly = false,
  bordered = false,
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

  const handleOpenChange = (open: boolean) => {
    if (!open && onClose) {
      onClose();
    }
  };

  // 键盘事件处理
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

  // 默认footer
  const defaultFooter = (
    <>
      {showCancelButton && (
        <PimaButton
          variant="secondary"
          size="sm"
          onClick={handleCancel}
          disabled={loading || status === 'loading'}
        >
          {cancelText}
        </PimaButton>
      )}
      <PimaButton
        variant={status === 'error' ? 'danger' : 'primary'}
        size="sm"
        onClick={handleOk}
        disabled={okButtonDisabled || loading || status === 'loading'}
        loading={loading || status === 'loading'}
        className="wm-modal__ok-button"
      >
        {okText}
      </PimaButton>
    </>
  );

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="wm-modal__overlay" />
        <Dialog.Content
          className={`wm-modal ${className}`}
          data-size={size}
          data-status={status}
          data-centered={centered}
          data-bordered={bordered ? 'true' : undefined}
          data-has-icon={(status !== 'default' && status !== 'loading') ? 'true' : undefined}
          onPointerDownOutside={(e) => {
            if (!maskClosable) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (!maskClosable) {
              e.preventDefault();
            }
          }}
        >
          {/* 标题栏 */}
          {(title || (showCloseButton && !contentOnly)) && (
            <div className={`wm-modal__header${bordered ? ' wm-modal__header--bordered' : ''}`}>
              <div className="wm-modal__title-wrapper">
                {status !== 'default' && status !== 'loading' && (
                  <span className="wm-modal__status-icon">{StatusIcons[status]}</span>
                )}
                {title && <Dialog.Title className="wm-modal__title">{title}</Dialog.Title>}
              </div>
              {showCloseButton && !contentOnly && (
                <Dialog.Close
                  className="wm-modal__close"
                  aria-label="关闭"
                >
                  <X size={24} strokeWidth={1} />
                </Dialog.Close>
              )}
            </div>
          )}

          {/* 内容区：用 div 替代 Dialog.Description（避免 <p> 嵌套 <p> 的 DOM 非法结构） */}
          {children && (
            <div className="wm-modal__body">
              {children}
            </div>
          )}

          {/* 无障碍隐藏描述（满足 Radix Dialog 的 a11y 要求，不使用 asChild 避免 Figma 属性透传警告） */}
          <Dialog.Description style={{ display: 'none' }} aria-hidden="true" />

          {/* 按钮区 */}
          {(footer !== null || onOk || onCancel) && !contentOnly && (
            <div className={`wm-modal__footer${bordered ? ' wm-modal__footer--bordered' : ''}`}>
              {footer !== undefined ? footer : defaultFooter}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default WMModal;