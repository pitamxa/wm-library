import React, { useState } from "react";
import {
  PimaPagination, PimaCard, PimaLoginCard,
  PimaButton, WMMenu, WMModal, PimaInput,
} from "../index";
import { PimaBreadcrumb } from "../PimaBreadcrumb";
import { PimaAnchor, PimaAnchorStatic } from "../PimaAnchor";
import { WMDivider } from "../WMDivider";
import {
  Mail, User, Phone, RefreshCw,
  Home, FolderOpen, FileText, Slash,
  BarChart3, Users, Presentation, Settings,
  Store, Receipt, FileSearch, Bell, CheckCircle,
} from "lucide-react";

export function NavDisplayBundle() {
  const [paginationBasic, setPaginationBasic] = useState<number>(1);
  const [paginationWithSize, setPaginationWithSize] = useState<number>(1);
  const [paginationWithJumper, setPaginationWithJumper] = useState<number>(1);
  const [paginationSimple, setPaginationSimple] = useState<number>(1);
  const [modalUserProfile, setModalUserProfile] = useState<boolean>(false);

  return (
    <>
      {/* Pagination Section */}
      <div id="section-pagination" style={{ marginBottom: "2rem", order: 37 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          Pagination Component
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">Basic Pagination</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <PimaPagination total={100} current={paginationBasic} onChange={(page) => setPaginationBasic(page)} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Size Variants</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Small</span>
                <PimaPagination total={100} size="sm" current={1} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Default</span>
                <PimaPagination total={100} size="default" current={1} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Large</span>
                <PimaPagination total={100} size="lg" current={1} />
              </div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Show Total</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <PimaPagination total={250} showTotal current={paginationWithSize} onChange={(page) => setPaginationWithSize(page)} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Page Size Selector</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <PimaPagination total={500} showSizeChanger showTotal current={1} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Quick Jumper</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <PimaPagination total={500} showQuickJumper showTotal current={paginationWithJumper} onChange={(page) => setPaginationWithJumper(page)} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Simple Mode</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <PimaPagination total={100} simple current={paginationSimple} onChange={(page) => setPaginationSimple(page)} />
              <PimaPagination total={100} simple size="lg" current={1} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">All Features</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <PimaPagination total={500} showTotal showSizeChanger showQuickJumper current={1} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Disabled State</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <PimaPagination total={100} disabled current={5} />
              <PimaPagination total={100} simple disabled current={3} />
            </div>
          </div>
        </div>
      </div>

      {/* Card Section */}
      <div id="section-card" style={{ marginBottom: "2rem", order: 18 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          卡片组件 (Card)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础变体</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <PimaCard title="默认卡片" variant="default"><p>这是一个默认样式的卡片，使用单边框设计。</p></PimaCard>
              <PimaCard title="边框卡片" variant="bordered"><p>这是一个带有2px边框的卡片，更加突出。</p></PimaCard>
              <PimaCard title="浮起卡片" variant="elevated"><p>这是一个带有阴影的卡片，具有浮起效果。</p></PimaCard>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">尺寸变体</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <PimaCard title="小尺寸卡片" size="sm"><p>紧凑的小尺寸卡片，适合密集布局。</p></PimaCard>
              <PimaCard title="默认尺寸卡片" size="default"><p>标准尺寸卡片，最常用的大小。</p></PimaCard>
              <PimaCard title="大尺寸卡片" size="lg"><p>较大的卡片，适合重要内容展示。</p></PimaCard>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">交互状态</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <PimaCard title="可悬停卡片" hoverable extra={<PimaButton size="sm" variant="ghost">操作</PimaButton>}><p>鼠标悬停时会显示边框变化效果。</p></PimaCard>
              <PimaCard title="可点击卡片" clickable variant="elevated" onClick={() => alert("卡片被点击了！")} extra={<PimaButton size="sm" variant="outline">查看</PimaButton>}><p>点击卡片会触发事件，支持键盘导航（Enter/Space）。</p></PimaCard>
              <PimaCard title="禁用卡片" disabled extra={<PimaButton size="sm" disabled>操作</PimaButton>}><p>这是一个禁用状态的卡片，不可交互。</p></PimaCard>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">加载和验证状态</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <PimaCard title="加载中" loading><p>这段内容不会显示，因为卡片正在加载。</p></PimaCard>
              <PimaCard title="错误状态" error extra={<PimaButton size="sm" variant="danger">重试</PimaButton>}><p>这是一个错误状态的卡片，边框显示为错误颜色。</p></PimaCard>
              <PimaCard title="成功状态" success extra={<PimaButton size="sm" variant="primary">继续</PimaButton>}><p>这是一个成功状态的卡片，边框显示为成功颜色。</p></PimaCard>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">完整功能</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <PimaCard title="用户资料" extra={<div style={{ display: "flex", gap: "8px" }}><PimaButton variant="outline" size="sm" icon={<Mail size={16} />}>邮件</PimaButton><PimaButton variant="primary" size="sm" icon={<User size={16} />} onClick={() => setModalUserProfile(true)}>{"编辑"}</PimaButton></div>} footerClassName="wm-card__footer--transparent" footer={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>最后更新：2024-11-14</span><PimaButton variant="ghost" size="sm">详情</PimaButton></div>} hoverable variant="bordered" size="lg">
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><User size={16} /><span>张三</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Mail size={16} /><span>zhangsan@example.com</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Phone size={16} /><span>13800138000</span></div>
                </div>
              </PimaCard>
              <WMModal open={modalUserProfile} onClose={() => setModalUserProfile(false)} title={"编辑用户资料"} onOk={() => setModalUserProfile(false)}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <PimaInput label={"姓名"} defaultValue={"张三"} />
                  <PimaInput label={"邮箱"} defaultValue="zhangsan@example.com" />
                  <PimaInput label={"电话"} defaultValue="13800138000" />
                </div>
              </WMModal>
              <PimaCard title="产品统计" extra={<RefreshCw size={16} style={{ cursor: "pointer" }} />} footerClassName="wm-card__footer--transparent" footer={<div style={{ textAlign: "center" }}><PimaButton block size="sm" variant="primary">查看详细报告</PimaButton></div>} variant="elevated" hoverable>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div><div style={{ fontSize: "24px", color: "var(--primary-1-default)" }}>1,234</div><div style={{ fontSize: "12px", color: "var(--text-Tertiary)" }}>总用户数</div></div>
                  <div><div style={{ fontSize: "24px", color: "var(--success-1)" }}>89%</div><div style={{ fontSize: "12px", color: "var(--text-Tertiary)" }}>活跃率</div></div>
                  <div><div style={{ fontSize: "24px", color: "var(--warning-1)" }}>567</div><div style={{ fontSize: "12px", color: "var(--text-Tertiary)" }}>待处理</div></div>
                  <div><div style={{ fontSize: "24px", color: "var(--error-1)" }}>12</div><div style={{ fontSize: "12px", color: "var(--text-Tertiary)" }}>异常</div></div>
                </div>
              </PimaCard>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">登录卡片示例</h2>
            <div className="app-card__content" style={{ padding: 0 }}>
              <PimaLoginCard />
            </div>
          </div>
        </div>
      </div>

      {/* Anchor Section */}
      <div id="section-anchor" style={{ marginBottom: "2rem", order: 34 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          锚点组件 (Anchor)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础用法</h2>
            <div className="app-card__content">
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-16)", fontFamily: "var(--font-family-base)" }}>最简单的锚点导航，点击锚点链接高亮并滚动到对应区域。</p>
              <PimaAnchor items={[{ key: "basic-1", href: "#anchor-demo-1", title: "第一部分" }, { key: "basic-2", href: "#anchor-demo-2", title: "第二部分" }, { key: "basic-3", href: "#anchor-demo-3", title: "第三部分" }]} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">静态锚点</h2>
            <div className="app-card__content">
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-16)", fontFamily: "var(--font-family-base)" }}>不监听滚动，纯导航展示模式，无左侧轨道线。</p>
              <PimaAnchorStatic items={[{ key: "s-1", href: "#static-1", title: "概述" }, { key: "s-2", href: "#static-2", title: "安装" }, { key: "s-3", href: "#static-3", title: "快速上手" }, { key: "s-4", href: "#static-4", title: "常见问题" }]} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">多层级嵌套</h2>
            <div className="app-card__content">
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-16)", fontFamily: "var(--font-family-base)" }}>支持嵌套子级锚点，子级自动缩进显示。</p>
              <PimaAnchor items={[{ key: "nest-1", href: "#nest-intro", title: "组件介绍", children: [{ key: "nest-1-1", href: "#nest-feature", title: "功能特性" }, { key: "nest-1-2", href: "#nest-install", title: "安装方式" }] }, { key: "nest-2", href: "#nest-api", title: "API 文档", children: [{ key: "nest-2-1", href: "#nest-props", title: "Props 参数" }, { key: "nest-2-2", href: "#nest-events", title: "事件回调" }] }, { key: "nest-3", href: "#nest-faq", title: "常见问题" }]} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">水平锚点</h2>
            <div className="app-card__content">
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-16)", fontFamily: "var(--font-family-base)" }}>设置 direction="horizontal" 可切换为水平方向的锚点导航。</p>
              <PimaAnchor direction="horizontal" items={[{ key: "h-1", href: "#h-overview", title: "概览" }, { key: "h-2", href: "#h-design", title: "设计理念" }, { key: "h-3", href: "#h-develop", title: "开发指南" }, { key: "h-4", href: "#h-changelog", title: "更新日志" }]} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">轨道背景</h2>
            <div className="app-card__content">
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-16)", fontFamily: "var(--font-family-base)" }}>设置 railBackground 后，轨道线变为更宽的背景条，视觉上更加突出。</p>
              <PimaAnchor railBackground items={[{ key: "rb-1", href: "#rb-overview", title: "项目概述" }, { key: "rb-2", href: "#rb-arch", title: "架构设计" }, { key: "rb-3", href: "#rb-api", title: "接口文档" }, { key: "rb-4", href: "#rb-deploy", title: "部署指南" }]} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">受控模式</h2>
            <div className="app-card__content">
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-16)", fontFamily: "var(--font-family-base)" }}>通过 activeKey 和 onChange 实现完全受控的锚点导航。</p>
              <PimaAnchorStatic activeKey="ctrl-2" onChange={(key) => console.log("Anchor changed:", key)} items={[{ key: "ctrl-1", href: "#ctrl-1", title: "用户管理" }, { key: "ctrl-2", href: "#ctrl-2", title: "权限设置" }, { key: "ctrl-3", href: "#ctrl-3", title: "系统日志" }]} />
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Section */}
      <div id="section-breadcrumb" style={{ marginBottom: "2rem", order: 35 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          面包屑组件 (Breadcrumb)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础用法</h2>
            <div className="app-card__content">
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-16)", fontFamily: "var(--font-family-base)" }}>最简单的面包屑导航，使用默认分隔符（ChevronRight）。</p>
              <PimaBreadcrumb items={[{ key: "home", label: "首页", onClick: () => {} }, { key: "list", label: "列表页", onClick: () => {} }, { key: "detail", label: "详情页" }]} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">带图标</h2>
            <div className="app-card__content">
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-16)", fontFamily: "var(--font-family-base)" }}>每个面包屑项可以添加前缀图标，增强视觉辨识度。</p>
              <PimaBreadcrumb items={[{ key: "home", label: "首页", icon: <Home />, onClick: () => {} }, { key: "docs", label: "文档中心", icon: <FolderOpen />, onClick: () => {} }, { key: "guide", label: "使用指南", icon: <FileText /> }]} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">自定义分隔符</h2>
            <div className="app-card__content">
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-16)", fontFamily: "var(--font-family-base)" }}>通过 separator 属性自定义分隔符。</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
                <div>
                  <span style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-8)", display: "block", fontFamily: "var(--font-family-base)" }}>斜线分隔</span>
                  <PimaBreadcrumb separator={<Slash />} items={[{ key: "home", label: "首页", onClick: () => {} }, { key: "products", label: "产品", onClick: () => {} }, { key: "detail", label: "产品详情" }]} />
                </div>
                <WMDivider spacing="sm" />
                <div>
                  <span style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-8)", display: "block", fontFamily: "var(--font-family-base)" }}>文字分隔</span>
                  <PimaBreadcrumb separator={<span style={{ fontSize: "var(--fontsize-12)", color: "var(--text-placeholder)", fontFamily: "var(--font-family-base)" }}>/</span>} items={[{ key: "home", label: "首页", onClick: () => {} }, { key: "settings", label: "设置", onClick: () => {} }, { key: "profile", label: "个人信息" }]} />
                </div>
              </div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">折叠省略</h2>
            <div className="app-card__content">
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-16)", fontFamily: "var(--font-family-base)" }}>当层级较深时，设置 maxItems 可自动折叠中间项，点击省略号展开全部。</p>
              <PimaBreadcrumb maxItems={3} items={[{ key: "home", label: "首页", onClick: () => {} }, { key: "center", label: "个人中心", onClick: () => {} }, { key: "settings", label: "系统设置", onClick: () => {} }, { key: "security", label: "安全设置", onClick: () => {} }, { key: "password", label: "修改密码" }]} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">尺寸变体</h2>
            <div className="app-card__content">
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-16)", fontFamily: "var(--font-family-base)" }}>支持 sm / default / lg 三种尺寸。</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
                {(["sm", "default", "lg"] as const).map((size) => (
                  <div key={size}>
                    <span style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-8)", display: "block", fontFamily: "var(--font-family-base)" }}>{size === "sm" ? "小号 (sm)" : size === "default" ? "默认 (default)" : "大号 (lg)"}</span>
                    <PimaBreadcrumb size={size} items={[{ key: "home", label: "首页", icon: <Home />, onClick: () => {} }, { key: "list", label: "列表页", onClick: () => {} }, { key: "detail", label: "详情页" }]} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">禁用项</h2>
            <div className="app-card__content">
              <p style={{ fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)", marginBottom: "var(--spacing-16)", fontFamily: "var(--font-family-base)" }}>可以将某些面包屑项设为禁用状态，禁用项不可点击。</p>
              <PimaBreadcrumb items={[{ key: "home", label: "首页", onClick: () => {} }, { key: "archived", label: "已归档", disabled: true, onClick: () => {} }, { key: "detail", label: "归档详情" }]} />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div id="section-menu" style={{ marginBottom: "2rem", order: 36 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          菜单组件 (Menu)
        </h2>
        <h3 style={{ marginBottom: "1rem", marginTop: "1rem", color: "var(--text-secondary)" }}>无Icon菜单选项</h3>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础菜单</h2>
            <div className="app-card__content" style={{ gap: 0 }}>
              <WMMenu items={[{ key: "1", label: "活动" }, { key: "2", label: "会议" }, { key: "3", label: "研讨会" }, { key: "4", label: "服务" }]} selectedKey="4" onSelect={(key, item) => console.log("Selected:", key, item.label)} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">带子菜单</h2>
            <div className="app-card__content" style={{ gap: 0 }}>
              <WMMenu items={[{ key: "1", label: "活动", children: [{ key: "1-1", label: "我要到馆" }, { key: "1-2", label: "我要参加" }] }, { key: "2", label: "会议", children: [{ key: "2-1", label: "会议列表" }, { key: "2-2", label: "会议预约" }] }, { key: "3", label: "研讨会" }]} defaultOpenKeys={["1"]} onSelect={(key, item) => console.log("Selected:", key, item.label)} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">三级菜单</h2>
            <div className="app-card__content" style={{ gap: 0 }}>
              <WMMenu items={[{ key: "1", label: "服务", children: [{ key: "1-1", label: "我要到馆" }, { key: "1-2", label: "我要办证", children: [{ key: "1-2-1", label: "办证指引" }, { key: "1-2-2", label: "办证常见问题" }, { key: "1-2-3", label: "办证须知" }, { key: "1-2-4", label: "自助办证" }] }, { key: "1-3", label: "我要参加" }] }]} defaultOpenKeys={["1", "1-2"]} selectedKey="1-2-1" onSelect={(key, item) => console.log("Selected:", key, item.label)} />
            </div>
          </div>
        </div>
        <h3 style={{ marginBottom: "1rem", marginTop: "2rem", color: "var(--text-secondary)" }}>带Icon菜单选项</h3>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础菜单（带Icon）</h2>
            <div className="app-card__content" style={{ gap: 0 }}>
              <WMMenu items={[{ key: "1", label: "活动", icon: <BarChart3 size={16} /> }, { key: "2", label: "会议", icon: <Users size={16} /> }, { key: "3", label: "研讨会", icon: <Presentation size={16} /> }, { key: "4", label: "服务", icon: <Settings size={16} /> }]} selectedKey="4" onSelect={(key, item) => console.log("Selected:", key, item.label)} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">带子菜单（带Icon）</h2>
            <div className="app-card__content" style={{ gap: 0 }}>
              <WMMenu items={[{ key: "1", label: "活动", icon: <BarChart3 size={16} />, children: [{ key: "1-1", label: "我要到馆", icon: <Store size={16} /> }, { key: "1-2", label: "我要参加", icon: <Users size={16} /> }] }, { key: "2", label: "会议", icon: <Users size={16} />, children: [{ key: "2-1", label: "会议列表", icon: <FileText size={16} /> }, { key: "2-2", label: "会议预约", icon: <CheckCircle size={16} /> }] }, { key: "3", label: "研讨会", icon: <Presentation size={16} /> }]} defaultOpenKeys={["1"]} onSelect={(key, item) => console.log("Selected:", key, item.label)} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">完整示例</h2>
            <div className="app-card__content" style={{ gap: 0 }}>
              <WMMenu items={[{ key: "activity", label: "活动", icon: <BarChart3 size={16} /> }, { key: "meeting", label: "会议", icon: <Users size={16} /> }, { key: "seminar", label: "研讨会", icon: <Presentation size={16} /> }, { key: "service", label: "服务", icon: <Settings size={16} />, children: [{ key: "visit", label: "我要到店", icon: <Store size={16} /> }, { key: "card", label: "我要办证", icon: <Receipt size={16} />, children: [{ key: "card-guide", label: "办证指引", icon: <FileSearch size={16} /> }, { key: "card-faq", label: "办证常见问题", icon: <Bell size={16} /> }, { key: "card-notice", label: "办证须知", icon: <FileText size={16} /> }, { key: "card-self", label: "自助办证", icon: <CheckCircle size={16} /> }] }, { key: "join", label: "我要参加", icon: <Users size={16} /> }] }]} defaultOpenKeys={["service", "card"]} selectedKey="card-guide" onSelect={(key, item) => console.log("Selected:", key, item.label)} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">紧凑模式</h2>
            <div className="app-card__content" style={{ gap: 0 }}>
              <WMMenu items={[{ key: "1", label: "服务", icon: <Settings size={16} />, children: [{ key: "1-1", label: "我要到馆", icon: <Store size={16} /> }, { key: "1-2", label: "我要办证", icon: <Receipt size={16} />, children: [{ key: "1-2-1", label: "办证指引", icon: <FileSearch size={16} /> }, { key: "1-2-2", label: "办证常见问题", icon: <Bell size={16} /> }] }] }]} defaultOpenKeys={["1", "1-2"]} selectedKey="1-2-1" compact onSelect={(key, item) => console.log("Selected:", key, item.label)} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">禁用状态</h2>
            <div className="app-card__content" style={{ gap: 0 }}>
              <WMMenu items={[{ key: "1", label: "活动", icon: <BarChart3 size={16} /> }, { key: "2", label: "会议（禁用）", icon: <Users size={16} />, disabled: true }, { key: "3", label: "服务", icon: <Settings size={16} />, children: [{ key: "3-1", label: "我要到馆", icon: <Store size={16} /> }, { key: "3-2", label: "我要办证（禁用）", icon: <Receipt size={16} />, disabled: true }] }]} defaultOpenKeys={["3"]} onSelect={(key, item) => console.log("Selected:", key, item.label)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
