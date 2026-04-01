/**
 * Pima Components Type Definitions
 * 统一的类型定义文件
 */

// ========== 通用类型 ==========

/**
 * 组件尺寸
 */
export type ComponentSize = "sm" | "default" | "lg";

/**
 * 验证状态
 */
export type ValidationVariant = "default" | "error" | "success";

/**
 * 基础选项接口
 */
export interface BaseOption {
  /** 选项的唯一值 */
  value: string;
  /** 显示的标签文本 */
  label: string;
  /** 是否禁用该选项 */
  disabled?: boolean;
  /** 选项的描述信息（可选） */
  description?: string;
}

/**
 * 表单布局方向
 */
export type FormLayout = "vertical" | "horizontal";

/**
 * 基础表单组件 Props
 */
export interface BaseFormProps {
  /** 表单字段标签 */
  label?: string;
  /** 辅助提示文本 */
  helperText?: string;
  /** 是否必填 */
  required?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示错误状态 */
  error?: boolean;
  /** 是否显示成功状态 */
  success?: boolean;
  /** 验证状态变体 */
  variant?: ValidationVariant;
  /** 组件尺寸 */
  size?: ComponentSize;
  /** 表单布局：vertical（默认）或 horizontal（label 在左侧右对齐） */
  layout?: FormLayout;
  /** 水平布局时标签列宽度 */
  labelWidth?: number | string;
  /** 自定义类名 */
  className?: string;
}

// ========== Selector 组件类型 ==========

/**
 * Selector 选项接口
 */
export interface PimaSelectorOption extends BaseOption {}

/**
 * Selector 共享 Props（单选/多选通用）
 */
interface PimaSelectorBaseProps extends BaseFormProps {
  /** 选项列表 */
  options: PimaSelectorOption[];
  /** 占位符文本 */
  placeholder?: string;
  /** 是否加载中 */
  loading?: boolean;
  /** 是否允许清除已选项 */
  clearable?: boolean;
  /** 自定义下拉内容类名 */
  contentClassName?: string;
}

/**
 * 单选模式 Props
 */
export interface PimaSelectorSingleProps extends PimaSelectorBaseProps {
  /** 选择模式：单选（默认） */
  mode?: "single";
  /** 当前选中的值 */
  value?: string;
  /** 值改变时的回调 */
  onValueChange?: (value: string) => void;
  /** 是否显示搜索框 */
  searchable?: boolean;
  /** 搜索框占位符 */
  searchPlaceholder?: string;
  // 以下属性在单选模式下不存在
  showSelectAll?: never;
  maxSelection?: never;
  maxTagCount?: never;
}

/**
 * 多选模式 Props
 */
export interface PimaSelectorMultipleProps extends PimaSelectorBaseProps {
  /** 选择模式：多选 */
  mode: "multiple";
  /** 当前选中的值数组 */
  value?: string[];
  /** 值改变时的回调 */
  onValueChange?: (value: string[]) => void;
  /** 是否显示搜索框 */
  searchable?: boolean;
  /** 搜索框占位符 */
  searchPlaceholder?: string;
  /** 是否显示全选按钮 */
  showSelectAll?: boolean;
  /** 最大可选数量 */
  maxSelection?: number;
  /** 已选项展示的最大标签数（超出显示 +N） */
  maxTagCount?: number;
}

/**
 * Selector 组件 Props（支持单选 & 多选）
 */
export type PimaSelectorProps = PimaSelectorSingleProps | PimaSelectorMultipleProps;

// ========== MultiSelector 组件类型（向后兼容别名） ==========

/**
 * @deprecated 请直接使用 PimaSelectorProps mode="multiple"
 * MultiSelector 组件 Props（多选选择器）
 */
export type PimaMultiSelectorProps = PimaSelectorMultipleProps;

// ========== TreeSelector 组件类型 ==========

/**
 * 树形选择器节点
 */
