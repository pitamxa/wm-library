import React from "react";

export function FeaturesSection() {
  return (
    <div className="features-section" style={{ order: 38 }}>
      <h2 className="features-section__title">组件特性</h2>
      <div className="features-grid">
        <div className="feature-group">
          <h3 className="feature-group__title">Selector 选择器</h3>
          <ul className="feature-group__list">
            <li>• 默认/已选择状态</li>
            <li>• 悬停/聚焦效果</li>
            <li>• 错误/成功验证</li>
            <li>• 禁用/加载状态</li>
            <li>• 多种尺寸</li>
            <li>• 键盘导航</li>
          </ul>
        </div>
        <div className="feature-group">
          <h3 className="feature-group__title">Radio 单选按钮</h3>
          <ul className="feature-group__list">
            <li>• 默认圆形样式</li>
            <li>• 卡片样式</li>
            <li>• 按钮样式</li>
            <li>• 垂直/水平排列</li>
            <li>• 多种尺寸</li>
            <li>• 选项描述</li>
          </ul>
        </div>
        <div className="feature-group">
          <h3 className="feature-group__title">Switch 开关</h3>
          <ul className="feature-group__list">
            <li>• 开启/关闭状态</li>
            <li>• 状态文本显示</li>
            <li>• 加载动画</li>
            <li>• 禁用状态</li>
            <li>• 多种尺寸</li>
            <li>• 错误/成功验证</li>
          </ul>
        </div>
        <div className="feature-group">
          <h3 className="feature-group__title">Textarea 文本域</h3>
          <ul className="feature-group__list">
            <li>• 自动调整高度</li>
            <li>• 字符计数</li>
            <li>• 最大/最小行数</li>
            <li>• 只读/禁用状态</li>
            <li>• 错误/成功验证</li>
            <li>• 多种尺寸</li>
          </ul>
        </div>
        <div className="feature-group">
          <h3 className="feature-group__title">Input 输入框</h3>
          <ul className="feature-group__list">
            <li>• 密码显示/隐藏</li>
            <li>• 前缀/后缀图标</li>
            <li>• 字符计数</li>
            <li>• 多种输入类型</li>
            <li>• 错误/成功验证</li>
            <li>• 多种尺寸</li>
          </ul>
        </div>
        <div className="feature-group">
          <h3 className="feature-group__title">Button 按钮</h3>
          <ul className="feature-group__list">
            <li>• 5种按钮变体</li>
            <li>• 加载状态</li>
            <li>• 前缀/后缀图标</li>
            <li>• 纯图标按钮</li>
            <li>• 块级按钮</li>
            <li>• 多种尺寸</li>
          </ul>
        </div>
        <div className="feature-group">
          <h3 className="feature-group__title">Card 卡片</h3>
          <ul className="feature-group__list">
            <li>• 3种变体样式</li>
            <li>• 可悬停/可点击</li>
            <li>• 加载状态</li>
            <li>• 错误/成功验证</li>
            <li>• Header/Footer区域</li>
            <li>• 多种尺寸</li>
          </ul>
        </div>
        <div className="feature-group">
          <h3 className="feature-group__title">Menu 菜单</h3>
          <ul className="feature-group__list">
            <li>• 垂直导航菜单</li>
            <li>• 图标+文字组合</li>
            <li>• 选中状态高亮</li>
            <li>• 子菜单展开/收起</li>
            <li>• 多种尺寸</li>
            <li>• 键盘导航支持</li>
          </ul>
        </div>
        <div className="feature-group">
          <h3 className="feature-group__title">Notification 通知</h3>
          <ul className="feature-group__list">
            <li>• 4种类型（成功/错误/警告/信息）</li>
            <li>• 左侧24px图标</li>
            <li>• 自动关闭（默认3s）</li>
            <li>• 手动关闭</li>
            <li>• 操作结果反馈</li>
            <li>• 滑入动画效果</li>
          </ul>
        </div>
        <div className="feature-group">
          <h3 className="feature-group__title">Progress 进度条</h3>
          <ul className="feature-group__list">
            <li>• 2种颜色变体（主色/成功）</li>
            <li>• 3种尺寸（4px/8px/12px）</li>
            <li>• 可选进度文本显示</li>
            <li>• 自定义文本格式化</li>
            <li>• 平滑动画过渡</li>
            <li>• 基于Radix UI构建</li>
          </ul>
        </div>
        <div className="feature-group">
          <h3 className="feature-group__title">{"Collapse 折叠面板"}</h3>
          <ul className="feature-group__list">
            <li>• {"3种变体（default/bordered/ghost）"}</li>
            <li>• {"3种尺寸（sm/default/lg）"}</li>
            <li>• {"手风琴模式"}</li>
            <li>• {"受控/非受控模式"}</li>
            <li>• {"自定义图标和额外内容"}</li>
            <li>• {"箭头左/右位置切换"}</li>
          </ul>
        </div>
        <div className="feature-group">
          <h3 className="feature-group__title">{"Drawer 抽屉"}</h3>
          <ul className="feature-group__list">
            <li>{"• 从右侧滑出"}</li>
            <li>{"• 宽度为屏幕的一半"}</li>
            <li>{"• 遮罩层透明度60%"}</li>
            <li>{"• 底部操作按钮"}</li>
            <li>{"• 基于Radix UI构建"}</li>
          </ul>
        </div>
        <div className="feature-group">
          <h3 className="feature-group__title">验证功能</h3>
          <ul className="feature-group__list">
            <li>• 错误状态提示</li>
            <li>• 成功状态提示</li>
            <li>• 必填字段标记</li>
            <li>• 动态验证</li>
            <li>• 辅助文本</li>
            <li>• 禁用状态</li>
          </ul>
        </div>
        <div className="feature-group">
          <h3 className="feature-group__title">Timeline 时间轴</h3>
          <ul className="feature-group__list">
            <li>• 6种状态（default/success/error/warning/info/pending）</li>
            <li>• 3种模式（right/left/alternate）</li>
            <li>• 自定义图标和颜色</li>
            <li>• pending 等待状态</li>
            <li>• 3种尺寸（sm/default/lg）</li>
            <li>• 倒序排列支持</li>
          </ul>
        </div>
        <div className="feature-group">
          <h3 className="feature-group__title">可访问性</h3>
          <ul className="feature-group__list">
            <li>• 键盘导航</li>
            <li>• 屏幕阅读器支持</li>
            <li>• ARIA 属性</li>
            <li>• 焦点管理</li>
            <li>• 语义化 HTML</li>
            <li>• 完整无障碍支持</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
