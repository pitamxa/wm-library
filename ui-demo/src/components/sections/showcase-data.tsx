// Shared mock data for showcase sections
import React from "react";
import type {
  PimaSelectorOption,
  PimaTreeNode,
  PimaRadioOption,
  PimaCheckboxOption,
  ColumnType,
} from "../index";
import { PimaTag, PimaButton } from "../index";

export const cities: PimaSelectorOption[] = [
  { value: "beijing", label: "北京", description: "中国首都" },
  { value: "shanghai", label: "上海", description: "国际大都市" },
  { value: "guangzhou", label: "广州", description: "南方重镇" },
  { value: "shenzhen", label: "深圳", description: "科技之城", disabled: true },
  { value: "hangzhou", label: "杭州", description: "人间天堂" },
  { value: "chengdu", label: "成都", description: "天府之国" },
];

export const fruits: PimaSelectorOption[] = [
  { value: "apple", label: "苹果" },
  { value: "banana", label: "香蕉" },
  { value: "orange", label: "橙子" },
  { value: "grape", label: "葡萄" },
  { value: "watermelon", label: "西瓜" },
  { value: "strawberry", label: "草莓" },
];

export const colors: PimaSelectorOption[] = [
  { value: "red", label: "红色" },
  { value: "blue", label: "蓝色" },
  { value: "green", label: "绿色" },
  { value: "yellow", label: "黄色" },
  { value: "purple", label: "紫色" },
  { value: "orange", label: "橙色" },
];

export const languages: PimaSelectorOption[] = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
];

export const departmentTree: PimaTreeNode[] = [
  {
    value: "tech",
    label: "技术部",
    children: [
      {
        value: "frontend",
        label: "前端组",
        children: [
          { value: "fe-1", label: "张三" },
          { value: "fe-2", label: "李四" },
          { value: "fe-3", label: "王五" },
        ],
      },
      {
        value: "backend",
        label: "后端组",
        children: [
          { value: "be-1", label: "赵六" },
          { value: "be-2", label: "孙七" },
        ],
      },
      {
        value: "qa",
        label: "测试组",
        children: [
          { value: "qa-1", label: "周八" },
          { value: "qa-2", label: "吴九", disabled: true },
        ],
      },
    ],
  },
  {
    value: "product",
    label: "产品部",
    children: [
      { value: "pm-1", label: "郑十" },
      { value: "pm-2", label: "钱十一" },
    ],
  },
  {
    value: "design",
    label: "设计部",
    children: [
      { value: "ui-1", label: "陈十二" },
      { value: "ui-2", label: "林十三" },
    ],
  },
];

export const regionTree: PimaTreeNode[] = [
  {
    value: "east",
    label: "华东地区",
    children: [
      {
        value: "shanghai",
        label: "上海",
        children: [
          { value: "pudong", label: "浦东新区" },
          { value: "huangpu", label: "黄浦区" },
          { value: "xuhui", label: "徐汇区" },
        ],
      },
      {
        value: "jiangsu",
        label: "江苏省",
        children: [
          { value: "nanjing", label: "南京" },
          { value: "suzhou", label: "苏州" },
        ],
      },
    ],
  },
  {
    value: "north",
    label: "华北地区",
    children: [
      {
        value: "beijing-area",
        label: "北京",
        children: [
          { value: "haidian", label: "海淀区" },
          { value: "chaoyang", label: "朝阳区" },
        ],
      },
    ],
  },
  {
    value: "south",
    label: "华南地区",
    children: [
      {
        value: "guangdong",
        label: "广东省",
        children: [
          { value: "guangzhou", label: "广州" },
          { value: "shenzhen", label: "深圳" },
        ],
      },
    ],
  },
];

export const genders: PimaRadioOption[] = [
  { value: "male", label: "男" },
  { value: "female", label: "女" },
  { value: "other", label: "其他" },
];

export const plans: PimaRadioOption[] = [
  { value: "basic", label: "基础版", description: "适合个人使用" },
  { value: "pro", label: "专业版", description: "适合小团队" },
  { value: "enterprise", label: "企业版", description: "适合大型组织", disabled: true },
];

export const hobbies: PimaCheckboxOption[] = [
  { value: "reading", label: "阅读" },
  { value: "traveling", label: "旅行" },
  { value: "sports", label: "运动" },
  { value: "music", label: "音乐" },
  { value: "cooking", label: "烹饪" },
  { value: "photography", label: "摄影" },
];