export interface PimaTreeNode {
  /** 节点唯一值 */
  value: string;
  /** 显示标签 */
  label: string;
  /** 子节点 */
  children?: PimaTreeNode[];
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * TreeSelector 组件 Props（树形多选选择器）
 */
export interface PimaTreeSelectorProps extends BaseFormProps {
  /** 树形数据 */
  treeData: PimaTreeNode[];
  /** 当前选中的叶子节点值数组 */
  value?: string[];
  /** 值改变时的回调 */
  onValueChange?: (value: string[]) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否加载中 */
  loading?: boolean;
  /** 是否允许清除已选项 */
  clearable?: boolean;
  /** 自定义下拉内容类名 */
  contentClassName?: string;
  /** 是否显示搜索框 */
  searchable?: boolean;
  /** 搜索框占位符 */
  searchPlaceholder?: string;
  /** 已选项展示的最大标签数（超出显示 +N） */
  maxTagCount?: number;
  /** 默认展开所有节点 */
  defaultExpandAll?: boolean;
  /** 是否级联选择（选中父节点自动选中所有子节点） */
  cascade?: boolean;
}

// ========== Radio 组件类型 ==========

/**
 * Radio 排列方向
 */
export type RadioOrientation = "vertical" | "horizontal";

/**
 * Radio 样式类型
 */
export type RadioStyle = "default" | "card" | "button" | "image" | "solid";

/**
 * Radio 选项接口
 */
export interface PimaRadioOption extends BaseOption {}

/**
 * Radio 组件 Props
 */
export interface PimaRadioProps extends BaseFormProps {
  /** 选项列表 */
  options: PimaRadioOption[];
  /** 当前选中的值 */
  value?: string;
  /** 值改变时的回调 */
  onValueChange?: (value: string) => void;
  /** 排列方向 */
  orientation?: RadioOrientation;
  /** Radio 样式类型 */
  radioStyle?: RadioStyle;
}

// ========== DatePicker 组件类型（预留） ==========

/**
 * DatePicker 模式
 */
export type DatePickerMode = "date" | "datetime" | "range" | "week" | "month" | "year";

/**
 * 日期区间
 */
export interface PimaDateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

/**
 * DatePicker 组件 Props
 */
export interface PimaDatePickerProps extends Omit<BaseFormProps, "options"> {
  /** 选择模式：date（单日）/ datetime（日期+时间）/ range（日期区间） */
  mode?: DatePickerMode;
  /** 当前选中的日期（date / datetime 模式） */
  date?: Date;
  /** 日期改变时的回调（date / datetime 模式） */
  onDateChange?: (date: Date | undefined) => void;
  /** 当前选中的区间（range 模式） */
  dateRange?: PimaDateRange;
  /** 区间改变时的回调（range 模式） */
  onDateRangeChange?: (range: PimaDateRange) => void;
  /** 是否显示秒（datetime 模式） */
  showSeconds?: boolean;
  /** 占位符文本 */
  placeholder?: string;
  /** 日期格式化字符串 */
  format?: string;
  /** 最小可选日期 */
  minDate?: Date;
  /** 最大可选日期 */
  maxDate?: Date;
  /** 禁用的日期 */
  disabledDates?: Date[] | ((date: Date) => boolean);
  /** 是否加载中 */
  loading?: boolean;
  /** 是否可清除 */
  clearable?: boolean;
}

/**
 * TimePicker 独立组件 Props
 */
export interface PimaTimePickerProps {
  /** 当前选中的时间（Date 对象，仅使用时/分/秒部分） */
  value?: Date;
  /** 时间改变时的回调 */
  onChange?: (date: Date | undefined) => void;
  /** 是否显示秒 */
  showSeconds?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 错误状态 */
  error?: boolean;
  /** 成功状态 */
  success?: boolean;
  /** 尺寸 */
  size?: "sm" | "default" | "lg";
  /** 标签 */
  label?: string;
  /** 是否必填 */
  required?: boolean;
  /** 辅助文本 */
  helperText?: string;
  /** 占位符 */
  placeholder?: string;
  /** 是否可清除 */
  clearable?: boolean;
  /** 布局方式 */
  layout?: "vertical" | "horizontal";
  /** 水平布局时标签宽度 */
  labelWidth?: number | string;
  /** 自定义类名 */
  className?: string;
}

// ========== Checkbox 组件类型（预留） ==========

/**
 * Checkbox 样式类型
 */
export type CheckboxStyle = "default" | "card" | "button";

/**
 * Checkbox 选项接口
 */
export interface PimaCheckboxOption extends BaseOption {}

/**
 * Checkbox 组件 Props
 */
export interface PimaCheckboxProps extends BaseFormProps {
  /** 选项列表 */
  options: PimaCheckboxOption[];
  /** 当前选中的值数组 */
  value?: string[];
  /** 值改变时的回调 */
  onValueChange?: (value: string[]) => void;
  /** 排列方向 */
  orientation?: RadioOrientation;
  /** Checkbox 样式类型 */
  checkboxStyle?: CheckboxStyle;
  /** 最大可选数量 */
  maxSelection?: number;
  /** 最小可选数量 */
  minSelection?: number;
}

// ========== Input 组件类型（预留） ==========

/**
 * Input 类型
 */
export type InputType = "text" | "password" | "email" | "number" | "tel" | "url";

/**
 * Input 组件 Props
 */
export interface PimaInputProps extends Omit<BaseFormProps, "options"> {
  /** 输入框类型 */
  type?: InputType;
  /** 当前值 */
  value?: string;
  /** 值改变时的回调 */
  onValueChange?: (value: string) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 前缀图标或文本 */
  prefix?: React.ReactNode;
  /** 后缀图标或文本 */
  suffix?: React.ReactNode;
  /** 最大长度 */
  maxLength?: number;
  /** 是否显示字符计数 */
  showCount?: boolean;
  /** 是否只读 */
  readOnly?: boolean;
  /** 是否显示清除按钮（悬浮时显示） */
  clearable?: boolean;
  /** 清除回调 */
  onClear?: () => void;
}

// ========== Search 组件类型 ==========

/**
 * Search 组件 Props
 */
export interface PimaSearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** 搜索回调 */
  onSearch?: (value: string) => void;
  /** 清除回调 */
  onClear?: () => void;
  /** 是否显示清除按钮 */
  showClearButton?: boolean;
  /** 状态 */
  status?: 'default' | 'focus' | 'error' | 'disabled';
  /** 错误信息 */
  error?: string;
  /** 标签 */
  label?: string;
  /** 自定义类名 */
  className?: string;
}

