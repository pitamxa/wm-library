import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, File, Download, X, Check } from "lucide-react";
import { cn } from "./ui/utils";
import "../styles/upload.css";

// ========== Types ==========
export type UploadFileStatus = "idle" | "uploading" | "success" | "error";

export interface UploadFile {
  /** 唯一标识 */
  uid: string;
  /** 文件名 */
  name: string;
  /** 上传状态 */
  status: UploadFileStatus;
  /** 上传进度 0-100 */
  percent?: number;
  /** 原始 File 对象 */
  file?: File;
  /** 错误提示 */
  errorMessage?: string;
}

export interface PimaUploadProps {
  /** 文件列表（受控） */
  fileList?: UploadFile[];
  /** 文件列表变化回调 */
  onFileListChange?: (fileList: UploadFile[]) => void;
  /** 上传按钮文字 */
  buttonText?: string;
  /** 提示文本 */
  hint?: string;
  /** 允许的文件类型 (accept 属性) */
  accept?: string;
  /** 是否允许多文件上传 */
  multiple?: boolean;
  /** 最大文件大小(MB) */
  maxSize?: number;
  /** 最大文件数量 */
  maxCount?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 标签 */
  label?: string;
  /** 是否必填 */
  required?: boolean;
  /** 自定义上传处理函数；若不提供则使用模拟上传 */
  customUpload?: (file: File) => Promise<void>;
  /** 额外 className */
  className?: string;
}

// ========== SVG Icon Sub-components ==========

/** 上传箭头图标 */
function UploadButtonIcon() {
  return (
    <span className="wm-upload__button-icon">
      <Upload width={12} height={12} />
    </span>
  );
}

/** 文件图标 */
function FileIcon() {
  return (
    <span className="wm-upload__item-file-icon">
      <File width={14} height={14} />
    </span>
  );
}

/** 下载图标 */
function DownloadIcon() {
  return (
    <span className="wm-upload__icon-download">
      <Download width={14} height={14} />
    </span>
  );
}

/** 删除图标 */
function DeleteIcon({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className="wm-upload__item-delete"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      type="button"
      aria-label="删除文件"
    >
      <X width={14} height={14} />
    </button>
  );
}

/** 成功勾选图标 */
function SuccessCheckIcon() {
  return (
    <span className="wm-upload__item-status wm-upload__icon-success">
      <Check width={14} height={14} />
    </span>
  );
}

/** 进度环图标 */
function ProgressCircle({ percent = 0 }: { percent?: number }) {
  const r = 6;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <span className="wm-upload__item-status">
      <svg width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r={r} className="wm-upload__progress-ring-bg" />
        <circle
          cx="8"
          cy="8"
          r={r}
          className="wm-upload__progress-track"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
    </span>
  );
}

// ========== Utility ==========
let uidCounter = 0;
function genUid(): string {
  return `up-${Date.now()}-${++uidCounter}`;
}