// ===== Agent Table Data =====
export interface AgentRecord {
  id: string;
  agent: { name: string; email: string; enName: string };
  merchantCount: number;
  phone: string;
  status: "active" | "inactive";
  remarks: string;
  operator: { role: string; time: string };
}

export const agentTableColumns: ColumnType<AgentRecord>[] = [
  {
    title: "经纪人/登录账号",
    dataIndex: "agent",
    key: "agent",
    width: "25%",
    render: (agent: { name: string; enName: string; email: string }) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>{agent.name} <span>{agent.enName}</span></span>
        <span style={{ fontSize: "var(--fontsize-14)", color: "var(--text-3)" }}>{agent.email}</span>
      </div>
    ),
  },
  {
    title: "关联商户数",
    dataIndex: "merchantCount",
    key: "merchantCount",
    width: "10%",
    render: (count: number) => <span>{count}</span>,
  },
  {
    title: "联络电话",
    dataIndex: "phone",
    key: "phone",
    width: "15%",
    render: (phone: string) => <span>{phone}</span>,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: "10%",
    render: (status: string) => {
      const isActive = status === "active";
      return (
        <PimaTag
          variant={isActive ? "success" : "error"}
          size="sm"
          tagStyle="outlined"
          style={{ border: "none", padding: "2px var(--spacing-8)", height: "auto", fontSize: "var(--fontsize-12)", backgroundColor: isActive ? undefined : "var(--neutral-9)" }}
        >
          {isActive ? "有效" : "冻结"}
        </PimaTag>
      );
    },
  },
  {
    title: "备注",
    dataIndex: "remarks",
    key: "remarks",
    width: "20%",
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: "最后操作人",
    dataIndex: "operator",
    key: "operator",
    width: "15%",
    render: (op: { role: string; time: string }) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>{op.role}</span>
        <span style={{ fontSize: "var(--fontsize-14)", color: "var(--text-3)" }}>{op.time}</span>
      </div>
    ),
  },
  {
    title: "操作",
    key: "action",
    width: "200px",
    align: "left",
    render: () => (
      <div style={{ display: "flex", justifyContent: "flex-start", gap: "8px" }}>
        <PimaButton size="sm" variant="ghost">{"详情"}</PimaButton>
        <PimaButton size="sm" variant="ghost">{"重置"}</PimaButton>
        <PimaButton size="sm" variant="ghost">{"冻结"}</PimaButton>
      </div>
    ),
  },
];

export const generateAgentData = (count: number): AgentRecord[] => {
  return Array(count)
    .fill(null)
    .map((_, index) => {
      const status = Math.random() > 0.3 ? "active" : "inactive";
      return {
        id: `agent-${index}`,
        agent: {
          name: `Agent ${index + 1}`,
          enName: `(Agent ${index + 1})`,
          email: `agent.${index + 1}@example.com`,
        },
        merchantCount: Math.floor(Math.random() * 50),
        phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
        status: status as "active" | "inactive",
        remarks: status === "active" ? "Active agent" : "Suspended account",
        operator: { role: "Admin", time: "2024-01-15 10:00:00" },
      };
    });
};

export const allAgentData = generateAgentData(50);

// ===== Fixed Action Column Demo Data =====
export interface FixedColRecord {
  id: string;
  name: string;
  age: number;
  department: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: "active" | "inactive";
}

export const fixedColData: FixedColRecord[] = [
  { id: "fc-0", name: "张三", age: 28, department: "技术部", position: "工程师", email: "zhangsan@example.com", phone: "13800001111", address: "北京市海淀区", joinDate: "2024-03-15", status: "active" },
  { id: "fc-1", name: "李四", age: 32, department: "产品部", position: "产品经理", email: "lisi@example.com", phone: "13800002222", address: "上海市浦东新区", joinDate: "2024-06-01", status: "inactive" },
];

