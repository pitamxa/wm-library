import React, { useState, useCallback } from "react";
import { PimaNotification, PimaNotificationProps } from "./PimaNotification";
import "../styles/notification-container.css";

export interface NotificationInstance extends PimaNotificationProps {
  id: string;
}

interface PimaNotificationContainerProps {
  /** Maximum number of notifications to show */
  maxCount?: number;
  /** Position of the notification container */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
}

export const PimaNotificationContainer: React.FC<PimaNotificationContainerProps> = ({
  maxCount = 5,
  position = "top-right",
}) => {
  const [notifications, setNotifications] = useState<NotificationInstance[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const baseClass = "wm-notification-container";
  const positionClass = `${baseClass}--${position}`;

  return (
    <div className={`${baseClass} ${positionClass}`}>
      {notifications.slice(0, maxCount).map((notification) => (
        <PimaNotification
          key={notification.id}
          {...notification}
          onClose={() => {
            notification.onClose?.();
            removeNotification(notification.id);
          }}
        />
      ))}
    </div>
  );
};

PimaNotificationContainer.displayName = "PimaNotificationContainer";

// Notification API for imperative usage
let notificationContainerRef: React.MutableRefObject<{
  add: (notification: Omit<NotificationInstance, "id">) => void;
} | null> | null = null;

export const notification = {
  success: (props: Omit<PimaNotificationProps, "type">) => {
    if (notificationContainerRef?.current) {
      notificationContainerRef.current.add({ ...props, type: "success" });
    }
  },
  error: (props: Omit<PimaNotificationProps, "type">) => {
    if (notificationContainerRef?.current) {
      notificationContainerRef.current.add({ ...props, type: "error" });
    }
  },
  warning: (props: Omit<PimaNotificationProps, "type">) => {
    if (notificationContainerRef?.current) {
      notificationContainerRef.current.add({ ...props, type: "warning" });
    }
  },
  info: (props: Omit<PimaNotificationProps, "type">) => {
    if (notificationContainerRef?.current) {
      notificationContainerRef.current.add({ ...props, type: "info" });
    }
  },
};