// ========== 主组件 ==========
export function PimaUpload({
  fileList: controlledList,
  onFileListChange,
  buttonText = "点击上传",
  hint = "文档大小不能超过 10MB",
  accept,
  multiple = true,
  maxSize = 10,
  maxCount,
  disabled = false,
  label,
  required = false,
  customUpload,
  className,
}: PimaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalList, setInternalList] = useState<UploadFile[]>([]);

  // 是否受控
  const isControlled = controlledList !== undefined;
  const fileList = isControlled ? controlledList : internalList;

  // 用 ref 保持对最新 fileList 的引用，避免 setInterval 闭包问题
  const fileListRef = useRef(fileList);
  useEffect(() => {
    fileListRef.current = fileList;
  }, [fileList]);

  const onChangeRef = useRef(onFileListChange);
  useEffect(() => {
    onChangeRef.current = onFileListChange;
  }, [onFileListChange]);

  /** 更新文件列表（安全，无闭包问题） */
  const setList = useCallback(
    (updater: (prev: UploadFile[]) => UploadFile[]) => {
      const next = updater(fileListRef.current);
      fileListRef.current = next;
      if (onChangeRef.current) onChangeRef.current(next);
      if (!isControlled) setInternalList(next);
    },
    [isControlled],
  );

  /** 模拟上传 */
  const simulateUpload = useCallback(
    (uid: string) => {
      let progress = 0;
      const timer = setInterval(() => {
        progress += Math.floor(Math.random() * 20) + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(timer);
          const ok = Math.random() > 0.1;
          setList((prev) =>
            prev.map((f) =>
              f.uid === uid
                ? {
                    ...f,
                    percent: 100,
                    status: ok ? ("success" as const) : ("error" as const),
                    errorMessage: ok ? undefined : "上传失败",
                  }
                : f,
            ),
          );
        } else {
          setList((prev) =>
            prev.map((f) =>
              f.uid === uid ? { ...f, percent: progress } : f,
            ),
          );
        }
      }, 300);
    },
    [setList],
  );

  /** 处理文件选择 */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      const current = fileListRef.current;
      const newFiles: UploadFile[] = [];

      for (const file of files) {
        if (maxCount && current.length + newFiles.length >= maxCount) break;

        if (maxSize && file.size > maxSize * 1024 * 1024) {
          newFiles.push({
            uid: genUid(),
            name: file.name,
            status: "error",
            file,
            errorMessage: `文件大小超过 ${maxSize}MB`,
          });
          continue;
        }

        newFiles.push({
          uid: genUid(),
          name: file.name,
          status: "uploading",
          percent: 0,
          file,
        });
      }

      setList((prev) => [...prev, ...newFiles]);

      // 触发上传
      for (const f of newFiles) {
        if (f.status === "uploading") {
          if (customUpload && f.file) {
            customUpload(f.file)
              .then(() => {
                setList((prev) =>
                  prev.map((item) =>
                    item.uid === f.uid
                      ? { ...item, status: "success" as const, percent: 100 }
                      : item,
                  ),
                );
              })
              .catch(() => {
                setList((prev) =>
                  prev.map((item) =>
                    item.uid === f.uid
                      ? { ...item, status: "error" as const, errorMessage: "上传失败" }
                      : item,
                  ),
                );
              });
          } else {
            simulateUpload(f.uid);
          }
        }
      }

      // 重置 input，允许再次选择同名文件
      if (inputRef.current) inputRef.current.value = "";
    },
    [maxCount, maxSize, customUpload, setList, simulateUpload],
  );

  /** 删除文件 */
  const handleDelete = useCallback(
    (uid: string) => {
      setList((prev) => prev.filter((f) => f.uid !== uid));
    },
    [setList],
  );

  /** 重试上传 */
  const handleRetry = useCallback(
    (uid: string) => {
      setList((prev) =>
        prev.map((f) =>
          f.uid === uid
            ? { ...f, status: "uploading" as const, percent: 0, errorMessage: undefined }
            : f,
        ),
      );
      simulateUpload(uid);
    },
    [setList, simulateUpload],
  );

  /** 触发文件选择 */
  const handleTriggerClick = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  return (
    <div className={cn("wm-upload", className)}>
      {label && (
        <label className="wm-upload__label">
          {label}
          {required && <span className="wm-upload__label-required">*</span>}
        </label>
      )}

      {/* 触发区域 */}
      <div className="wm-upload__trigger">
        <button
          type="button"
          className={cn("wm-upload__button", disabled && "wm-upload__button--disabled")}
          onClick={handleTriggerClick}
          disabled={disabled}
        >
          <UploadButtonIcon />
          <span className="wm-upload__button-text">{buttonText}</span>
        </button>
        {hint && <span className="wm-upload__hint">{hint}</span>}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {/* 文件列表 */}
      {fileList.length > 0 && (
        <div className="wm-upload__list">
          {fileList.map((file) => (
            <div
              key={file.uid}
              className="wm-upload__row"
            >
              {/* 背景区域 */}
              <div
                className={cn(
                  "wm-upload__item",
                  file.status === "error" && "wm-upload__item--error",
                )}
              >
                {/* 文件信息 */}
                <div className="wm-upload__item-info">
                  <FileIcon />
                  <span className="wm-upload__item-name">{file.name}</span>
                </div>

                {/* 状态图标 */}
                {file.status === "idle" && <DownloadIcon />}
                {file.status === "uploading" && <ProgressCircle percent={file.percent} />}
                {file.status === "success" && <SuccessCheckIcon />}
                {file.status === "error" && (
                  <button
                    type="button"
                    className="wm-upload__retry"
                    onClick={() => handleRetry(file.uid)}
                  >
                    点击重试
                  </button>
                )}
              </div>

              {/* 删除按钮 — 绝对定位在 item 外部右侧 */}
              <DeleteIcon onClick={() => handleDelete(file.uid)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}