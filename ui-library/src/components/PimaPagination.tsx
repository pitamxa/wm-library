import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PimaSelector } from "./PimaSelector";
import type { PimaSelectorOption } from "./PimaSelector";
import "../styles/pagination.css";

export interface PimaPaginationProps {
  /** Current page number, starting from 1 */
  current?: number;
  /** Total number of items */
  total: number;
  /** Number of items per page */
  pageSize?: number;
  /** Options for items per page */
  pageSizeOptions?: number[];
  /** Callback when page changes */
  onChange?: (page: number, pageSize: number) => void;
  /** Callback when page size changes */
  onShowSizeChange?: (current: number, size: number) => void;
  /** Size variant */
  size?: "sm" | "default" | "lg";
  /** Whether disabled */
  disabled?: boolean;
  /** Simple mode */
  simple?: boolean;
  /** Whether to show quick jumper */
  showQuickJumper?: boolean;
  /** Whether to show page size selector */
  showSizeChanger?: boolean;
  /** Whether to show total count */
  showTotal?: boolean;
  /** Custom class name */
  className?: string;
}

export const PimaPagination: React.FC<PimaPaginationProps> = ({
  current = 1,
  total,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  onChange,
  onShowSizeChange,
  size = "default",
  disabled = false,
  simple = false,
  showQuickJumper = false,
  showSizeChanger = false,
  showTotal = false,
  className = "",
}) => {
  const [jumpValue, setJumpValue] = useState("");
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [currentPage, setCurrentPage] = useState(current);

  // Calculate total pages
  const totalPages = Math.ceil(total / currentPageSize);

  // Number of page buttons to show (fixed at 5)
  const showPageNumbers = 5;

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || disabled || page === currentPage) {
        return;
      }
      setCurrentPage(page);
      onChange?.(page, currentPageSize);
    },
    [totalPages, disabled, currentPage, currentPageSize, onChange]
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (size: number) => {
      const newTotalPages = Math.ceil(total / size);
      const newPage = currentPage > newTotalPages ? newTotalPages : currentPage;
      setCurrentPageSize(size);
      setCurrentPage(newPage);
      onShowSizeChange?.(newPage, size);
      onChange?.(newPage, size);
    },
    [total, currentPage, onShowSizeChange, onChange]
  );

  // Handle quick jump
  const handleJump = useCallback(() => {
    const page = parseInt(jumpValue, 10);
    if (!isNaN(page)) {
      handlePageChange(page);
      setJumpValue("");
    }
  }, [jumpValue, handlePageChange]);

  // Generate page numbers array
  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= showPageNumbers) {
      // If total pages is less than or equal to show count, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex logic: show first page, last page, and pages around current page
      const left = Math.max(2, currentPage - Math.floor(showPageNumbers / 2) + 2);
      const right = Math.min(totalPages - 1, left + showPageNumbers - 5);
      const adjustedLeft = Math.max(2, Math.min(left, totalPages - showPageNumbers + 3));

      pages.push(1);

      if (adjustedLeft > 2) {
        pages.push("...");
      }

      for (let i = adjustedLeft; i <= right; i++) {
        pages.push(i);
      }

      if (right < totalPages - 1) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [totalPages, currentPage, showPageNumbers]);

  const baseClass = "wm-pagination";
  const sizeClass = `${baseClass}--${size}`;
  const disabledClass = disabled ? `${baseClass}--disabled` : "";
  const simpleClass = simple ? `${baseClass}--simple` : "";

  // Simple mode
  if (simple) {
    return (
      <div className={`${baseClass} ${sizeClass} ${simpleClass} ${disabledClass} ${className}`.trim()}>
        <button
          className={`${baseClass}__button ${baseClass}__prev`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className={`${baseClass}__icon`} />
        </button>
        
        <span className={`${baseClass}__simple-text`}>
          {currentPage} / {totalPages}
        </span>

        <button
          className={`${baseClass}__button ${baseClass}__next`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className={`${baseClass}__icon`} />
        </button>
      </div>
    );
  }

  return (
    <div className={`${baseClass} ${sizeClass} ${disabledClass} ${className}`.trim()}>
      {/* Total count display */}
      {showTotal && (
        <div className={`${baseClass}__total`}>
          <span>Total {total} items</span>
        </div>
      )}

      {/* Previous page button */}
      <button
        className={`${baseClass}__button ${baseClass}__prev`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        aria-label="Previous page"
        title="Previous page"
      >
        <ChevronLeft className={`${baseClass}__icon`} />
      </button>

      {/* Page number buttons */}
      <div className={`${baseClass}__pages`}>
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className={`${baseClass}__ellipsis`}>
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              className={`${baseClass}__page ${isActive ? `${baseClass}__page--active` : ""}`}
              onClick={() => handlePageChange(page as number)}
              disabled={disabled}
              aria-label={`Page ${page}`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next page button */}
      <button
        className={`${baseClass}__button ${baseClass}__next`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        aria-label="Next page"
        title="Next page"
      >
        <ChevronRight className={`${baseClass}__icon`} />
      </button>

      {/* Page size selector */}
      {showSizeChanger && (
        <div className={`${baseClass}__size-changer`}>
          <PimaSelector
            value={String(currentPageSize)}
            onValueChange={(val) => handlePageSizeChange(Number(val))}
            options={pageSizeOptions.map((opt) => ({
              value: String(opt),
              label: `${opt} \u6761/\u9875`,
            }))}
            disabled={disabled}
            size={size === "lg" ? "default" : "sm"}
            className={`${baseClass}__size-selector`}
            contentClassName={`${baseClass}__selector-dropdown`}
            placeholder=""
          />
        </div>
      )}

      {/* Quick jumper */}
      {showQuickJumper && (
        <div className={`${baseClass}__jumper`}>
          <span className={`${baseClass}__jumper-text`}>Go to</span>
          <input
            type="number"
            className={`${baseClass}__jumper-input`}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleJump();
              }
            }}
            disabled={disabled}
            min={1}
            max={totalPages}
            aria-label="Jump to page"
          />
          <span className={`${baseClass}__jumper-text`}>page</span>
          <button
            className={`${baseClass}__jumper-button`}
            onClick={handleJump}
            disabled={disabled || !jumpValue}
            aria-label="Jump"
            title="Jump"
          >
            Go
          </button>
        </div>
      )}
    </div>
  );
};

PimaPagination.displayName = "PimaPagination";