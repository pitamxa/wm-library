/**
 * Pima Components
 * 统一导出所有组件和类型
 */

// ========== 组件导出 ==========
export { PimaSelector } from "./PimaSelector";
export { PimaAnchor, PimaAnchorStatic } from "./PimaAnchor";
export type { AnchorLinkItem, PimaAnchorProps } from "./PimaAnchor";
export { PimaTreeSelector } from "./PimaTreeSelector";
export { PimaRadio } from "./PimaRadio";
export { PimaSwitch } from "./PimaSwitch";
export { PimaDatePicker } from "./PimaDatePicker";
export { PimaTimePicker } from "./PimaTimePicker";
export { PimaCheckbox } from "./PimaCheckbox";
export { PimaTextarea } from "./PimaTextarea";
export { PimaInput } from "./PimaInput";
export { PimaInputNumber } from "./PimaInputNumber";
export type { PimaInputNumberProps } from "./PimaInputNumber";
export { PimaSearch } from "./PimaSearch";
export { PimaSlider, PimaRangeSlider, PimaSliderWithInput } from "./PimaSlider";
export type { PimaSliderProps, PimaRangeSliderProps, PimaSliderWithInputProps, SliderMark } from "./PimaSlider";
export { PimaButton } from "./PimaButton";
export { PimaPagination } from "./PimaPagination";
export { PimaTooltip } from "./PimaTooltip";
export { PimaPopover } from "./PimaPopover";
export type { PimaPopoverProps } from "./PimaPopover";
export { PimaCard } from "./PimaCard";
export { PimaLoginCard } from "./PimaLoginCard";
export { PimaTag } from "./PimaTag";
export { WMDivider } from "./WMDivider";
export { WMMenu } from "./WMMenu";
export type { WMMenuItem, WMMenuProps } from "./WMMenu";
export { WMModal } from "./WMModal";
export type { WMModalProps, ModalSize, ModalStatus } from "./WMModal";
export { WMDrawer } from "./WMDrawer";
export type { WMDrawerProps } from "./WMDrawer";
export { PimaNotification } from "./PimaNotification";
export type { PimaNotificationProps } from "./PimaNotification";
export { PimaNotificationContainer } from "./PimaNotificationContainer";
export type { NotificationInstance } from "./PimaNotificationContainer";
export { PimaProgress } from "./PimaProgress";
export type { PimaProgressProps } from "./PimaProgress";
export { PimaTable } from "./PimaTable";
export type { ColumnType, TableProps, ExpandableConfig, TreeConfig } from "./PimaTable";
export { PimaLoading } from "./PimaLoading";
export type { PimaLoadingProps, LoadingSize, LoadingVariant } from "./PimaLoading";
export { PimaCollapse } from "./PimaCollapse";
export type { PimaCollapseProps, CollapseItem } from "./PimaCollapse";
export { PimaUpload } from "./PimaUpload";
export type { PimaUploadProps, UploadFile, UploadFileStatus } from "./PimaUpload";
export { PimaMessage, PimaMessageContainer } from "./PimaMessage";
export type { PimaMessageProps, MessageInstance, MessageType } from "./PimaMessage";
export { PimaTabs } from "./PimaTabs";
export type { PimaTabsProps } from "./PimaTabs";
export { PimaTimeline } from "./PimaTimeline";
export type { PimaTimelineProps, PimaTimelineItem, TimelineItemStatus, TimelineMode } from "./PimaTimeline";
export { PimaStatistic, PimaCountdown, PimaStatisticGroup } from "./PimaStatistic";
export type { PimaStatisticProps, PimaCountdownProps, PimaStatisticGroupProps, StatisticSize, StatisticColor, TrendDirection } from "./PimaStatistic";
export { PimaBadge } from "./PimaBadge";
export type { PimaBadgeProps } from "./PimaBadge";
export { PimaBreadcrumb } from "./PimaBreadcrumb";
export type { PimaBreadcrumbProps, BreadcrumbItemData } from "./PimaBreadcrumb";
/** @deprecated 请使用 BreadcrumbItemData */
export type { BreadcrumbItem } from "./PimaBreadcrumb";

// ========== 类型导出 ==========
export type {
  // 通用类型
  ComponentSize,
  ValidationVariant,
  BaseOption,
  BaseFormProps,
  
  // Selector 类型
  PimaSelectorOption,
  PimaSelectorProps,
  PimaSelectorSingleProps,
  PimaSelectorMultipleProps,
  PimaTreeNode,
  PimaTreeSelectorProps,
  
  // Radio 类型
  RadioOrientation,
  RadioStyle,
  PimaRadioOption,
  PimaRadioProps,
  
  // Switch 类型
  PimaSwitchProps,
  
  // DatePicker 类型
  PimaDatePickerProps,
  PimaDateRange,
  DatePickerMode,

  // TimePicker 类型
  PimaTimePickerProps,
  
  // Checkbox 类型（预留）
  PimaCheckboxOption,
  PimaCheckboxProps,
  
  // Input 类型（预留）
  InputType,
  PimaInputProps,
  
  // Search 类型
  PimaSearchProps,

  // Slider 类型
  PimaSliderProps,
  PimaRangeSliderProps,
  PimaSliderWithInputProps,
  SliderMark,

  // Textarea 类型（预留）
  PimaTextareaProps,
  
  // Button 类型
  ButtonVariant,
  PimaButtonProps,
  
  // Pagination 类型
  PimaPaginationProps,
  
  // Card 类型
  CardVariant,
  PimaCardProps,
  
  // Tag 类型
  TagVariant,
  TagStyle,
  PimaTagProps,
  
  // Collapse 类型
  CollapseArrowPosition,
  CollapseVariant,

  // Tabs 类型
  PimaTabItem,

  // Timeline 类型
  TimelineItemStatus,
  TimelineMode,
  PimaTimelineItem,
  PimaTimelineProps,

  // Breadcrumb 类型
  BreadcrumbItemData as BreadcrumbItemDataFromTypes,

  // 工具类型
  ValueChangeHandler,
  FormFieldState,
  ValidationRule,
  ThemeMode,
  ThemeConfig,
} from "../types/pima-components";