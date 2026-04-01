import { PimaSwitch } from "./components";
import { useTheme } from "./hooks/useTheme";
import { AnchorNav } from "./components/AnchorNav";
import type { AnchorNavGroup } from "./components/AnchorNav";
import { GeneralSections } from "./components/sections/GeneralSections";
import { DataEntryBundleA } from "./components/sections/DataEntryBundleA";
import { DataEntryBundleB } from "./components/sections/DataEntryBundleB";
import { DataEntryBundleC } from "./components/sections/DataEntryBundleC";
import { NavDisplayBundle } from "./components/sections/NavDisplayBundle";
import { DisplayFeedbackBundleA } from "./components/sections/DisplayFeedbackBundleA";
import { DisplayFeedbackBundleB } from "./components/sections/DisplayFeedbackBundleB";
import { FeaturesSection } from "./components/sections/FeaturesSection";

const navGroups: AnchorNavGroup[] = [
  {
    category: "通用 General",
    items: [
      { id: "section-button", label: "Button 按钮" },
      { id: "section-divider", label: "Divider 分割线" },
    ],
  },
  {
    category: "数据录入 Data Entry",
    items: [
      { id: "section-checkbox", label: "Checkbox 复选" },
      { id: "section-datepicker", label: "DatePicker 日期" },
      { id: "section-form", label: "Form 表单" },
      { id: "section-input", label: "Input 输入框" },
      { id: "section-input-number", label: "InputNumber 数字输入" },
      { id: "section-radio", label: "Radio 单选" },
      { id: "section-search", label: "Search 搜索" },
      { id: "section-selector", label: "Selector 选择器" },
      { id: "section-slider", label: "Slider 滑动输入条" },
      { id: "section-switch", label: "Switch 开关" },
      { id: "section-textarea", label: "Textarea 文本域" },
      { id: "section-timepicker", label: "TimePicker 时间" },
      { id: "section-tree-selector", label: "TreeSelector 树选择" },
      { id: "section-upload", label: "Upload 上传" },
    ],
  },
  {
    category: "数据展示 Data Display",
    items: [
      { id: "section-badge", label: "Badge 徽标数" },
      { id: "section-card", label: "Card 卡片" },
      { id: "section-charts", label: "Charts 图表" },
      { id: "section-collapse", label: "Collapse 折叠" },
      { id: "section-popover", label: "Popover 气泡卡片" },
      { id: "section-statistic", label: "Statistic 统计数值" },
      { id: "section-table", label: "Table 表格" },
      { id: "section-tabs", label: "Tabs 标签页" },
      { id: "section-tag", label: "Tag 标签" },
      { id: "section-timeline", label: "Timeline 时间轴" },
      { id: "section-tooltip", label: "Tooltip 提示" },
    ],
  },
  {
    category: "反馈 Feedback",
    items: [
      { id: "section-drawer", label: "Drawer 抽屉" },
      { id: "section-loading", label: "Loading 加载" },
      { id: "section-message", label: "Message 消息" },
      { id: "section-modal", label: "Modal 对话框" },
      { id: "section-notification", label: "Notification 通知" },
      { id: "section-progress", label: "Progress 进度" },
    ],
  },
  {
    category: "导航 Navigation",
    items: [
      { id: "section-anchor", label: "Anchor 锚点" },
      { id: "section-breadcrumb", label: "Breadcrumb 面包屑" },
      { id: "section-menu", label: "Menu 菜单" },
      { id: "section-pagination", label: "Pagination 分页" },
    ],
  },
];

export default function App() {
  const { theme, toggleTheme } = useTheme("teacher");

  return (
    <div className="app-container">
      <div className="app-layout">
        <AnchorNav groups={navGroups} />
        <div className="app-content">
          <div className="app-header" style={{ order: 0 }}>
            <div className="app-header__content">
              <div>
                <h1 className="app-header__title">WEMUST UI组件库</h1>
                <p className="app-header__subtitle">基于 Radix UI 构建的组件演示站</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <div className="app-header__theme-switch">
                  <span className={`app-header__theme-label ${theme === "teacher" ? "app-header__theme-label--active" : ""}`}>WM-T</span>
                  <PimaSwitch checked={theme !== "teacher"} onCheckedChange={toggleTheme} size="sm" />
                  <span className={`app-header__theme-label ${theme !== "teacher" ? "app-header__theme-label--active" : ""}`}>WM-S</span>
                </div>
              </div>
            </div>
          </div>

          <GeneralSections />
          <DataEntryBundleA />
          <DataEntryBundleB />
          <DataEntryBundleC />
          <NavDisplayBundle />
          <DisplayFeedbackBundleA />
          <DisplayFeedbackBundleB />
          <FeaturesSection />
        </div>
      </div>
    </div>
  );
}