export const fixedColColumns: ColumnType<FixedColRecord>[] = [
  { title: "姓名", dataIndex: "name", key: "name", width: 120 },
  { title: "年龄", dataIndex: "age", key: "age", width: 80 },
  { title: "部门", dataIndex: "department", key: "department", width: 120 },
  { title: "职位", dataIndex: "position", key: "position", width: 120 },
  { title: "邮箱", dataIndex: "email", key: "email", width: 200 },
  { title: "电话", dataIndex: "phone", key: "phone", width: 150 },
  { title: "地址", dataIndex: "address", key: "address", width: 200 },
  { title: "入职日期", dataIndex: "joinDate", key: "joinDate", width: 120 },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
    render: (status: string) => (
      <PimaTag
        variant={status === "active" ? "success" : "error"}
        size="sm"
        tagStyle="outlined"
        style={{ border: "none", padding: "2px var(--spacing-8)", height: "auto", fontSize: "var(--fontsize-12)", backgroundColor: status === "active" ? undefined : "var(--neutral-9)" }}
      >
        {status === "active" ? "在职" : "离职"}
      </PimaTag>
    ),
  },
  {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 200,
    render: () => (
      <div style={{ display: "flex", gap: "var(--spacing-16)" }}>
        <PimaButton size="sm" variant="ghost">详情</PimaButton>
        <PimaButton size="sm" variant="ghost">编辑</PimaButton>
        <PimaButton size="sm" variant="ghost">删除</PimaButton>
      </div>
    ),
  },
];

// ===== Tree Table Demo Data =====
export interface TreeTableRecord {
  key: string;
  name: string;
  age: number;
  address: string;
  children?: TreeTableRecord[];
}

export const treeTableColumns: ColumnType<TreeTableRecord>[] = [
  { title: "姓名", dataIndex: "name", key: "name", width: 400 },
  { title: "年龄", dataIndex: "age", key: "age", width: 150 },
  { title: "地址", dataIndex: "address", key: "address" },
];

export const treeTableData: TreeTableRecord[] = [
  {
    key: "1", name: "王建国", age: 60, address: "北京市海淀区中关村大街1号",
    children: [
      { key: "1-1", name: "王明", age: 42, address: "北京市朝阳区望京东路2号" },
      {
        key: "1-2", name: "王磊", age: 30, address: "北京市西城区金融街3号",
        children: [
          { key: "1-2-1", name: "王小明", age: 16, address: "北京市西城区金融街3号" },
          { key: "1-2-2", name: "王小磊", age: 18, address: "北京市东城区王府井4号" },
          { key: "1-2-3", name: "王小红", age: 20, address: "北京市丰台区南三环5号" },
        ],
      },
    ],
  },
  {
    key: "2", name: "李志远", age: 72, address: "上海市浦东新区陆家嘴1号",
    children: [
      {
        key: "2-1", name: "李强", age: 42, address: "上海市徐汇区漕河泾2号",
        children: [
          { key: "2-1-1", name: "李小强", age: 25, address: "上海市静安区南京西路3号" },
        ],
      },
    ],
  },
  { key: "3", name: "张伟", age: 32, address: "广州市天河区珠江新城1号" },
];

// ===== Nested / Expandable Table Demo Data (AI Platform) =====
export interface AIPlatformModelRecord {
  id: string;
  name: string;
  description: string;
  tokenLimit: { input: string; output: string };
  status: "active" | "inactive";
  operator: { name: string; time: string };
}

export interface AIPlatformRecord {
  id: string;
  platform: string;
  status: "active" | "inactive";
  operator: { name: string; time: string };
  models: AIPlatformModelRecord[];
}

export const aiPlatformData: AIPlatformRecord[] = [
  {
    id: "platform-1", platform: "Gemini", status: "active",
    operator: { name: "admin", time: "YYYY/MM/DD HH:MM:SS" },
    models: [
      { id: "model-g1", name: "Gemini 1.5 Pro", description: "支援多模態輸入，適合複雜推理與長文本理解任務", tokenLimit: { input: "1,048,576", output: "8,192" }, status: "active", operator: { name: "admin", time: "YYYY/MM/DD HH:MM:SS" } },
      { id: "model-g2", name: "Gemini 1.5 Flash", description: "輕量高速模型，適合即時對話與低延遲場景", tokenLimit: { input: "1,048,576", output: "8,192" }, status: "active", operator: { name: "admin", time: "YYYY/MM/DD HH:MM:SS" } },
    ],
  },
  {
    id: "platform-2", platform: "Azure OpenAI", status: "active",
    operator: { name: "admin", time: "YYYY/MM/DD HH:MM:SS" },
    models: [
      { id: "model-1", name: "GPT-4o-mini", description: "適合處理輕量級任務，提供快速響應並在資源優先的環境中進行高校計算", tokenLimit: { input: "128,000", output: "16,384" }, status: "active", operator: { name: "admin", time: "YYYY/MM/DD HH:MM:SS" } },
      { id: "model-2", name: "GPT-4o", description: "適合處理輕量級任務，提供快速響應並在資源優先的環境中進行高校計算", tokenLimit: { input: "128,000", output: "16,384" }, status: "active", operator: { name: "admin", time: "YYYY/MM/DD HH:MM:SS" } },
    ],
  },
  {
    id: "platform-3", platform: "清華智譜", status: "active",
    operator: { name: "admin", time: "YYYY/MM/DD HH:MM:SS" },
    models: [
      { id: "model-z1", name: "GLM-4", description: "新一代基座大模型，支援長文本與多輪對話", tokenLimit: { input: "128,000", output: "4,096" }, status: "active", operator: { name: "admin", time: "YYYY/MM/DD HH:MM:SS" } },
    ],
  },
];

