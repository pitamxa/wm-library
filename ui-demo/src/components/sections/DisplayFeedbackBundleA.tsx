import React, { useState } from "react";
import {
  PimaTag, PimaTooltip, PimaPopover, PimaNotification,
  PimaMessage, PimaMessageContainer, PimaProgress,
  PimaButton, PimaInput, PimaSelector, PimaSwitch,
  PimaTextarea, PimaTabs, PimaStatistic, PimaCountdown,
  PimaStatisticGroup, PimaCheckbox, PimaRadio, PimaDatePicker,
} from "../index";
import { WMModal } from "../WMModal";
import type { MessageInstance } from "../index";
import {
  Tag, CheckCircle, Bell, X, Star, User, HelpCircle,
  Info, Download, Mail,
} from "lucide-react";

export function DisplayFeedbackBundleA() {
  // Modal states
  const [modalBasic, setModalBasic] = useState<boolean>(false);
  const [modalBordered, setModalBordered] = useState<boolean>(false);
  const [modalSuccess, setModalSuccess] = useState<boolean>(false);
  const [modalError, setModalError] = useState<boolean>(false);
  const [modalWarning, setModalWarning] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<boolean>(false);
  const [modalNoCancel, setModalNoCancel] = useState<boolean>(false);
  const [modalContentOnly, setModalContentOnly] = useState<boolean>(false);
  const [modalForm, setModalForm] = useState<boolean>(false);
  const [modalFormName, setModalFormName] = useState("");
  const [modalFormEmail, setModalFormEmail] = useState("");
  const [modalFormRole, setModalFormRole] = useState("");
  const [modalFormNotify, setModalFormNotify] = useState(false);
  const [modalFormBio, setModalFormBio] = useState("");
  // Message states
  const [messages, setMessages] = useState<MessageInstance[]>([]);
  const addMessage = (type: MessageInstance["type"], content: string, closable = false) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setMessages((prev) => [...prev, { id, type, content, duration: 3000, closable }]);
  };
  const removeMessage = (id: string) => { setMessages((prev) => prev.filter((m) => m.id !== id)); };
  // Progress states
  const [progress1, setProgress1] = useState<number>(30);
  const [progress2, setProgress2] = useState<number>(60);
  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formDob, setFormDob] = useState<Date | undefined>(undefined);
  const [formGender, setFormGender] = useState("male");
  const [formBio, setFormBio] = useState("");
  const [formNotifications, setFormNotifications] = useState(false);
  const [formInterests, setFormInterests] = useState<string[]>([]);
  const [formTerms, setFormTerms] = useState<string[]>([]);
  // Horizontal form states
  const [hFormInput, setHFormInput] = useState("");
  const [hFormTextarea, setHFormTextarea] = useState("");
  const [hFormSelect, setHFormSelect] = useState("");
  const [hFormDate, setHFormDate] = useState<Date | undefined>(undefined);
  const [hFormRadio, setHFormRadio] = useState("");
  const [hFormCheckbox, setHFormCheckbox] = useState<string[]>([]);

  return (
    <>
      {/* Tag Section */}
      <div id="section-tag" style={{ marginBottom: "2rem", order: 25 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          标签组件 (Tag)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础变体</h2>
            <div className="app-card__content" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <PimaTag variant="primary">Primary</PimaTag>
              <PimaTag variant="secondary">Secondary</PimaTag>
              <PimaTag variant="success">Success</PimaTag>
              <PimaTag variant="warning">Warning</PimaTag>
              <PimaTag variant="error">Error</PimaTag>
              <PimaTag variant="info">Info</PimaTag>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Outlined 样式</h2>
            <div className="app-card__content" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <PimaTag variant="primary" tagStyle="outlined">Primary</PimaTag>
              <PimaTag variant="secondary" tagStyle="outlined">Secondary</PimaTag>
              <PimaTag variant="success" tagStyle="outlined">Success</PimaTag>
              <PimaTag variant="warning" tagStyle="outlined">Warning</PimaTag>
              <PimaTag variant="error" tagStyle="outlined">Error</PimaTag>
              <PimaTag variant="info" tagStyle="outlined">Info</PimaTag>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Light 样式</h2>
            <div className="app-card__content" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <PimaTag variant="primary" tagStyle="light">Primary</PimaTag>
              <PimaTag variant="secondary" tagStyle="light">Secondary</PimaTag>
              <PimaTag variant="success" tagStyle="light">Success</PimaTag>
              <PimaTag variant="warning" tagStyle="light">Warning</PimaTag>
              <PimaTag variant="error" tagStyle="light">Error</PimaTag>
              <PimaTag variant="info" tagStyle="light">Info</PimaTag>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">不同尺寸</h2>
            <div className="app-card__content" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
              <PimaTag size="sm" variant="primary">小尺寸</PimaTag>
              <PimaTag size="default" variant="primary">默认尺寸</PimaTag>
              <PimaTag size="lg" variant="primary">大尺寸</PimaTag>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">可关闭标签</h2>
            <div className="app-card__content" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <PimaTag variant="primary" closable onClose={() => console.log("关闭标签")}>可关闭</PimaTag>
              <PimaTag variant="success" closable tagStyle="outlined">成功标签</PimaTag>
              <PimaTag variant="warning" closable>警告标签</PimaTag>
              <PimaTag variant="error" closable tagStyle="outlined">错误标签</PimaTag>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">带图标标签</h2>
            <div className="app-card__content" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <PimaTag variant="primary" icon={<Tag size={14} />}>标签</PimaTag>
              <PimaTag variant="success" icon={<CheckCircle size={14} />}>成功</PimaTag>
              <PimaTag variant="warning" icon={<Bell size={14} />}>警告</PimaTag>
              <PimaTag variant="error" icon={<X size={14} />}>错误</PimaTag>
              <PimaTag variant="info" icon={<Star size={14} />} tagStyle="outlined">收藏</PimaTag>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">可点击标签</h2>
            <div className="app-card__content" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <PimaTag variant="primary" onClick={() => console.log("点击")}>可点击</PimaTag>
              <PimaTag variant="secondary" onClick={() => console.log("点击")} icon={<User size={14} />}>用户</PimaTag>
              <PimaTag variant="success" onClick={() => console.log("点击")} tagStyle="outlined">成功</PimaTag>
              <PimaTag variant="info" onClick={() => console.log("点击")} closable>Info</PimaTag>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">自定义颜色</h2>
            <div className="app-card__content" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <PimaTag color="#8B5CF6">紫色</PimaTag>
              <PimaTag color="#EC4899" tagStyle="outlined">粉色</PimaTag>
              <PimaTag color="#06B6D4" closable>青色</PimaTag>
              <PimaTag color="#F59E0B" icon={<Star size={14} />}>金色</PimaTag>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Section */}
      <div id="section-modal" style={{ marginBottom: "2rem", order: 31 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          弹窗组件 (Modal)
        </h2>
        <h3 style={{ marginBottom: "1rem", marginTop: "1rem", color: "var(--text-secondary)" }}>基础示例</h3>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础弹窗</h2>
            <div className="app-card__content">
              <PimaButton variant="primary" onClick={() => setModalBasic(true)}>打开基础弹窗</PimaButton>
              <WMModal open={modalBasic} onClose={() => setModalBasic(false)} title="基础弹窗" onOk={() => { console.log("确认"); setModalBasic(false); }}>
                <p>这是一个基础的弹窗示例，包含标题栏、内容区和按钮区。</p>
                <p style={{ marginTop: "12px" }}>支持点击遮罩层关闭，也可以按 ESC 键关闭。</p>
              </WMModal>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Header / Footer 分割线</h2>
            <div className="app-card__content">
              <PimaButton variant="primary" onClick={() => setModalBordered(true)}>打开带分割线弹窗</PimaButton>
              <WMModal open={modalBordered} onClose={() => setModalBordered(false)} title="带分割线弹窗" bordered onOk={() => setModalBordered(false)} okText="确定" cancelText="取消">
                <p>Header 下方有分割线，Footer 上方有分割线，适用于内容较多、需要明确区隔标题与操作区的场景。</p>
              </WMModal>
            </div>
          </div>
        </div>
        <h3 style={{ marginBottom: "1rem", marginTop: "2rem", color: "var(--text-secondary)" }}>状态示例</h3>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">成功状态</h2>
            <div className="app-card__content">
              <PimaButton variant="primary" onClick={() => setModalSuccess(true)}>打开成功弹窗</PimaButton>
              <WMModal open={modalSuccess} onClose={() => setModalSuccess(false)} title="操作成功" status="success" onOk={() => setModalSuccess(false)} okText="知道了" showCancelButton={false}>
                <p>您的操作已成功完成！数据已保存。</p>
              </WMModal>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">错误状态</h2>
            <div className="app-card__content">
              <PimaButton variant="primary" onClick={() => setModalError(true)}>打开错误弹窗</PimaButton>
              <WMModal open={modalError} onClose={() => setModalError(false)} title="操作失败" status="error" onOk={() => setModalError(false)} okText="重试" cancelText="取消">
                <p>操作失败，请检查网络连接后重试。</p>
                <p style={{ marginTop: "8px", color: "var(--text-tertiary)" }}>错误代码：ERR_NETWORK_001</p>
              </WMModal>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">警告状态</h2>
            <div className="app-card__content">
              <PimaButton variant="primary" onClick={() => setModalWarning(true)}>打开警告弹窗</PimaButton>
              <WMModal open={modalWarning} onClose={() => setModalWarning(false)} title="警告提示" status="warning" onOk={() => setModalWarning(false)} okText="确认删除" cancelText="取消">
                <p>您确定要删除这条记录吗？此操作不可撤销。</p>
              </WMModal>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">信息状态</h2>
            <div className="app-card__content">
              <PimaButton variant="primary" onClick={() => setModalInfo(true)}>打开信息弹窗</PimaButton>
              <WMModal open={modalInfo} onClose={() => setModalInfo(false)} title="提示信息" status="info" onOk={() => setModalInfo(false)} okText="知道了" showCancelButton={false}>
                <p>系统将在 2025年11月20日 进行维护，届时服务将暂时不可用。</p>
                <p style={{ marginTop: "8px" }}>预计维护时间：2小时</p>
              </WMModal>
            </div>
          </div>
        </div>
        <h3 style={{ marginBottom: "1rem", marginTop: "2rem", color: "var(--text-secondary)" }}>功能示例</h3>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">只有确认按钮</h2>
            <div className="app-card__content">
              <PimaButton variant="primary" onClick={() => setModalNoCancel(true)}>只有确认</PimaButton>
              <WMModal open={modalNoCancel} onClose={() => setModalNoCancel(false)} title="通知" showCancelButton={false} onOk={() => setModalNoCancel(false)} okText="我知道了">
                <p>这是一个只有确认按钮的弹窗，通常用于通知场景。</p>
              </WMModal>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">纯内容弹窗</h2>
            <div className="app-card__content">
              <PimaButton variant="primary" onClick={() => setModalContentOnly(true)}>纯内容</PimaButton>
              <WMModal open={modalContentOnly} onClose={() => setModalContentOnly(false)} title="产品详情" contentOnly={true} maskClosable={true}>
                <div style={{ padding: "16px 0" }}>
                  <h3 style={{ marginBottom: "12px", color: "var(--text-main)" }}>Premium Plan</h3>
                  <p style={{ marginBottom: "8px", color: "var(--text-secondary)" }}>专为团队设计的高级方案</p>
                  <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)" }}><li>无限用户数</li><li>高级数据分析</li><li>优先技术支持</li><li>自定义集成</li></ul>
                  <p style={{ marginTop: "16px", color: "var(--text-tertiary)", fontSize: "12px" }}>点击遮罩层关闭此弹窗</p>
                </div>
              </WMModal>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">表单弹窗</h2>
            <div className="app-card__content">
              <PimaButton variant="primary" onClick={() => setModalForm(true)}>打开表单弹窗</PimaButton>
              <WMModal open={modalForm} onClose={() => setModalForm(false)} title="新建用户" size="large" bordered okText="提交" cancelText="取消" onOk={() => { console.log("提交表单", { name: modalFormName, email: modalFormEmail, role: modalFormRole, notify: modalFormNotify, bio: modalFormBio }); setModalForm(false); setModalFormName(""); setModalFormEmail(""); setModalFormRole(""); setModalFormNotify(false); setModalFormBio(""); }} onCancel={() => { setModalForm(false); setModalFormName(""); setModalFormEmail(""); setModalFormRole(""); setModalFormNotify(false); setModalFormBio(""); }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-20)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-16)" }}>
                    <PimaInput label="用户名" placeholder="请输入用户名" value={modalFormName} onValueChange={setModalFormName} required size="sm" />
                    <PimaInput label="邮箱地址" placeholder="请输入邮箱" value={modalFormEmail} onValueChange={setModalFormEmail} required type="email" size="sm" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-16)" }}>
                    <PimaSelector label="角色" placeholder="请选择角色" value={modalFormRole} onValueChange={setModalFormRole} required size="sm" options={[{ value: "admin", label: "管理员" }, { value: "editor", label: "编辑" }, { value: "viewer", label: "访客" }]} />
                    <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "var(--spacing-4)" }}>
                      <PimaSwitch checked={modalFormNotify} onCheckedChange={setModalFormNotify} label="开启通知" size="sm" />
                    </div>
                  </div>
                  <PimaTextarea label="备注" placeholder="请输入备注信息..." value={modalFormBio} onValueChange={setModalFormBio} maxLength={200} showCount rows={3} size="sm" />
                </div>
              </WMModal>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip Section */}
      <div id="section-tooltip" style={{ marginBottom: "2rem", order: 27 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          Tooltip Component
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">Basic Tooltip</h2>
            <div className="app-card__content" style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
              <PimaTooltip content="This is a tooltip"><PimaButton>Hover me</PimaButton></PimaTooltip>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Placement Variants</h2>
            <div className="app-card__content" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", padding: "40px 0" }}>
              <PimaTooltip content="Top tooltip" placement="top"><PimaButton>Top</PimaButton></PimaTooltip>
              <PimaTooltip content="Bottom tooltip" placement="bottom"><PimaButton>Bottom</PimaButton></PimaTooltip>
              <PimaTooltip content="Left tooltip" placement="left"><PimaButton>Left</PimaButton></PimaTooltip>
              <PimaTooltip content="Right tooltip" placement="right"><PimaButton>Right</PimaButton></PimaTooltip>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Trigger Modes</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ color: "var(--text-secondary)", fontSize: "12px", width: "60px" }}>Hover</span><PimaTooltip content="Hover to show" trigger="hover"><PimaButton>Hover</PimaButton></PimaTooltip></div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ color: "var(--text-secondary)", fontSize: "12px", width: "60px" }}>Click</span><PimaTooltip content="Click to toggle" trigger="click"><PimaButton>Click</PimaButton></PimaTooltip></div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ color: "var(--text-secondary)", fontSize: "12px", width: "60px" }}>Focus</span><PimaTooltip content="Focus to show" trigger="focus"><PimaButton>Focus</PimaButton></PimaTooltip></div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">With Icons</h2>
            <div className="app-card__content" style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
              <PimaTooltip content="Help information"><HelpCircle style={{ cursor: "pointer", color: "var(--text-secondary)" }} size={20} /></PimaTooltip>
              <PimaTooltip content="Important notice"><Info style={{ cursor: "pointer", color: "var(--primary-1-default)" }} size={20} /></PimaTooltip>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Arrow &amp; Disabled</h2>
            <div className="app-card__content" style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
              <PimaTooltip content="With arrow" showArrow={true}><PimaButton>With Arrow</PimaButton></PimaTooltip>
              <PimaTooltip content="Without arrow" showArrow={false}><PimaButton>No Arrow</PimaButton></PimaTooltip>
              <PimaTooltip content="This tooltip is disabled" disabled><PimaButton>Disabled</PimaButton></PimaTooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Popover Section */}
      <div id="section-popover" style={{ marginBottom: "2rem", order: 21 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          Popover 气泡卡片
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础用法</h2>
            <div className="app-card__content" style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center", padding: "60px 0 20px" }}>
              <PimaPopover title="Title" content={<div><div>Content</div><div>Content</div></div>}><PimaButton size="sm">Hover me</PimaButton></PimaPopover>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">弹出位置</h2>
            <div className="app-card__content" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", padding: "60px 0 20px" }}>
              <PimaPopover title="Top" content="这是顶部弹出的气泡卡片内容。" placement="top"><PimaButton variant="outline" size="sm">Top</PimaButton></PimaPopover>
              <PimaPopover title="Bottom" content="这是底部弹出的气泡卡片内容。" placement="bottom"><PimaButton variant="outline" size="sm">Bottom</PimaButton></PimaPopover>
              <PimaPopover title="Left" content="这是左侧弹出的气泡卡片内容。" placement="left"><PimaButton variant="outline" size="sm">Left</PimaButton></PimaPopover>
              <PimaPopover title="Right" content="这是右侧弹出的气泡卡片内容。" placement="right"><PimaButton variant="outline" size="sm">Right</PimaButton></PimaPopover>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">触发方式</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "40px 0 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ color: "var(--text-secondary)", fontSize: "var(--fontsize-12)", width: "60px", fontFamily: "var(--font-family-base)" }}>Hover</span><PimaPopover title="Hover 触发" content="鼠标悬停触发气泡卡片。" trigger="hover"><PimaButton variant="outline" size="sm">Hover</PimaButton></PimaPopover></div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ color: "var(--text-secondary)", fontSize: "var(--fontsize-12)", width: "60px", fontFamily: "var(--font-family-base)" }}>Click</span><PimaPopover title="Click 触发" content="点击触发气泡卡片，再次点击外部关闭。" trigger="click"><PimaButton variant="outline" size="sm">Click</PimaButton></PimaPopover></div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">富文本内容</h2>
            <div className="app-card__content" style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center", padding: "60px 0 20px" }}>
              <PimaPopover title="用户信息" content={<div style={{ display: "flex", flexDirection: "column", gap: "4px" }}><div style={{ display: "flex", justifyContent: "space-between", gap: "24px" }}><span style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-family-base)" }}>姓名</span><span style={{ color: "var(--text-main)", fontFamily: "var(--font-family-base)" }}>张三</span></div><div style={{ display: "flex", justifyContent: "space-between", gap: "24px" }}><span style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-family-base)" }}>角色</span><span style={{ color: "var(--text-main)", fontFamily: "var(--font-family-base)" }}>管理员</span></div><div style={{ display: "flex", justifyContent: "space-between", gap: "24px" }}><span style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-family-base)" }}>状态</span><span style={{ color: "var(--success-1)", fontFamily: "var(--font-family-base)" }}>在线</span></div></div>}><PimaButton variant="outline" size="sm">查看用户</PimaButton></PimaPopover>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Section */}
      <div id="section-notification" style={{ marginBottom: "2rem", order: 32 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          通知组件 (Notification)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">通知类型</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <PimaNotification type="success" title="保存成功" description="您的更改已成功保存到系统中。" duration={0} />
              <PimaNotification type="error" title="提交失败" description="网络连接异常，请稍后重试。" duration={0} />
              <PimaNotification type="warning" title="警告提示" description="您的账户余额不足，请及时充值。" duration={0} />
              <PimaNotification type="info" title="系统通知" description="系统将在今晚22:00进行维护，请提前保存数据。" duration={0} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">仅标题</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <PimaNotification type="success" title="操作成功" duration={0} />
              <PimaNotification type="error" title="操作失败" duration={0} />
              <PimaNotification type="warning" title="注意事项" duration={0} />
              <PimaNotification type="info" title="提示信息" duration={0} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">不可关闭</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <PimaNotification type="success" title="自动保存成功" description="文档已自动保存" closable={false} duration={0} />
              <PimaNotification type="info" title="正在同步" description="数据同步中，请勿关闭页面" closable={false} duration={0} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">自定义图标</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <PimaNotification type="info" title="新消息" description="您有3条未读消息" icon={<Bell style={{ width: "24px", height: "24px", color: "var(--primary-1-default)" }} />} duration={0} />
              <PimaNotification type="success" title="下载完成" description="文件已下载到本地" icon={<Download style={{ width: "24px", height: "24px", color: "var(--success-1)" }} />} duration={0} />
            </div>
          </div>
        </div>
      </div>

      {/* Message Section */}
      <div id="section-message" style={{ marginBottom: "2rem", order: 30 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          全局提示组件 (Message)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">消息类型</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
              <PimaMessage type="success" content="保存成功" duration={0} />
              <PimaMessage type="error" content="提交失败，请重试" duration={0} />
              <PimaMessage type="warning" content="此操作不可撤销" duration={0} />
              <PimaMessage type="info" content="系统将于今晚维护" duration={0} />
              <PimaMessage type="loading" content="加载中..." duration={0} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">可关闭 &amp; 触发弹出</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
              <PimaMessage type="success" content="点击右侧关闭" closable duration={0} />
              <PimaMessage type="error" content="上传失败" closable duration={0} />
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                <PimaButton size="sm" variant="primary" onClick={() => addMessage("success", "操作成功！")}>成功</PimaButton>
                <PimaButton size="sm" variant="danger" onClick={() => addMessage("error", "操作失败")}>错误</PimaButton>
                <PimaButton size="sm" variant="secondary" onClick={() => addMessage("warning", "请注意！")}>警告</PimaButton>
                <PimaButton size="sm" variant="outline" onClick={() => addMessage("info", "提示信息")}>信息</PimaButton>
                <PimaButton size="sm" variant="ghost" onClick={() => addMessage("loading", "加载中...")}>加载</PimaButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PimaMessageContainer messages={messages} onRemove={removeMessage} />

      {/* Progress Section */}
      <div id="section-progress" style={{ marginBottom: "2rem", order: 33 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          进度条组件 (Progress)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">尺寸变��</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div><div style={{ marginBottom: "8px", color: "var(--text-tertiary)", fontSize: "12px" }}>小尺寸 (4px)</div><PimaProgress value={30} size="sm" /></div>
              <div><div style={{ marginBottom: "8px", color: "var(--text-tertiary)", fontSize: "12px" }}>默认尺寸 (8px)</div><PimaProgress value={60} size="md" /></div>
              <div><div style={{ marginBottom: "8px", color: "var(--text-tertiary)", fontSize: "12px" }}>大尺寸 (12px)</div><PimaProgress value={90} size="lg" /></div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Primary 主色</h2>
            <div className="app-card__content">
              <PimaProgress value={progress1} variant="primary" size="sm" />
              <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                <PimaButton size="sm" variant="primary" onClick={() => setProgress1((prev) => Math.min(prev + 10, 100))}>增加</PimaButton>
                <PimaButton size="sm" variant="secondary" onClick={() => setProgress1(0)}>重置</PimaButton>
              </div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Success 成功</h2>
            <div className="app-card__content">
              <PimaProgress value={progress2} variant="success" size="sm" />
              <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                <PimaButton size="sm" variant="primary" onClick={() => setProgress2((prev) => Math.min(prev + 10, 100))}>增加</PimaButton>
                <PimaButton size="sm" variant="secondary" onClick={() => setProgress2(0)}>重置</PimaButton>
              </div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">显示进度文本</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div><div style={{ marginBottom: "0px", color: "var(--text-tertiary)", fontSize: "12px" }}>默认格式</div><PimaProgress value={65} showText size="sm" /></div>
              <div><div style={{ marginBottom: "0px", color: "var(--text-tertiary)", fontSize: "12px" }}>自定义格式</div><PimaProgress value={80} showText size="sm" format={(percent) => `${percent}/100`} /></div>
              <div><div style={{ marginBottom: "0px", color: "var(--text-tertiary)", fontSize: "12px" }}>完成状态</div><PimaProgress value={100} variant="success" showText size="sm" format={(percent) => percent === 100 ? "完成!" : `${percent}%`} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div id="section-form" style={{ marginBottom: "2rem", order: 5 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          表单组件 (Form)
        </h2>
        <div className="app-grid">
          <div className="app-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="app-card__title">用户信息表单（垂直布局）</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-24)", maxWidth: "800px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-24)" }}>
                <PimaInput label="用户名" placeholder="请输入用户名" value={formName} onValueChange={setFormName} required size="sm" prefix={<Mail size={16} />} />
                <PimaInput label="邮箱地址" placeholder="请输入邮箱" value={formEmail} onValueChange={setFormEmail} required type="email" size="sm" prefix={<Mail size={16} />} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-24)" }}>
                <PimaSelector label="角色" placeholder="请选择角色" value={formRole} onValueChange={setFormRole} required size="sm" options={[{ value: "admin", label: "管理员" }, { value: "editor", label: "编辑" }, { value: "viewer", label: "访客" }]} />
                <PimaDatePicker label="出生日期" date={formDob} onDateChange={setFormDob} placeholder="请选择出生日期" size="sm" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-24)" }}>
                <PimaCheckbox label="兴趣爱好" options={[{ value: "reading", label: "阅读" }, { value: "traveling", label: "旅行" }, { value: "music", label: "音乐" }, { value: "sports", label: "运动" }]} value={formInterests} onValueChange={setFormInterests} orientation="horizontal" size="sm" />
                <PimaRadio label="性别" options={[{ value: "male", label: "男" }, { value: "female", label: "女" }, { value: "other", label: "其他" }]} value={formGender} onValueChange={setFormGender} orientation="horizontal" size="sm" />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <PimaSwitch checked={formNotifications} onCheckedChange={setFormNotifications} label="接收通知" size="sm" />
              </div>
              <PimaTextarea label="个人简介" placeholder="请输入个人简介..." value={formBio} onValueChange={setFormBio} maxLength={200} showCount rows={4} size="sm" />
              <PimaCheckbox label="条款与隐私" options={[{ value: "terms", label: "我已阅读并同意服务条款和隐私政策" }]} value={formTerms} onValueChange={setFormTerms} size="sm" />
              <div style={{ display: "flex", gap: "var(--spacing-16)", marginTop: "var(--spacing-8)" }}>
                <PimaButton variant="primary" size="sm">提交表单</PimaButton>
                <PimaButton variant="secondary" size="sm" onClick={() => { setFormName(""); setFormEmail(""); setFormRole(""); setFormDob(undefined); setFormGender("male"); setFormBio(""); setFormNotifications(false); setFormInterests([]); setFormTerms([]); }}>重置</PimaButton>
              </div>
            </div>
          </div>
          <div className="app-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="app-card__title">水平布局表单</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-24)", maxWidth: "800px" }}>
              <PimaInput label="用户名" placeholder="请输入用户名" value={hFormInput} onValueChange={setHFormInput} required size="sm" layout="horizontal" labelWidth={120} />
              <PimaSelector label="角色" placeholder="请选择角色" value={hFormSelect} onValueChange={setHFormSelect} required size="sm" layout="horizontal" labelWidth={120} options={[{ value: "admin", label: "管理员" }, { value: "editor", label: "编辑" }, { value: "viewer", label: "访客" }]} />
              <PimaDatePicker label="出生日期" date={hFormDate} onDateChange={setHFormDate} placeholder="请选择日期" required size="sm" layout="horizontal" labelWidth={120} />
              <PimaRadio label="性别" options={[{ value: "male", label: "男" }, { value: "female", label: "女" }, { value: "other", label: "其他" }]} value={hFormRadio} onValueChange={setHFormRadio} orientation="horizontal" required size="sm" layout="horizontal" labelWidth={120} />
              <PimaCheckbox label="兴趣爱好" options={[{ value: "reading", label: "阅读" }, { value: "traveling", label: "旅行" }, { value: "music", label: "音乐" }]} value={hFormCheckbox} onValueChange={setHFormCheckbox} orientation="horizontal" required size="sm" layout="horizontal" labelWidth={120} />
              <PimaTextarea label="个人简介" placeholder="请输入个人简介..." value={hFormTextarea} onValueChange={setHFormTextarea} maxLength={200} showCount rows={3} size="sm" layout="horizontal" labelWidth={120} />
              <div style={{ paddingLeft: "128px", display: "flex", gap: "var(--spacing-16)" }}>
                <PimaButton variant="primary" size="sm">提交表单</PimaButton>
                <PimaButton variant="secondary" size="sm" onClick={() => { setHFormInput(""); setHFormTextarea(""); setHFormSelect(""); setHFormDate(undefined); setHFormRadio(""); setHFormCheckbox([]); }}>重置</PimaButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div id="section-tabs" style={{ marginBottom: "2rem", order: 24 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          标签页组件 (Tabs)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">默认下划线样式</h2>
            <div className="app-card__content">
              <PimaTabs items={[{ key: "tab1", label: "选项一", children: <p style={{ color: "var(--text-secondary)", fontSize: "var(--fontsize-14)" }}>选项一的内容区域</p> }, { key: "tab2", label: "选项二", children: <p style={{ color: "var(--text-secondary)", fontSize: "var(--fontsize-14)" }}>选项二的内容区域</p> }, { key: "tab3", label: "选项三", children: <p style={{ color: "var(--text-secondary)", fontSize: "var(--fontsize-14)" }}>选项三的内容区域</p> }]} defaultActiveKey="tab1" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">自定义指示条宽度</h2>
            <div className="app-card__content">
              <PimaTabs items={[{ key: "tab1", label: "首页", children: <p style={{ color: "var(--text-secondary)", fontSize: "var(--fontsize-14)" }}>首页内容</p> }, { key: "tab2", label: "产品介绍", children: <p style={{ color: "var(--text-secondary)", fontSize: "var(--fontsize-14)" }}>产品介绍内容</p> }, { key: "tab3", label: "关于我们", children: <p style={{ color: "var(--text-secondary)", fontSize: "var(--fontsize-14)" }}>关于我们内容</p> }]} defaultActiveKey="tab1" indicatorWidth={24} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">禁用状态</h2>
            <div className="app-card__content">
              <PimaTabs items={[{ key: "e1", label: "可用项", children: <p style={{ color: "var(--text-secondary)", fontSize: "var(--fontsize-14)" }}>这是可用标签的内容</p> }, { key: "e2", label: "禁用项", disabled: true }, { key: "e3", label: "另一可用项", children: <p style={{ color: "var(--text-secondary)", fontSize: "var(--fontsize-14)" }}>这是另一个可用标签的内容</p> }]} defaultActiveKey="e1" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistic Section */}
      <div id="section-statistic" style={{ marginBottom: "2rem", order: 22 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          统计数值 (Statistic)
        </h2>
        <div className="app-grid">
          <div className="app-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="app-card__title">基础用法</h2>
            <div className="app-card__content">
              <PimaStatisticGroup>
                <PimaStatistic title="活跃用户" value={112893} />
                <PimaStatistic title="账户余额 (CNY)" value={2568.08} precision={2} prefix="¥" />
                <PimaStatistic title="完成率" value={98.6} precision={1} suffix="%" />
              </PimaStatisticGroup>
            </div>
          </div>
          <div className="app-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="app-card__title">带分隔线</h2>
            <div className="app-card__content">
              <PimaStatisticGroup divider>
                <PimaStatistic title="总订单" value={1128} />
                <PimaStatistic title="已完成" value={968} color="success" />
                <PimaStatistic title="待处理" value={160} color="warning" />
              </PimaStatisticGroup>
            </div>
          </div>
          <div className="app-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="app-card__title">卡片式分组</h2>
            <div className="app-card__content">
              <PimaStatisticGroup card>
                <PimaStatistic title="今日访问" value={8846} color="primary" />
                <PimaStatistic title="新增用户" value={256} color="success" />
                <PimaStatistic title="成交金额" value={38920.5} precision={2} prefix="¥" />
                <PimaStatistic title="转化率" value={4.8} precision={1} suffix="%" color="warning" />
              </PimaStatisticGroup>
            </div>
          </div>
          <div className="app-card" style={{ gridColumn: "1 / -1" }}>
            <h2 className="app-card__title">趋势指示</h2>
            <div className="app-card__content">
              <PimaStatisticGroup>
                <PimaStatistic title="月度营收" value={126560} prefix="¥" precision={0} trend="up" trendValue="12.5%" description="较上月" />
                <PimaStatistic title="退款金额" value={1280} prefix="¥" precision={0} color="error" trend="down" trendValue="3.2%" description="较上月" />
                <PimaStatistic title="日活用户" value={28650} color="success" trend="up" trendValue="5.8%" />
              </PimaStatisticGroup>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">不同尺寸</h2>
            <div className="app-card__content">
              <PimaStatisticGroup>
                <PimaStatistic title="小号 sm" value={1024} size="sm" />
                <PimaStatistic title="默认 default" value={2048} />
                <PimaStatistic title="大号 lg" value={4096} size="lg" />
              </PimaStatisticGroup>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">倒计时</h2>
            <div className="app-card__content">
              <PimaStatisticGroup>
                <PimaCountdown title="活动倒计时" target={Date.now() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000} format="HH:mm:ss" />
                <PimaCountdown title="含天数" target={Date.now() + 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000} format="DD 天 HH:mm:ss" color="primary" />
              </PimaStatisticGroup>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
