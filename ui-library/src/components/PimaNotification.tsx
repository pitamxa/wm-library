import React, { useEffect, useState } from "react";
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from "lucide-react";
import "../styles/notification.css";

export interface PimaNotificationProps {
  /** Notification type */
  type?: "success" | "error" | "warning" | "info";
  /** Notification title */
  title: string;
  /** Notification description */
  description?: string;
  /** Auto close duration in milliseconds, set to 0 to disable auto close */
  duration?: number;
  /** Callback when notification is closed */
  onClose?: () => void;
  /** Whether to show close button */
  closable?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Custom class name */
  className?: string;
}

export const PimaNotification: React.FC<PimaNotificationProps> = ({
  type = "info",
  title,
  description,
  duration = 3000,
  onClose,
  closable = true,
  icon,
  className = "",
}) => {
  const [visible, setVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 200); // Match animation duration
  };

  if (!visible) {
    return null;
  }

  const getDefaultIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} className="wm-notification__icon-svg" />;
      case "error":
        return <AlertCircle size={16} className="wm-notification__icon-svg" />;
      case "warning":
        return <AlertTriangle size={16} className="wm-notification__icon-svg" />;
      case "info":
        return <Info size={16} className="wm-notification__icon-svg" />;
      default:
        return <Info size={16} className="wm-notification__icon-svg" />;
    }
  };

  const baseClass = "wm-notification";
  const typeClass = `${baseClass}--${type}`;
  const closingClass = isClosing ? `${baseClass}--closing` : "";

  return (
    <div
      className={`${baseClass} ${typeClass} ${closingClass} ${className}`.trim()}
      role="alert"
      aria-live="polite"
    >
      <div className={`${baseClass}__icon`}>
        {icon || getDefaultIcon()}
      </div>
      
      <div className={`${baseClass}__content`}>
        <div className={`${baseClass}__title`}>{title}</div>
        {description && (
          <div className={`${baseClass}__description`}>{description}</div>
        )}
      </div>

      {closable && (
        <button
          className={`${baseClass}__close`}
          onClick={handleClose}
          aria-label="Close notification"
          type="button"
        >
          <X className={`${baseClass}__close-icon`} />
        </button>
      )}
    </div>
  );
};

PimaNotification.displayName = "PimaNotification";