// ========== Textarea 组件类型（预留） ==========

/**
 * Textarea 组件 Props
 */
export interface PimaTextareaProps extends Omit<PimaInputProps, "type" | "prefix" | "suffix"> {
  /** 行数 */
  rows?: number;
  /** 最小行数（自动调整高度） */
  minRows?: number;
  /** 最大行数（自动调整高度） */
  maxRows?: number;
  /** 是否自动调整高度 */
  autoResize?: boolean;
}

// ========== Tabs 组件类型 ==========

// ========== Popover 组件类型 ==========

/**
 * Popover 气泡卡片组件 Props
 */
export interface PimaPopoverProps {
  /** 气泡卡片标题 */
  title?: React.ReactNode;
  /** 气泡卡片内容 */
  content: React.ReactNode;
  /** 触发元素 */
  children: React.ReactElement;
  /** 弹出位置 */
  placement?: "top" | "bottom" | "left" | "right";
  /** 触发方式 */
  trigger?: "hover" | "click" | "focus";
  /** 尺寸 */
  size?: "sm" | "default" | "lg";
  /** 是否显示箭头 */
  showArrow?: boolean;
  /** 鼠标进入延迟（ms） */
  mouseEnterDelay?: number;
  /** 鼠标离开延迟（ms） */
  mouseLeaveDelay?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 触发器容器自定义类名 */
  className?: string;
  /** 气泡卡片自定义类名 */
  overlayClassName?: string;
  /** z-index */
  zIndex?: number;
}

// ========== Tabs 组件类型 ==========

/**
 * Tab 项接口
 */
