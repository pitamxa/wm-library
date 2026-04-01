import React, { useState } from "react";
import {
  PimaTable, PimaLoading, PimaCollapse, PimaUpload,
  PimaTimePicker, PimaTimeline, PimaBadge, PimaButton,
  PimaInput, PimaSelector, PimaDatePicker, PimaTextarea,
  PimaSwitch,
} from "../index";
import { WMDrawer } from "../WMDrawer";
import { WMDivider } from "../WMDivider";
import {
  InteractiveBarChart, InteractiveLineChart,
  InteractiveAreaChart, InteractivePieChart,
} from "../PimaCharts";
import type { UploadFile } from "../index";
import {
  allAgentData, agentTableColumns,
  fixedColData, fixedColColumns,
  aiPlatformData, aiPlatformColumns, aiModelColumns,
  treeTableData, treeTableColumns,
} from "./showcase-data";
import type {
  AIPlatformRecord, AIPlatformModelRecord, TreeTableRecord,
} from "./showcase-data";

export function DisplayFeedbackBundleB() {
  // Table state
  const [tablePage, setTablePage] = useState(1);
  const [tablePageSize, setTablePageSize] = useState(10);
  const [selectedAgentKeys, setSelectedAgentKeys] = useState<React.Key[]>([]);
  const [treeSelectedKeys, setTreeSelectedKeys] = useState<React.Key[]>(["1-2-1"]);
  const currentTableData = React.useMemo(() => {
    const startIndex = (tablePage - 1) * tablePageSize;
    return allAgentData.slice(startIndex, startIndex + tablePageSize);
  }, [tablePage, tablePageSize]);
  // Drawer states
  const [drawerBasic, setDrawerBasic] = useState<boolean>(false);
  const [drawerName, setDrawerName] = useState<string>("");
  const [drawerEmail, setDrawerEmail] = useState<string>("");
  const [drawerRole, setDrawerRole] = useState<string>("");
  const [drawerDate, setDrawerDate] = useState<Date | undefined>(undefined);
  const [drawerRemark, setDrawerRemark] = useState<string>("");
  // Upload states
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([
    { uid: "demo-1", name: "Pima Design_2024.doc", status: "idle" },
    { uid: "demo-2", name: "Pima Design_2024.doc", status: "uploading", percent: 60 },
    { uid: "demo-3", name: "Pima Design_2024.doc", status: "success", percent: 100 },
    { uid: "demo-4", name: "Pima Design_2024.doc", status: "error", errorMessage: "上传失败" },
  ]);
  const [uploadFiles2, setUploadFiles2] = useState<UploadFile[]>([]);
  // TimePicker states
  const [tpBasic, setTpBasic] = useState<Date | undefined>(undefined);
  const [tpDisabledVal, setTpDisabledVal] = useState<Date | undefined>(new Date());
  const [tpWithValue, setTpWithValue] = useState<Date | undefined>(new Date());
  const [tpNoSeconds, setTpNoSeconds] = useState<Date | undefined>(undefined);
  const [tpError, setTpError] = useState<Date | undefined>(undefined);
  const [tpSuccess, setTpSuccess] = useState<Date | undefined>(new Date());
  const [tpDisabled, setTpDisabled] = useState<Date | undefined>(new Date());
  // Badge states
  const [badgeCount, setBadgeCount] = useState<number>(67);
  const [dotVisible, setDotVisible] = useState<boolean>(true);
  const [dotColor, setDotColor] = useState<string>("var(--error-2)");

  return (
    <>
      {/* Table Section */}
      <div id="section-table" style={{ marginBottom: "2rem", order: 23 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          表格组件 (Table)
        </h2>
        <div className="app-grid">
          <div className="app-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="app-card__title">经纪人列表 (新样式)</h2>
            <div className="app-card__content">
              <PimaTable columns={agentTableColumns} dataSource={currentTableData} rowKey="id" rowSelection={{ selectedRowKeys: selectedAgentKeys, onChange: (keys) => setSelectedAgentKeys(keys) }} scroll={{ y: 480 }} pagination={{ total: allAgentData.length, current: tablePage, pageSize: tablePageSize, showSizeChanger: true, showQuickJumper: true, onChange: (page, size) => { setTablePage(page); setTablePageSize(size); } }} />
            </div>
          </div>
          <div className="app-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="app-card__title">固定操作列 (Fixed Action Column)</h2>
            <div className="app-card__content">
              <PimaTable columns={fixedColColumns} dataSource={fixedColData} rowKey="id" scroll={{ x: 1500 }} pagination={false} />
            </div>
          </div>
          <div className="app-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="app-card__title">嵌套子表格 (Expandable Nested Table)</h2>
            <div className="app-card__content">
              <PimaTable<AIPlatformRecord> columns={aiPlatformColumns} dataSource={aiPlatformData} rowKey="id" pagination={false} expandable={{ expandedRowRender: (record) => (<PimaTable<AIPlatformModelRecord> columns={aiModelColumns} dataSource={record.models} rowKey="id" pagination={false} />), rowExpandable: (record) => record.models.length > 0, defaultExpandedRowKeys: ["platform-2"] }} />
            </div>
          </div>
          <div className="app-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="app-card__title">树形数据展示 (Tree Data Table)</h2>
            <div className="app-card__content">
              <PimaTable<TreeTableRecord> columns={treeTableColumns} dataSource={treeTableData} rowKey="key" pagination={false} rowSelection={{ selectedRowKeys: treeSelectedKeys, onChange: (keys) => setTreeSelectedKeys(keys) }} treeProps={{ defaultExpandAll: true }} />
            </div>
          </div>
        </div>
      </div>

      {/* Loading Section */}
      <div id="section-loading" style={{ marginBottom: "2rem", order: 29 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          加载组件 (Loading)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础状态</h2>
            <div className="app-card__content">
              <PimaLoading />
              <PimaLoading text="加载中..." />
              <PimaLoading text="竖向排列" orientation="vertical" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">尺寸变体</h2>
            <div className="app-card__content">
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontSize: "12px", width: "60px", color: "var(--text-secondary)" }}>Small</span><PimaLoading size="sm" /></div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontSize: "12px", width: "60px", color: "var(--text-secondary)" }}>Default</span><PimaLoading size="default" /></div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontSize: "12px", width: "60px", color: "var(--text-secondary)" }}>Large</span><PimaLoading size="lg" /></div>
              </div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">按钮加载</h2>
            <div className="app-card__content">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <PimaButton loading>默认加载</PimaButton>
                <PimaButton loading variant="primary">Primary 加载</PimaButton>
                <PimaButton loading variant="secondary">Secondary 加载</PimaButton>
                <PimaButton loading variant="outline">Outline 加载</PimaButton>
                <PimaButton loading variant="ghost">Ghost 加载</PimaButton>
                <PimaButton loading variant="danger">Danger 加载</PimaButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div id="section-charts" style={{ marginBottom: "2rem", order: 19 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          数据可视化 (Charts)
        </h2>
        <div className="app-grid">
          <div className="app-card"><h2 className="app-card__title">柱状图 (Bar Chart)</h2><div className="app-card__content"><InteractiveBarChart /></div></div>
          <div className="app-card"><h2 className="app-card__title">折线图 (Line Chart)</h2><div className="app-card__content"><InteractiveLineChart /></div></div>
          <div className="app-card"><h2 className="app-card__title">面积图 (Area Chart)</h2><div className="app-card__content"><InteractiveAreaChart /></div></div>
          <div className="app-card"><h2 className="app-card__title">饼图 (Pie Chart)</h2><div className="app-card__content"><InteractivePieChart /></div></div>
        </div>
      </div>

      {/* Collapse Section */}
      <div id="section-collapse" style={{ marginBottom: "2rem", order: 20 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          {"折叠面板组件 (Collapse)"}
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">{"基础用法"}</h2>
            <div className="app-card__content">
              <PimaCollapse items={[{ key: "1", title: "什么是 Pima 组件库？", children: <p>Pima 组件库是基于 Radix UI 和 shadcn 构建的一套完整的 React 组件库，专注于提供高质量、可访问的用户界面组件。</p> }, { key: "2", title: "如何开始使用？", children: <p>只需导入所需组件即可使用。所有组件均支持主题切换和多种尺寸变体。</p> }, { key: "3", title: "支持哪些主题？", children: <p>目前支持 Teacher 和 Student 两种主题模式，可通过 CSS 变量进行自定义配置。</p> }]} defaultActiveKeys={["1"]} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">{"手风琴模式"}</h2>
            <div className="app-card__content">
              <PimaCollapse accordion items={[{ key: "a", title: "第一项", children: <p>手风琴模式下，每次只能展开一个面板，展开新面板时会自动收起上一个。</p> }, { key: "b", title: "第二项", children: <p>这是第二个面板的内容。请注意展开此面板时，其他面板会自动关闭。</p> }, { key: "c", title: "第三项", children: <p>这是第三个面板的内容。手风琴模式非常适合 FAQ 场景。</p> }]} defaultActiveKeys={["a"]} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">{"禁用状态"}</h2>
            <div className="app-card__content">
              <PimaCollapse items={[{ key: "dis1", title: "可展开的面板", children: <p>这个面板可以正常展开和收起。</p> }, { key: "dis2", title: "禁用的面板", disabled: true, children: <p>这个面板已被禁用，无法展开。</p> }, { key: "dis3", title: "另一个可用面板", children: <p>这个面板也可以正常操作。</p> }]} defaultActiveKeys={["dis1"]} />
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Section */}
      <div id="section-drawer" style={{ marginBottom: "2rem", order: 28 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          {"抽屉组件 (Drawer)"}
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">{"基础用法"}</h2>
            <div className="app-card__content">
              <PimaButton onClick={() => setDrawerBasic(true)}>{"打开抽屉"}</PimaButton>
              <WMDrawer open={drawerBasic} onClose={() => setDrawerBasic(false)} title={"新建用户"} onOk={() => setDrawerBasic(false)} onCancel={() => setDrawerBasic(false)} okText={"提交"}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-24)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-24) var(--spacing-16)" }}>
                    <PimaInput label={"姓名"} required size="sm" placeholder={"请输入姓名"} value={drawerName} onValueChange={setDrawerName} />
                    <PimaInput label={"邮箱"} required size="sm" placeholder={"请输入邮箱"} value={drawerEmail} onValueChange={setDrawerEmail} />
                    <PimaSelector label={"角色"} required size="sm" placeholder={"请选择角色"} value={drawerRole} onValueChange={setDrawerRole} options={[{ value: "admin", label: "管理员" }, { value: "teacher", label: "教师" }, { value: "student", label: "学生" }]} />
                    <PimaDatePicker label={"入职日期"} size="sm" placeholder={"请选择日期"} date={drawerDate} onDateChange={setDrawerDate} />
                  </div>
                  <PimaTextarea label={"备注"} size="sm" placeholder={"请输入备注信息"} value={drawerRemark} onValueChange={setDrawerRemark} rows={3} />
                </div>
              </WMDrawer>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div id="section-upload" style={{ marginBottom: "2rem", order: 16 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          {"上传组件 (Upload)"}
        </h2>
        <div className="app-grid">
          <div className="app-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="app-card__title">{"基础上传（状态演示）"}</h2>
            <div className="app-card__content" style={{ maxWidth: "560px" }}>
              <PimaUpload fileList={uploadFiles} onFileListChange={setUploadFiles} hint="文档大小不能超过 10MB" />
            </div>
          </div>
          <div className="app-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="app-card__title">{"交互式上传（点击按钮选择文件）"}</h2>
            <div className="app-card__content" style={{ maxWidth: "560px" }}>
              <PimaUpload fileList={uploadFiles2} onFileListChange={setUploadFiles2} hint="支持 .doc, .pdf, .xlsx 格式，单个文件不超过 10MB" accept=".doc,.docx,.pdf,.xlsx,.xls" maxSize={10} maxCount={5} />
            </div>
          </div>
        </div>
      </div>

      {/* TimePicker Section */}
      <div id="section-timepicker" style={{ marginBottom: "2rem", order: 14 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          时间选择器组件 (TimePicker)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础用法</h2>
            <div className="app-card__content">
              <PimaTimePicker label="默认时间选择" value={tpBasic} onChange={setTpBasic} placeholder="选择时间" size="sm" />
              <PimaTimePicker label="已选择" value={tpWithValue} onChange={setTpWithValue} helperText="已选择一个时间" size="sm" />
              <PimaTimePicker label="禁用状态" value={tpDisabledVal} onChange={setTpDisabledVal} disabled={true} helperText="时间选择已禁用" size="sm" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">时分模式（不显示秒）</h2>
            <div className="app-card__content">
              <PimaTimePicker label="时分选择" value={tpNoSeconds} onChange={setTpNoSeconds} showSeconds={false} placeholder="HH:mm" helperText="showSeconds={false}，仅选择时和分" size="sm" />
              <PimaTimePicker label="时分（已填写）" value={tpWithValue} onChange={setTpWithValue} showSeconds={false} helperText="不显示秒列" size="sm" />
              <PimaTimePicker label="时分（禁用）" value={tpDisabled} onChange={setTpDisabled} showSeconds={false} disabled={true} helperText="时分模式已禁用" size="sm" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">验证状态</h2>
            <div className="app-card__content">
              <PimaTimePicker label="错误状态" value={tpError} onChange={setTpError} error={true} required helperText="请选择一个有效的时间" size="sm" />
              <PimaTimePicker label="成功状态" value={tpSuccess} onChange={setTpSuccess} success={true} helperText="验证通过" size="sm" />
              <PimaTimePicker label="必填校验" value={tpError} onChange={setTpError} required error={!tpError} success={!!tpError} helperText={tpError ? "验证通过！" : "此字段为必填项"} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div id="section-timeline" style={{ marginBottom: "2rem", order: 26 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          时间轴组件 (Timeline)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础用法</h2>
            <div className="app-card__content">
              <PimaTimeline items={[{ key: "1", title: "创建项目", description: "初始化项目结构，配置基础环境", time: "2026-01-10" }, { key: "2", title: "开发阶段", description: "完成核心功能模块开发与单元测试", time: "2026-02-01" }, { key: "3", title: "测试与修复", description: "QA 测试，修复已知问题", time: "2026-02-20" }, { key: "4", title: "正式上线", description: "部署至生产环境，发布 v1.0.0", time: "2026-03-01" }]} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">状态变体</h2>
            <div className="app-card__content">
              <PimaTimeline items={[{ key: "s1", status: "success", title: "审核通过", description: "申请已通过，等待处理", time: "09:00" }, { key: "s2", status: "info", title: "处理中", description: "正在分配资源处理您的请求", time: "10:30" }, { key: "s3", status: "warning", title: "需要补充材料", description: "请在 3 个工作日内提交证明文件", time: "11:00" }, { key: "s4", status: "error", title: "支付失败", description: "余额不足，请充值后重试", time: "11:45" }, { key: "s5", status: "default", title: "待处理", description: "等待工作人员审核", time: "待定" }]} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">业务用法</h2>
            <div className="app-card__content">
              <div style={{ background: "var(--white)", borderRadius: "var(--radius-8)", overflow: "hidden" }}>
                <div style={{ padding: "var(--spacing-16) var(--spacing-20)" }}>
                  <span style={{ color: "var(--primary-1-default)", fontFamily: "var(--font-family-base)", fontSize: "var(--fontsize-18)", lineHeight: "var(--lineheight-26)" }}>办理记录</span>
                </div>
                <div style={{ height: "1px", background: "var(--border-secondary)", margin: "0 var(--spacing-20)" }} />
                <div style={{ padding: "var(--spacing-20)" }}>
                  <PimaTimeline className="wm-timeline--plain-title" items={[{ key: "b1", status: "default", title: "申请", description: "张丽芬提交　2024-11-25 09:06:30" }, { key: "b2", status: "success", title: "校内导师审核", description: "马辉审核　2024-11-25 09:06:30" }]} />
                </div>
              </div>
            </div>
          </div>
          <div className="app-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="app-card__title">左右交替模式 (alternate)</h2>
            <div className="app-card__content">
              <PimaTimeline mode="alternate" items={[{ key: "a1", status: "success", title: "项目立项", description: "完成需求评审，正式立项", time: "2026 Q1" }, { key: "a2", status: "info", title: "设计阶段", description: "UI/UX 设计稿确认，完成原型验收", time: "2026 Q1" }, { key: "a3", status: "success", title: "开发阶段", description: "前后端联调完成，通过 QA 测试", time: "2026 Q2" }, { key: "a4", status: "warning", title: "灰度发布", description: "10% 流量灰度中，观察指标", time: "2026 Q2" }, { key: "a5", status: "default", title: "全量上线", description: "计划 2026 Q3 全量开放", time: "2026 Q3（计划）" }]} />
            </div>
          </div>
        </div>
      </div>

      {/* Badge Section */}
      <div id="section-badge" style={{ marginBottom: "2rem", order: 17 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          徽标数组件 (Badge)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">圆点徽标</h2>
            <div className="app-card__content">
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-16)", fontFamily: "var(--font-family-base)" }}>用于简单的消息提醒，不显示具体数量，支持多种颜色语义。</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--spacing-32)", marginBottom: "var(--spacing-24)" }}>
                {[{ color: undefined, label: "错误" }, { color: "var(--primary-1-default)", label: "主色" }, { color: "var(--success-1)", label: "成功" }, { color: "var(--warning-2)", label: "警告" }].map(({ color, label }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-8)" }}>
                    <PimaBadge dot color={color}><div style={{ width: 44, height: 44, borderRadius: "var(--radius-8)", background: "var(--fill-main)" }} /></PimaBadge>
                    <span style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", fontFamily: "var(--font-family-base)" }}>{label}</span>
                  </div>
                ))}
              </div>
              <WMDivider spacing="md" />
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-secondary)", marginBottom: "var(--spacing-12)", fontFamily: "var(--font-family-base)" }}>可交互变体</p>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-32)" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-8)" }}>
                  <PimaBadge dot color={dotColor} hidden={!dotVisible}><div style={{ width: 52, height: 52, borderRadius: "var(--radius-8)", background: "var(--fill-main)" }} /></PimaBadge>
                  <span style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", fontFamily: "var(--font-family-base)" }}>{dotVisible ? "显示中" : "已隐藏"}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-12)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-8)" }}>
                    <span style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", fontFamily: "var(--font-family-base)", whiteSpace: "nowrap" }}>颜色</span>
                    {[{ value: "var(--error-2)", bg: "var(--error-2)" }, { value: "var(--primary-1-default)", bg: "var(--primary-1-default)" }, { value: "var(--success-1)", bg: "var(--success-1)" }, { value: "var(--warning-2)", bg: "var(--warning-2)" }].map(({ value, bg }) => (
                      <button key={value} className={`wm-badge-color-swatch${dotColor === value ? " wm-badge-color-swatch--active" : ""}`} style={{ backgroundColor: bg }} onClick={() => setDotColor(value)} aria-label="选择颜色" />
                    ))}
                  </div>
                  <PimaSwitch checked={dotVisible} onCheckedChange={setDotVisible} label="显示圆点" size="sm" />
                </div>
              </div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">数字徽标</h2>
            <div className="app-card__content">
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-16)", fontFamily: "var(--font-family-base)" }}>显示具体数量，超过封顶值时显示 99+。</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--spacing-32)", marginBottom: "var(--spacing-24)" }}>
                {[{ count: 0, showZero: true as true, label: "showZero" }, { count: 8, label: "8" }, { count: 120, max: 99, label: "99+" }].map(({ count, showZero, max, label }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-8)" }}>
                    <PimaBadge count={count} showZero={showZero} max={max}><div style={{ width: 44, height: 44, borderRadius: "var(--radius-8)", background: "var(--fill-main)" }} /></PimaBadge>
                    <span style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", fontFamily: "var(--font-family-base)" }}>{label}</span>
                  </div>
                ))}
              </div>
              <WMDivider spacing="md" />
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-secondary)", marginBottom: "var(--spacing-12)", fontFamily: "var(--font-family-base)" }}>可交互变体</p>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-32)" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-8)" }}>
                  <PimaBadge count={badgeCount}><div style={{ width: 52, height: 52, borderRadius: "var(--radius-8)", background: "var(--fill-main)" }} /></PimaBadge>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-12)" }}>
                  <span style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", fontFamily: "var(--font-family-base)", whiteSpace: "nowrap" }}>数量</span>
                  <PimaButton size="sm" variant="primary" onClick={() => setBadgeCount((prev) => Math.min(prev + 1, 999))}>增加</PimaButton>
                  <PimaButton size="sm" variant="secondary" onClick={() => setBadgeCount(0)}>重置</PimaButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
