import React, { useEffect, useState, useCallback } from "react";
import {
  CheckCircle,
  X,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import "../styles/message.css";

// ========== Single Message Item ==========

export type MessageType = "success" | "error" | "warning" | "info" | "loading";

export interface PimaMessageProps {
  /** Message type */
  type?: MessageType;
  /** Message content */
  content: string;
  /** Auto close duration in milliseconds, 0 to disable */
  duration?: number;
  /** Callback when message is closed */
  onClose?: () => void;
  /** Whether to show close button */
  closable?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Custom class name */
  className?: string;
}

export const PimaMessage: React.FC<PimaMessageProps> = ({
  type = "info",
  content,
  duration = 3000,
  onClose,
  closable = false,
  icon,
  className = "",
}) => {
  const [visible, setVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!visible) {
    return null;
  }

  const getDefaultIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} className="wm-message__icon-svg" />;
      case "error":
        return <AlertCircle size={16} className="wm-message__icon-svg" />;
      case "warning":
        return <AlertTriangle size={16} className="wm-message__icon-svg" />;
      case "info":
        return <Info size={16} className="wm-message__icon-svg" />;
      case "loading":
        return <div className="wm-message__spinner" />;
      default:
        return <Info size={16} className="wm-message__icon-svg" />;
    }
  };

  const baseClass = "wm-message";
  const typeClass = `${baseClass}--${type}`;
  const closingClass = isClosing ? `${baseClass}--closing` : "";

  return (
    <div
      className={`${baseClass} ${typeClass} ${closingClass} ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <div className={`${baseClass}__icon`}>
        {icon || getDefaultIcon()}
      </div>

      <div className={`${baseClass}__content`}>{content}</div>

      {closable && (
        <button
          className={`${baseClass}__close`}
          onClick={handleClose}
          aria-label="Close message"
          type="button"
        >
          <X className={`${baseClass}__close-icon`} />
        </button>
      )}
    </div>
  );
};

PimaMessage.displayName = "PimaMessage";

// ========== Message Container (for stacking demo) ==========

export interface MessageInstance {
  id: string;
  type: MessageType;
  content: string;
  duration?: number;
  closable?: boolean;
  icon?: React.ReactNode;
}

export interface PimaMessageContainerProps {
  messages: MessageInstance[];
  onRemove?: (id: string) => void;
}

export const PimaMessageContainer: React.FC<PimaMessageContainerProps> = ({
  messages,
  onRemove,
}) => {
  return (
    <div className="wm-message-container">
      {messages.map((msg) => (
        <PimaMessage
          key={msg.id}
          type={msg.type}
          content={msg.content}
          duration={msg.duration}
          closable={msg.closable}
          icon={msg.icon}
          onClose={() => onRemove?.(msg.id)}
        />
      ))}
    </div>
  );
};

PimaMessageContainer.displayName = "PimaMessageContainer";
