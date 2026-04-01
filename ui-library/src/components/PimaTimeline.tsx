import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./ui/utils";
import "../styles/timeline.css";

// ========== 类型定义 ==========

export type TimelineItemStatus =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "pending";

export interface PimaTimelineItem {
  /** 唯一标识（可选，缺省用 index） */
  key?: string;
  /** 标题 */
  title?: React.ReactNode;
  /** 描述文字 */
  description?: React.ReactNode;
  /** 时间戳文字 */
  time?: React.ReactNode;
  /** 状态 */
  status?: TimelineItemStatus;
  /** 自定义图标（替换圆点） */
  dot?: React.ReactNode;
  /** 自定义圆点颜色 */
  color?: string;
  /** 自定义类名 */
  className?: string;
}

export interface PimaTimelineProps {
  /** 条目列表 */
  items: PimaTimelineItem[];
  /**
   * 内容位置模式
   * - right（默认）：轴在左侧，内容在右侧
   * - left：内容在左侧，轴在右侧
   * - alternate：内容左右交替
   */
  mode?: "right" | "left" | "alternate";
  /**
   * 最后一个条目是否显示为等待状态（或自定义内容）
   * - true：追加一个 pending 圆点（旋转加载图标）
   * - ReactNode：追加的 pending 条目标题内容
   */
  pending?: boolean | React.ReactNode;
  /** 是否倒序排列 */
  reverse?: boolean;
  /** 尺寸 */
  size?: "sm" | "default" | "lg";
  /** 自定义类名 */
  className?: string;
}

// ========== 内部：单个条目 ==========

interface ItemProps {
  item: PimaTimelineItem;
  isLast: boolean;
  mode: "right" | "left" | "alternate";
  position: "left" | "right"; // only meaningful for alternate
  size: "sm" | "default" | "lg";
}

const TimelineItemNode: React.FC<ItemProps> = ({
  item,
  isLast,
  mode,
  position,
  size,
}) => {
  const status = item.status ?? "default";
  const isPending = status === "pending";

  // -------- Dot --------
  const dot = (
    <div className="wm-timeline__dot">
      {item.dot ? (
        <span className="wm-timeline__dot-custom">{item.dot}</span>
      ) : isPending ? (
        <Loader2 className="wm-timeline__dot-loading" />
      ) : (
        <span
          className={cn(
            "wm-timeline__dot-circle",
            `wm-timeline__dot-circle--${status}`
          )}
          style={
            item.color
              ? { backgroundColor: item.color }
              : undefined
          }
        />
      )}
    </div>
  );

  // -------- Axis (dot + line) --------
  const axis = (
    <div className="wm-timeline__axis">
      {dot}
      {!isLast && (
        <div
          className={cn(
            "wm-timeline__line",
            isPending && "wm-timeline__line--dashed"
          )}
        />
      )}
    </div>
  );

  // -------- Content block --------
  const contentBlock = (
    <>
      {item.time && (
        <span className="wm-timeline__time">{item.time}</span>
      )}
      {item.title && (
        <div className="wm-timeline__title">{item.title}</div>
      )}
      {item.description && (
        <div className="wm-timeline__description">{item.description}</div>
      )}
    </>
  );

  // -------- Render by mode --------

  const itemClass = cn(
    "wm-timeline__item",
    `wm-timeline__item--${status}`,
    isLast && "wm-timeline__item--last",
    item.className
  );

  if (mode === "alternate") {
    return (
      <div className={itemClass}>
        <div className="wm-timeline__col wm-timeline__col--left">
          {position === "left" && contentBlock}
        </div>
        {axis}
        <div className="wm-timeline__col wm-timeline__col--right">
          {position === "right" && contentBlock}
        </div>
      </div>
    );
  }

  // right or left mode
  return (
    <div className={itemClass}>
      {axis}
      <div className="wm-timeline__content">{contentBlock}</div>
    </div>
  );
};

// ========== 对外导出：PimaTimeline ==========

export const PimaTimeline: React.FC<PimaTimelineProps> = ({
  items,
  mode = "right",
  pending = false,
  reverse = false,
  size = "default",
  className,
}) => {
  const allItems: PimaTimelineItem[] = [...items];

  // 追加 pending 条目
  if (pending) {
    allItems.push({
      key: "__pending__",
      status: "pending",
      title: typeof pending !== "boolean" ? pending : undefined,
    });
  }

  const displayItems = reverse ? [...allItems].reverse() : allItems;

  return (
    <div
      className={cn(
        "wm-timeline",
        `wm-timeline--${size}`,
        `wm-timeline--${mode}`,
        className
      )}
    >
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const position: "left" | "right" =
          mode === "alternate"
            ? index % 2 === 0
              ? "right"
              : "left"
            : "right";

        return (
          <TimelineItemNode
            key={item.key ?? index}
            item={item}
            isLast={isLast}
            mode={mode}
            position={position}
            size={size}
          />
        );
      })}
    </div>
  );
};

PimaTimeline.displayName = "PimaTimeline";