export interface PimaTabItem {
  /** Tab 唯一标识 */
  key: string;
  /** Tab 显示标签 */
  label: React.ReactNode;
  /** Tab 内容面板 */
  children?: React.ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * Tabs 组件 Props
 */
export interface PimaTabsProps {
  /** Tab 项列表 */
  items: PimaTabItem[];
  /** 当前激活的 Tab key（受控） */
  activeKey?: string;
  /** 默认激活的 Tab key（非受控） */
  defaultActiveKey?: string;
  /** Tab 切换回调 */
  onChange?: (key: string) => void;
  /** 自定义指示条宽度（px），不设置则跟随 Tab 项宽度 */
  indicatorWidth?: number;
  /** 自定义类名 */
  className?: string;
}

// ========== Switch 组件类型（预留） ==========

/**
 * Switch 组件 Props
 */
export interface PimaSwitchProps extends Omit<BaseFormProps, "options"> {
  /** 是否选中 */
  checked?: boolean;
  /** 状态改变时的回调 */
  onCheckedChange?: (checked: boolean) => void;
  /** 选中时的文本 */
  checkedText?: string;
  /** 未选中时的文本 */
  uncheckedText?: string;
  /** 是否加载中 */
  loading?: boolean;
}

/**
 * Slider 组件标记点
 */
export interface SliderMark {
  value: number;
  label?: string | React.ReactNode;
}

/**
 * Slider 滑动输入条组件 Props
 */
export interface PimaSliderProps extends Omit<BaseFormProps, "options"> {
  /** 当前值 (单滑块) */
  value?: number;
  /** 默认值 (单滑块) */
  defaultValue?: number;
  /** 值变化回调 */
  onChange?: (value: number) => void;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步长 */
  step?: number;
  /** 标记点 */
  marks?: Record<number, string | SliderMark> | SliderMark[];
  /** 是否显示提示 */
  tooltip?: boolean;
  /** 自定义格式化显示值 */
  tipFormatter?: (value: number) => string;
  /** 样式类名 */
  className?: string;
}

/**
 * RangeSlider 范围滑块组件 Props
 */
export interface PimaRangeSliderProps extends Omit<BaseFormProps, "options"> {
  /** 当前值 (范围滑块) */
  value?: [number, number];
  /** 默认值 (范围滑块) */
  defaultValue?: [number, number];
  /** 值变化回调 */
  onChange?: (value: [number, number]) => void;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步长 */
  step?: number;
  /** 标记点 */
  marks?: Record<number, string | SliderMark> | SliderMark[];
  /** 是否显示提示 */
  tooltip?: boolean;
  /** 自定义格式化显示值 */
  tipFormatter?: (value: number) => string;
  /** 样式类名 */
  className?: string;
  /** 是否允许范围重叠 */
  allowCross?: boolean;
}

// ========== 工具类型 ==========

// ========== Breadcrumb 类型 ==========

/**
 * 面包屑数据项
 */
export interface BreadcrumbItemData {
  /** 唯一标识 */
  key: string;
  /** 显示文本 */
  label: string;
  /** 点击回调（最后一项不会触发） */
  onClick?: () => void;
  /** 链接地址（可选） */
  href?: string;
  /** 前缀图标 */
  icon?: React.ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
}

/** @deprecated 请使用 BreadcrumbItemData */
export type BreadcrumbItem = BreadcrumbItemData;

/**
 * 面包屑组件 Props
 */
export interface PimaBreadcrumbProps {
  /** 面包屑数据项 */
  items: BreadcrumbItemData[];
  /** 自定义分隔符 */
  separator?: React.ReactNode;
  /** 尺寸 */
  size?: ComponentSize;
  /**
   * 最大显示项数（超出时中间项折叠为省略号）
   * 设为 0 或不设表示全部显示
   */
  maxItems?: number;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

// ========== 工具类型 ==========

/**
 * 值变更处理器类型
 */
export type ValueChangeHandler<T = string> = (value: T) => void;

/**
 * 表单字段状态
 */
export interface FormFieldState {
  /** 字段值 */
  value: string | string[];
  /** 是否有错误 */
  error: boolean;
  /** 错误信息 */
  errorMessage?: string;
  /** 是否已访问 */
  touched: boolean;
  /** 是否已修改 */
  dirty: boolean;
}

/**
 * 表单验证规则
 */
export interface ValidationRule {
  /** 是否必填 */
  required?: boolean | { message: string };
  /** 最小长度 */
  minLength?: number | { value: number; message: string };
  /** 最大长度 */
  maxLength?: number | { value: number; message: string };
  /** 正则表达式验证 */
  pattern?: RegExp | { value: RegExp; message: string };
  /** 自定义验证函数 */
  validate?: (value: any) => boolean | string;
}

// ========== Timeline 组件类型 ==========

/**
 * Timeline 条目状态
 */
export type TimelineItemStatus = "default" | "success" | "error" | "warning" | "info" | "pending";

/**
 * Timeline 条目接口
 */
export interface PimaTimelineItem {
  /** 唯一标识（可选） */
  key?: string;
  /** 标题 */
  title?: React.ReactNode;
  /** 描述文字 */
  description?: React.ReactNode;
  /** 时间戳 */
  time?: React.ReactNode;
  /** 状态 */
  status?: TimelineItemStatus;
  /** 自定义图标（替换圆点） */
  dot?: React.ReactNode;
  /** 自定义颜色 */
  color?: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * Timeline 内容位置模式
 */
export type TimelineMode = "right" | "left" | "alternate";

/**
 * Timeline 组件 Props
 */
export interface PimaTimelineProps {
  /** 条目列表 */
  items: PimaTimelineItem[];
  /** 内容位置模式 */
  mode?: TimelineMode;
  /** 最后一个条目是否为 pending 状态，或自定义内容 */
  pending?: boolean | React.ReactNode;
  /** 是否倒序排列 */
  reverse?: boolean;
  /** 尺寸 */
  size?: ComponentSize;
  /** 自定义类名 */
  className?: string;
}

// ========== Button 组件类型 ==========

/**
 * Button 类型
 */
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "warning";

/**
 * Button 组件 Props
 */
export interface PimaButtonProps {
  /** 按钮类型 */
  variant?: ButtonVariant;
  /** 按钮尺寸 */
  size?: ComponentSize;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 是否为块级按钮100%宽度） */
  block?: boolean;
  /** 前缀图标 */
  icon?: React.ReactNode;
  /** 后缀图标 */
  iconRight?: React.ReactNode;
  /** 按钮文本 */
  children?: React.ReactNode;
  /** 点击事件 */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** HTML button type */
  type?: "button" | "submit" | "reset";
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

// ==========  Pagination 类型 ==========

/**
 * Pagination 组件 Props
 */
export interface PimaPaginationProps {
  /** 当前页码，从 1 开始 */
  current?: number;
  /** 总条目数 */
  total: number;
  /** 每页显示条目数 */
  pageSize?: number;
  /** 每页显示条目数选项 */
  pageSizeOptions?: number[];
  /** 页码变化回调 */
  onChange?: (page: number, pageSize: number) => void;
  /** 每页条数变化回调 */
  onShowSizeChange?: (current: number, size: number) => void;
  /** 尺寸 */
  size?: ComponentSize;
  /** 是否禁用 */
  disabled?: boolean;
  /** 简洁模式 */
  simple?: boolean;
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean;
  /** 是否显示每页条数选择器 */
  showSizeChanger?: boolean;
  /** 是否显示总数 */
  showTotal?: boolean;
  /** 总数渲染函数 */
  totalRender?: (total: number, range: [number, number]) => React.ReactNode;
  /** 显示的页码数量 */
  showPageNumbers?: number;
  /** 自定义类名 */
  className?: string;
}

// ========== Card 组件类型 ==========

/**
 * Card 变体类型
 */
export type CardVariant = "default" | "bordered" | "elevated";

/**
 * Card 组件 Props
 */
export interface PimaCardProps {
  /** 卡片标题 */
  title?: React.ReactNode;
  /** 卡片描述/副标题 */
  description?: React.ReactNode;
  /** 标题额外内容 */
  extra?: React.ReactNode;
  /** 卡片内容 */
  children?: React.ReactNode;
  /** 底部内容 */
  footer?: React.ReactNode;
  /** 卡片变体 */
  variant?: CardVariant;
  /** 卡片尺寸 */
  size?: ComponentSize;
  /** 是否悬停效果 */
  hoverable?: boolean;
  /** 是否可点击 */
  clickable?: boolean;
  /** 点击事件 */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 是否显示错误状态 */
  error?: boolean;
  /** 是否显示成功状态 */
  success?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义头部类名 */
  headerClassName?: string;
  /** 自定义内容类名 */
  bodyClassName?: string;
  /** 自定义底部类名 */
  footerClassName?: string;
}

// ========== Menu 组件类型 ==========

/**
 * Menu Item 接口
 */
export interface MenuItem {
  /** 菜单项唯一标识 */
  key: string;
  /** 菜单项文本 */
  label: string;
  /** 菜单项图标 */
  icon?: React.ReactNode;
  /** 子菜单项 */
  children?: MenuItem[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击事件 */
  onClick?: () => void;
}

/**
 * Menu 组件 Props
 */
export interface PimaMenuProps {
  /** 菜单项数据 */
  items: MenuItem[];
  /** 当前选中的菜单项 key */
  selectedKey?: string;
  /** 默认选中的菜单项 key（非受控） */
  defaultSelectedKey?: string;
  /** 选中菜单项变化时的回调 */
  onSelect?: (key: string) => void;
  /** 默认展开的菜单项 keys */
  defaultOpenKeys?: string[];
  /** 展开的菜单项 keys（受控） */
  openKeys?: string[];
  /** 展开菜单项变化时的回调 */
  onOpenChange?: (keys: string[]) => void;
  /** 菜单宽度 */
  width?: number | string;
  /** 尺寸 */
  size?: ComponentSize;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

// ========== Tag 组件类型 ==========

/**
 * Tag 变体类型
 */
export type TagVariant = "primary" | "secondary" | "success" | "warning" | "error" | "info";

/**
 * Tag 样式类型
 */
export type TagStyle = "filled" | "outlined";

/**
 * Tag 组件 Props
 */
export interface PimaTagProps {
  /** 标签文本内容 */
  children: React.ReactNode;
  /** 变体类型 */
  variant?: TagVariant;
  /** 尺寸 */
  size?: ComponentSize;
  /** 样式类型 */
  tagStyle?: TagStyle;
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭回调 */
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** 点击回调 */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 左侧图标 */
  icon?: React.ReactNode;
  /** 自定义颜色 */
  color?: string;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

// ========== Collapse 组件类型 ==========

/**
 * Collapse 面板子项数据接口
 */
export interface CollapseItem {
  /** 唯一标识 */
  key: string;
  /** 标题 */
  title: React.ReactNode;
  /** 内容 */
  children: React.ReactNode;
  /** 左侧图标 */
  icon?: React.ReactNode;
  /** 右侧额外内容 */
  extra?: React.ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * Collapse 箭头位置
 */
export type CollapseArrowPosition = 'right' | 'left';

/**
 * Collapse 变体类型
 */
export type CollapseVariant = 'default' | 'bordered' | 'ghost';

/**
 * Collapse 组件 Props
 */
export interface PimaCollapseProps {
  /** 折叠面板子项数据 */
  items: CollapseItem[];
  /** 当前展开的面板 key（受控） */
  activeKeys?: string[];
  /** 默认展开的面板 key（非受控） */
  defaultActiveKeys?: string[];
  /** 展开/收起回调 */
  onChange?: (activeKeys: string[]) => void;
  /** 是否手风琴模式（每次只展开一个） */
  accordion?: boolean;
  /** 变体 */
  variant?: CollapseVariant;
  /** 尺寸 */
  size?: ComponentSize;
  /** 箭头位置 */
  arrowPosition?: CollapseArrowPosition;
  /** 是否全部禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

// ========== Message 组件类型 ==========

/**
 * Message 类型
 */
export type MessageType = "success" | "error" | "warning" | "info" | "loading";

/**
 * Message 组件 Props
 */
export interface PimaMessageProps {
  /** 消息类型 */
  type?: MessageType;
  /** 消息内容 */
  content: string;
  /** 自动关闭时间（毫秒），0 为不关闭 */
  duration?: number;
  /** 关闭回调 */
  onClose?: () => void;
  /** 是否可手动关闭 */
  closable?: boolean;
  /** 自定义图标 */
  icon?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
}

/**
 * Message 实例数据
 */
export interface MessageInstance {
  /** 唯一标识 */
  id: string;
  /** 消息类型 */
  type: MessageType;
  /** 消息内容 */
  content: string;
  /** 自动关闭时间 */
  duration?: number;
  /** 是否可关闭 */
  closable?: boolean;
  /** 自定义图标 */
  icon?: React.ReactNode;
}