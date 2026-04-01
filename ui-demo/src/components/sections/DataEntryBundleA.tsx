import React, { useState } from "react";
import { PimaSelector, PimaTreeSelector, PimaInputNumber } from "../index";
import {
  cities, fruits, colors, languages,
  departmentTree, regionTree,
} from "./showcase-data";

export function DataEntryBundleA() {
  // Selector states
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("red");
  const [requiredField, setRequiredField] = useState<string>("");
  const [validatedField, setValidatedField] = useState<string>("");
  const [multiCities, setMultiCities] = useState<string[]>(["beijing", "shanghai"]);
  const [multiFruits, setMultiFruits] = useState<string[]>([]);
  const [multiColors, setMultiColors] = useState<string[]>(["red"]);
  const [multiLangs, setMultiLangs] = useState<string[]>([]);
  // TreeSelector states
  const [treeDept, setTreeDept] = useState<string[]>(["fe-1", "fe-2"]);
  const [treeRegion, setTreeRegion] = useState<string[]>([]);
  const [treeDeptSearch, setTreeDeptSearch] = useState<string[]>([]);
  // InputNumber states
  const [inputNumBasic, setInputNumBasic] = useState<number | null>(null);
  const [inputNumRange, setInputNumRange] = useState<number | null>(5);
  const [inputNumStep, setInputNumStep] = useState<number | null>(0);
  const [inputNumPrecision, setInputNumPrecision] = useState<number | null>(3.14);
  const [inputNumError, setInputNumError] = useState<number | null>(null);
  const [inputNumSuccess, setInputNumSuccess] = useState<number | null>(100);
  const [inputNumDisabled] = useState<number | null>(42);
  const [inputNumNoControls, setInputNumNoControls] = useState<number | null>(10);
  const [inputNumDial, setInputNumDial] = useState<number | null>(1);
  const [inputNumDialRange, setInputNumDialRange] = useState<number | null>(5);
  const [inputNumDialDisabled] = useState<number | null>(3);
  const [inputNumHover, setInputNumHover] = useState<number | null>(20);
  const [inputNumHoverStep, setInputNumHoverStep] = useState<number | null>(50);
  const [inputNumHoverDisabled] = useState<number | null>(8);

  return (
    <>
      {/* Selector Section */}
      <div id="section-selector" style={{ marginBottom: "2rem", order: 10 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          选择器组件 (Selector)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">单选 · 基础状态</h2>
            <div className="app-card__content">
              <PimaSelector label="默认状态" options={cities} value={selectedCity} onValueChange={setSelectedCity} placeholder="请选择一个城市" size="sm" />
              <PimaSelector label="已选择状态" options={colors} value={selectedColor} onValueChange={setSelectedColor} helperText="已选择一个选项" size="sm" />
              <PimaSelector label="可清除选择器" options={fruits} value={selectedCity} onValueChange={setSelectedCity} placeholder="选择后悬浮显示清除按钮" clearable helperText="悬浮时显示清除按钮，可快速清空选择" size="sm" />
              <PimaSelector label="带搜索的单选" options={cities} value={selectedCity} onValueChange={setSelectedCity} placeholder="搜索并选择城市" size="sm" searchable helperText="直接在选择器中输入关键词筛选选项" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">单选 · 验证状态</h2>
            <div className="app-card__content">
              <PimaSelector label="错误状态" options={cities} value={requiredField} onValueChange={setRequiredField} placeholder="请选择" error={true} helperText="请选择一个有效的城市" required size="sm" />
              <PimaSelector label="成功状态" options={fruits} value="apple" success={true} helperText="验证通过，选择成功！" size="sm" />
              <PimaSelector label="必填字段" options={colors} value={validatedField} onValueChange={setValidatedField} placeholder="此字段为必填" required error={!validatedField} success={!!validatedField} helperText={validatedField ? "验证通过！" : "此字段为必填项"} size="sm" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">多选 · 基础</h2>
            <div className="app-card__content">
              <PimaSelector mode="multiple" label="选择城市" options={cities} value={multiCities} onValueChange={setMultiCities} placeholder="请选择城市" size="sm" helperText="点击选项即可多选，点击标签 × 可移除" />
              <PimaSelector mode="multiple" label="可清除多选" options={fruits} value={multiFruits} onValueChange={setMultiFruits} placeholder="选择你喜欢的水果" size="sm" clearable helperText="悬浮时显示清除全部按钮" />
              <PimaSelector mode="multiple" label="带搜索的多选" options={cities} value={multiCities} onValueChange={setMultiCities} placeholder="搜索并选择城市" size="sm" searchable helperText="直接在选择器中输入关键词筛选选项" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">多选 · 高级功能</h2>
            <div className="app-card__content">
              <PimaSelector mode="multiple" label="全选 + 搜索" options={cities} value={multiCities} onValueChange={setMultiCities} placeholder="请选择" size="sm" searchable showSelectAll helperText="支持全选/反选和搜索筛选" />
              <PimaSelector mode="multiple" label="限制最多选 3 项" options={fruits} value={multiFruits} onValueChange={setMultiFruits} placeholder="最多选择 3 项" size="sm" maxSelection={3} showSelectAll helperText="达到上限后其余选项自动禁用" />
              <PimaSelector mode="multiple" label="自定义标签显示" options={cities} value={multiCities} onValueChange={setMultiCities} placeholder="请选择" size="sm" maxTagCount={2} helperText="最多显示 2 个标签，超出显示 +N" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">多选 · 状态</h2>
            <div className="app-card__content">
              <PimaSelector mode="multiple" label="错误状态" options={colors} value={multiColors} onValueChange={setMultiColors} size="sm" error required helperText="请至少选择两种颜色" />
              <PimaSelector mode="multiple" label="成功状态" options={languages} value={multiLangs} onValueChange={setMultiLangs} size="sm" success={multiLangs.length >= 2} error={multiLangs.length > 0 && multiLangs.length < 2} helperText={multiLangs.length >= 2 ? "验证通过！" : "请选择至少 2 种语言"} showSelectAll searchable />
              <PimaSelector mode="multiple" label="禁用状态" options={cities} value={["beijing", "shanghai"]} size="sm" disabled helperText="此选择器已禁用" />
            </div>
          </div>
        </div>
      </div>

      {/* TreeSelector Section */}
      <div id="section-tree-selector" style={{ marginBottom: "2rem", order: 15 }}>
        <h2 style={{ marginBottom: "1rem", color: "var(--text-main)" }}>
          树形多选选择器 (TreeSelector)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">级联多选</h2>
            <div className="app-card__content">
              <PimaTreeSelector label="选择成员" treeData={departmentTree} value={treeDept} onValueChange={setTreeDept} placeholder="请选择部门成员" size="sm" defaultExpandAll helperText="勾选父节点自动选中所有子节点" />
              <PimaTreeSelector label="选择地区" treeData={regionTree} value={treeRegion} onValueChange={setTreeRegion} placeholder="请选择地区" size="sm" defaultExpandAll clearable helperText="支持清除全部已选项" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">搜索 &amp; 高级功能</h2>
            <div className="app-card__content">
              <PimaTreeSelector label="搜索部门成员" treeData={departmentTree} value={treeDeptSearch} onValueChange={setTreeDeptSearch} placeholder="输入姓名搜索" size="sm" searchable defaultExpandAll helperText="支持按名称搜索筛选树节点" />
              <PimaTreeSelector label="非级联模式" treeData={departmentTree} value={treeDept} onValueChange={setTreeDept} placeholder="请选择" size="sm" cascade={false} defaultExpandAll helperText="每个节点独立勾选，不影响父子" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">状态变体</h2>
            <div className="app-card__content">
              <PimaTreeSelector label="错误状态" treeData={departmentTree} value={treeDept} onValueChange={setTreeDept} size="sm" error required defaultExpandAll helperText="请至少选择一个成员" />
              <PimaTreeSelector label="禁用状态" treeData={departmentTree} value={["fe-1", "be-1"]} size="sm" disabled helperText="此选择器已禁用" />
              <PimaTreeSelector label="自定义标签数" treeData={regionTree} value={treeRegion} onValueChange={setTreeRegion} size="sm" maxTagCount={2} defaultExpandAll searchable clearable helperText="最多显示 2 个标签" />
            </div>
          </div>
        </div>
      </div>

      {/* InputNumber Section */}
      <div id="section-input-number" style={{ marginBottom: "2rem", order: 7 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          数字输入框 (InputNumber)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">默认状态</h2>
            <div className="app-card__content">
              <PimaInputNumber label="基础数字输入" value={inputNumBasic} onValueChange={setInputNumBasic} placeholder="请输入数字" helperText="支持键盘上下箭头调整" />
              <PimaInputNumber label="带范围限制" value={inputNumRange} onValueChange={setInputNumRange} min={0} max={10} placeholder="0 - 10" helperText="最小值 0，最大值 10" />
              <PimaInputNumber label="自定义步长" value={inputNumStep} onValueChange={setInputNumStep} step={5} placeholder="步长为 5" helperText="每次增减 5" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">精度与前后缀</h2>
            <div className="app-card__content">
              <PimaInputNumber label="小数精度" value={inputNumPrecision} onValueChange={setInputNumPrecision} step={0.01} precision={2} placeholder="保留 2 位小数" helperText="precision=2, step=0.01" />
              <PimaInputNumber label="带前缀" value={inputNumRange} onValueChange={setInputNumRange} prefix="¥" placeholder="金额" helperText="前缀为货币符号" />
              <PimaInputNumber label="带后缀" value={inputNumStep} onValueChange={setInputNumStep} suffix="kg" placeholder="重量" helperText="后缀为单位" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">状态变体</h2>
            <div className="app-card__content">
              <PimaInputNumber label="错误状态" value={inputNumError} onValueChange={setInputNumError} error required placeholder="必填字段" helperText="请输入有效数字" />
              <PimaInputNumber label="成功状态" value={inputNumSuccess} onValueChange={setInputNumSuccess} success helperText="验证通过" />
              <PimaInputNumber label="禁用状态" value={inputNumDisabled} disabled helperText="当前不可编辑" />
              <PimaInputNumber label="无步进按钮" value={inputNumNoControls} onValueChange={setInputNumNoControls} controls={false} placeholder="纯输入模式" helperText="controls={false}" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">拨轮变体 (dial)</h2>
            <div className="app-card__content">
              <PimaInputNumber label="数量选择" variant="dial" value={inputNumDial} onValueChange={setInputNumDial} min={1} max={99} placeholder="数量" helperText="左右加减按钮，范围 1–99" />
              <PimaInputNumber label="带步长" variant="dial" value={inputNumDialRange} onValueChange={setInputNumDialRange} min={0} max={100} step={10} placeholder="步长 10" helperText="step=10, min=0, max=100" />
              <PimaInputNumber label="禁用拨轮" variant="dial" value={inputNumDialDisabled} disabled helperText="当前不可操作" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">悬浮显示按钮 (hover)</h2>
            <div className="app-card__content">
              <PimaInputNumber label="基础用法" variant="hover" value={inputNumHover} onValueChange={setInputNumHover} min={0} max={100} placeholder="悬浮显示按钮" helperText="鼠标悬浮或聚焦时显示步进按钮" />
              <PimaInputNumber label="带步长" variant="hover" value={inputNumHoverStep} onValueChange={setInputNumHoverStep} min={0} max={100} step={10} placeholder="步长 10" helperText="step=10, hover 时显示控制按钮" />
              <PimaInputNumber label="禁用状态" variant="hover" value={inputNumHoverDisabled} disabled helperText="禁用时不显示按钮" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