const statusTag = (status: string, activeLabel: string, inactiveLabel: string) => (
  <PimaTag
    variant={status === "active" ? "success" : "error"}
    size="sm"
    tagStyle="outlined"
    style={{ border: "none", padding: "2px var(--spacing-8)", height: "auto", fontSize: "var(--fontsize-12)", backgroundColor: status === "active" ? undefined : "var(--neutral-9)" }}
  >
    {status === "active" ? activeLabel : inactiveLabel}
  </PimaTag>
);

const operatorCell = (op: { name: string; time: string }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
    <span style={{ fontSize: "var(--fontsize-14)", color: "var(--text-main)" }}>{op.name}</span>
    <span style={{ fontSize: "var(--fontsize-14)", color: "var(--text-3)", fontWeight: 300 }}>{op.time}</span>
  </div>
);

const actionLinks = (...labels: string[]) => (
  <div style={{ display: "flex", gap: "var(--spacing-16)", alignItems: "center", whiteSpace: "nowrap", flexWrap: "nowrap" }}>
    {labels.map((l) => (
      <a key={l} style={{ fontSize: "var(--fontsize-14)", color: "var(--primary-1-default)", cursor: "pointer", textDecoration: "none" }}>{l}</a>
    ))}
  </div>
);

export const aiPlatformColumns: ColumnType<AIPlatformRecord>[] = [
  {
    title: "AI平台", dataIndex: "platform", key: "platform",
    render: (val: string) => <span style={{ fontSize: "var(--fontsize-14)", fontWeight: 600, color: "inherit" }}>{val}</span>,
  },
  { title: "狀態", dataIndex: "status", key: "status", width: 180, render: (s: string) => statusTag(s, "启用", "停用") },
  { title: "最後操作人/時間", dataIndex: "operator", key: "operator", width: 340, render: operatorCell },
  { title: "操作", key: "action", width: 264, render: () => actionLinks("編輯", "刪除", "添加模型", "區域資源") },
];

export const aiModelColumns: ColumnType<AIPlatformModelRecord>[] = [
  {
    title: "模型", dataIndex: "name", key: "name", width: 240,
    render: (val: string) => <span style={{ fontSize: "var(--fontsize-14)", fontWeight: 600, color: "var(--text-main)" }}>{val}</span>,
  },
  {
    title: "描述", dataIndex: "description", key: "description", width: 300,
    render: (val: string) => <span style={{ fontSize: "var(--fontsize-14)", color: "var(--text-secondary)" }}>{val}</span>,
  },
  {
    title: "令牌限制", dataIndex: "tokenLimit", key: "tokenLimit", width: 180,
    render: (val: { input: string; output: string }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "var(--fontsize-14)" }}>
        <div style={{ display: "flex", gap: "1px" }}>
          <span style={{ color: "var(--text-main)" }}>輸入：</span>
          <span style={{ color: "var(--text-3)" }}>{val.input}</span>
        </div>
        <div style={{ display: "flex", gap: "1px" }}>
          <span style={{ color: "var(--text-main)" }}>輸出：</span>
          <span style={{ color: "var(--text-3)" }}>{val.output}</span>
        </div>
      </div>
    ),
  },
  { title: "狀態", dataIndex: "status", key: "status", width: 154, render: (s: string) => statusTag(s, "启用", "停用") },
  { title: "最後操作人/時間", dataIndex: "operator", key: "operator", width: 270, render: operatorCell },
  { title: "操作", key: "action", width: 180, render: () => actionLinks("編輯", "刪除", "停用") },
];
