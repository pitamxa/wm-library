import React from "react";
import {
  PimaButton,
  WMDivider,
} from "../index";
import {
  Plus,
  Download,
  Search as SearchIcon,
  Send,
  Trash2,
} from "lucide-react";

export function GeneralSections() {
  return (
    <>
      {/* Button Section */}
      <div id="section-button" style={{ marginBottom: "2rem", order: 1 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          按钮组件 (Button)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">按钮变体</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <PimaButton variant="primary">Primary 按钮</PimaButton>
              <PimaButton variant="secondary">Secondary 按钮</PimaButton>
              <PimaButton variant="outline">Outline 按钮</PimaButton>
              <PimaButton variant="ghost">Ghost 按钮</PimaButton>
              <PimaButton variant="danger">Danger 按钮</PimaButton>
            </div>
          </div>

          <div className="app-card">
            <h2 className="app-card__title">尺寸变体</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
              <PimaButton size="sm">小尺寸按钮</PimaButton>
              <PimaButton size="default">默认尺寸按钮</PimaButton>
              <PimaButton size="lg">大尺寸按钮</PimaButton>
            </div>
          </div>

          <div className="app-card">
            <h2 className="app-card__title">带图标按钮</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <PimaButton icon={<Plus />}>新增</PimaButton>
              <PimaButton variant="secondary" icon={<Download />}>下载</PimaButton>
              <PimaButton variant="outline" icon={<SearchIcon />}>搜索</PimaButton>
              <PimaButton variant="ghost" iconRight={<Send />}>发送</PimaButton>
              <PimaButton variant="danger" icon={<Trash2 />}>删除</PimaButton>
            </div>
          </div>

          <div className="app-card">
            <h2 className="app-card__title">按钮状态</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <PimaButton>默认状态</PimaButton>
              <PimaButton loading={true}>加载中</PimaButton>
              <PimaButton disabled={true}>禁用状态</PimaButton>
              <PimaButton variant="secondary" loading={true}>加载中...</PimaButton>
              <PimaButton variant="outline" disabled={true}>不可用</PimaButton>
            </div>
          </div>

          <div className="app-card">
            <h2 className="app-card__title">纯图标按钮</h2>
            <div className="app-card__content" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <PimaButton icon={<Plus />} size="sm" />
              <PimaButton icon={<SearchIcon />} size="sm" variant="secondary" />
              <PimaButton icon={<Download />} size="sm" variant="outline" />
              <PimaButton icon={<Plus />} />
              <PimaButton icon={<SearchIcon />} variant="secondary" />
              <PimaButton icon={<Download />} variant="outline" />
              <PimaButton icon={<Plus />} size="lg" />
              <PimaButton icon={<SearchIcon />} size="lg" variant="secondary" />
              <PimaButton icon={<Download />} size="lg" variant="outline" />
            </div>
          </div>

          <div className="app-card">
            <h2 className="app-card__title">块级按钮</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <PimaButton block>块级按钮（100% 宽度）</PimaButton>
              <PimaButton variant="secondary" block icon={<Download />}>下载全部文件</PimaButton>
              <PimaButton variant="outline" block>取消</PimaButton>
            </div>
          </div>

          <div className="app-card">
            <h2 className="app-card__title">组合示例</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <PimaButton variant="primary" icon={<Plus />}>新建</PimaButton>
                <PimaButton variant="secondary">取消</PimaButton>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <PimaButton variant="primary" loading={true}>提交中...</PimaButton>
                <PimaButton variant="outline" disabled={true}>返回</PimaButton>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <PimaButton size="sm" icon={<SearchIcon />}>搜索</PimaButton>
                <PimaButton size="sm" variant="secondary" iconRight={<Send />}>发送</PimaButton>
                <PimaButton size="sm" variant="danger" icon={<Trash2 />}>删除</PimaButton>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <PimaButton variant="success">导出</PimaButton>
              </div>
            </div>
          </div>

          <div className="app-card">
            <h2 className="app-card__title">状态变体</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <PimaButton variant="primary" size="sm">主要</PimaButton>
                <PimaButton variant="success" size="sm">成功</PimaButton>
                <PimaButton variant="warning" size="sm">警告</PimaButton>
                <PimaButton variant="danger" size="sm">危险</PimaButton>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <PimaButton variant="primary" size="sm" disabled>主要</PimaButton>
                <PimaButton variant="success" size="sm" disabled>成功</PimaButton>
                <PimaButton variant="warning" size="sm" disabled>警告</PimaButton>
                <PimaButton variant="danger" size="sm" disabled>危险</PimaButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider Section */}
      <div id="section-divider" style={{ marginBottom: "2rem", order: 2 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          分割线组件 (Divider)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础分割线</h2>
            <div className="app-card__content">
              <div style={{ marginBottom: "16px" }}>标题部分</div>
              <WMDivider />
              <div style={{ marginTop: "16px" }}>内容部分</div>
            </div>
          </div>

          <div className="app-card">
            <h2 className="app-card__title">不同间距</h2>
            <div className="app-card__content">
              <div>无间距</div>
              <WMDivider spacing="none" />
              <div>小间距 (4px)</div>
              <WMDivider spacing="sm" />
              <div>默认间距 (8px)</div>
              <WMDivider spacing="md" />
              <div>大间距 (16px)</div>
              <WMDivider spacing="lg" />
              <div>超大间距 (24px)</div>
              <WMDivider spacing="xl" />
              <div>结束</div>
            </div>
          </div>

          <div className="app-card">
            <h2 className="app-card__title">带文字分割线</h2>
            <div className="app-card__content">
              <div>上方内容</div>
              <WMDivider>居中文字</WMDivider>
              <div>下方内容</div>
              <WMDivider textPosition="left">左对齐文字</WMDivider>
              <div>更多内容</div>
              <WMDivider textPosition="right">右对齐文字</WMDivider>
              <div>结束内容</div>
            </div>
          </div>

          <div className="app-card">
            <h2 className="app-card__title">虚线样式</h2>
            <div className="app-card__content">
              <div>实线分割</div>
              <WMDivider variant="solid" />
              <div>虚线分割</div>
              <WMDivider variant="dashed" />
              <div>虚线带文字</div>
              <WMDivider variant="dashed">分割内容</WMDivider>
              <div>结束</div>
            </div>
          </div>

          <div className="app-card">
            <h2 className="app-card__title">垂直分割线</h2>
            <div className="app-card__content">
              <div style={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
                <PimaButton variant="ghost" size="sm">剪切</PimaButton>
                <WMDivider orientation="vertical" spacing="sm" />
                <PimaButton variant="ghost" size="sm">复制</PimaButton>
                <WMDivider orientation="vertical" spacing="sm" />
                <PimaButton variant="ghost" size="sm">粘贴</PimaButton>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginTop: "16px", columnGap: "8px" }}>
                <PimaButton variant="ghost" size="sm">首页</PimaButton>
                <WMDivider orientation="vertical" spacing="sm" />
                <PimaButton variant="ghost" size="sm">关于我们</PimaButton>
                <WMDivider orientation="vertical" spacing="sm" variant="dashed" />
                <PimaButton variant="ghost" size="sm">联系方式</PimaButton>
              </div>
            </div>
          </div>

          <div className="app-card">
            <h2 className="app-card__title">组合示例</h2>
            <div className="app-card__content">
              <div>第一部分</div>
              <WMDivider spacing="lg" thickness="thick">第二部分</WMDivider>
              <div>内容</div>
              <WMDivider spacing="sm" variant="dashed" textPosition="left">详细信息</WMDivider>
              <div>更多内容</div>
              <WMDivider spacing="xl">结束</WMDivider>
              <div>最后部分</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
