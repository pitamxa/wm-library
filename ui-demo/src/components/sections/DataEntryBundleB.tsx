import React, { useState } from "react";
import { PimaRadio, PimaSlider, PimaRangeSlider, PimaSliderWithInput, PimaSwitch } from "../index";
import { genders, plans, colors, languages } from "./showcase-data";

export function DataEntryBundleB() {
  // Radio states
  const [gender, setGender] = useState<string>("");
  const [plan, setPlan] = useState<string>("");
  const [favoriteColor, setFavoriteColor] = useState<string>("blue");
  const [requiredRadio, setRequiredRadio] = useState<string>("");
  const [solid2, setSolid2] = useState<string>("1");
  const [solid3, setSolid3] = useState<string>("2");
  const [solid4, setSolid4] = useState<string>("2");
  // Slider states
  const [sliderBasic, setSliderBasic] = useState<number>(30);
  const [sliderStep, setSliderStep] = useState<number>(20);
  const [sliderMarks, setSliderMarks] = useState<number>(40);
  const [sliderDisabled] = useState<number>(50);
  const [sliderRange, setSliderRange] = useState<[number, number]>([20, 60]);
  const [sliderRangeStep, setSliderRangeStep] = useState<[number, number]>([25, 75]);
  const [sliderWithInput, setSliderWithInput] = useState<number>(30);
  const [sliderWithInputStep, setSliderWithInputStep] = useState<number>(4);
  const [sliderWithInputDisabled] = useState<number>(50);
  // Switch states
  const [switchBasic, setSwitchBasic] = useState<boolean>(false);
  const [switchWithText, setSwitchWithText] = useState<boolean>(true);
  const [switchRequired, setSwitchRequired] = useState<boolean>(false);
  const [switchDisabled] = useState<boolean>(true);
  const [switchError, setSwitchError] = useState<boolean>(false);
  const [switchSuccess, setSwitchSuccess] = useState<boolean>(true);
  const [switchLoading] = useState<boolean>(false);

  return (
    <>
      {/* Radio Section */}
      <div id="section-radio" style={{ marginBottom: "2rem", order: 8 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          单选按钮组件 (Radio)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础状态</h2>
            <div className="app-card__content">
              <PimaRadio label="默认状态" options={genders} value={gender} onValueChange={setGender} helperText="请选择您的性别" />
              <PimaRadio label="带描述的选项" options={plans} value={plan} onValueChange={setPlan} helperText="选择适合您的计划" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">验证状态</h2>
            <div className="app-card__content">
              <PimaRadio label="错误状态" options={genders} value={requiredRadio} onValueChange={setRequiredRadio} error={true} required helperText="请选择一个选项" />
              <PimaRadio label="成功状态" options={colors} value="green" success={true} helperText="验证通过！" />
              <PimaRadio label="禁用状态" options={languages} value="zh" disabled={true} helperText="当前无法修改" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">尺寸变体</h2>
            <div className="app-card__content">
              <PimaRadio label="小尺寸 (sm)" options={genders} value={gender} onValueChange={setGender} size="sm" helperText="紧凑的小尺寸" />
              <PimaRadio label="大尺寸 (lg)" options={genders} value={gender} onValueChange={setGender} size="lg" helperText="较大的尺寸" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">卡片样式</h2>
            <div className="app-card__content">
              <PimaRadio label="卡片样式 - 垂直" options={plans} value={plan} onValueChange={setPlan} radioStyle="card" helperText="卡片样式更加突出" />
              <PimaRadio label="卡片样式 - 水平" options={genders} value={gender} onValueChange={setGender} radioStyle="card" orientation="horizontal" helperText="水平排列的卡片" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">按钮样式</h2>
            <div className="app-card__content">
              <PimaRadio label="按钮样式 - 垂直" options={colors.slice(0, 3)} value={favoriteColor} onValueChange={setFavoriteColor} radioStyle="button" helperText="按钮样式的单选框" />
              <PimaRadio label="按钮样式 - 水平" options={genders} value={gender} onValueChange={setGender} radioStyle="button" orientation="horizontal" helperText="水平排列的按钮" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">实心按钮样式</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <PimaRadio label="2 个选项" options={[{ label: "选项一", value: "1" }, { label: "选项二", value: "2" }]} value={solid2} onValueChange={setSolid2} radioStyle="solid" orientation="horizontal" />
              <PimaRadio label="3 个选项" options={[{ label: "选项一", value: "1" }, { label: "选项二", value: "2" }, { label: "选项三", value: "3" }]} value={solid3} onValueChange={setSolid3} radioStyle="solid" orientation="horizontal" />
              <PimaRadio label="4 个选项" options={[{ label: "选项一", value: "1" }, { label: "选项二", value: "2" }, { label: "选项三", value: "3" }, { label: "选项四", value: "4" }]} value={solid4} onValueChange={setSolid4} radioStyle="solid" orientation="horizontal" helperText="模拟 Segmented Control 效果" />
            </div>
          </div>
        </div>
      </div>

      {/* Slider Section */}
      <div id="section-slider" style={{ marginBottom: "2rem", order: 11 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          滑动输入条组件 (Slider)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础滑块</h2>
            <div className="app-card__content">
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-24)" }}>
                <div>
                  <p style={{ marginBottom: "var(--spacing-12)", fontSize: "var(--fontsize-14)", color: "var(--text-secondary)" }}>默认滑块 (0-100)</p>
                  <PimaSlider value={sliderBasic} onChange={setSliderBasic} min={0} max={100} />
                  <p style={{ marginTop: "var(--spacing-8)", fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)" }}>当前值: {sliderBasic}</p>
                </div>
                <div>
                  <p style={{ marginBottom: "var(--spacing-12)", fontSize: "var(--fontsize-14)", color: "var(--text-secondary)" }}>自定义范围 (20-80, 初始值50)</p>
                  <PimaSlider defaultValue={50} min={20} max={80} />
                </div>
                <div>
                  <p style={{ marginBottom: "var(--spacing-12)", fontSize: "var(--fontsize-14)", color: "var(--text-secondary)" }}>禁用状态</p>
                  <PimaSlider value={sliderDisabled} onChange={() => {}} disabled />
                </div>
              </div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">步长和标记点</h2>
            <div className="app-card__content">
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-32)" }}>
                <div>
                  <p style={{ marginBottom: "var(--spacing-12)", fontSize: "var(--fontsize-14)", color: "var(--text-secondary)" }}>步长为 10</p>
                  <PimaSlider value={sliderStep} onChange={setSliderStep} min={0} max={100} step={10} />
                  <p style={{ marginTop: "var(--spacing-8)", fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)" }}>当前值: {sliderStep}</p>
                </div>
                <div>
                  <p style={{ marginBottom: "var(--spacing-12)", fontSize: "var(--fontsize-14)", color: "var(--text-secondary)" }}>带标记点</p>
                  <PimaSlider value={sliderMarks} onChange={setSliderMarks} min={0} max={100} step={10} marks={{ 0: "0°C", 25: "25°C", 50: "50°C", 75: "75°C", 100: "100°C" }} />
                </div>
                <div>
                  <p style={{ marginBottom: "var(--spacing-12)", fontSize: "var(--fontsize-14)", color: "var(--text-secondary)" }}>仅标记点（步长20）</p>
                  <PimaSlider defaultValue={40} min={0} max={100} step={20} marks={[{ value: 0, label: "Low" }, { value: 20 }, { value: 40 }, { value: 60 }, { value: 80 }, { value: 100, label: "High" }]} />
                </div>
              </div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">范围滑块</h2>
            <div className="app-card__content">
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-32)" }}>
                <div>
                  <p style={{ marginBottom: "var(--spacing-12)", fontSize: "var(--fontsize-14)", color: "var(--text-secondary)" }}>基础范围滑块</p>
                  <PimaRangeSlider value={sliderRange} onChange={setSliderRange} min={0} max={100} />
                  <p style={{ marginTop: "var(--spacing-8)", fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)" }}>当前范围: [{sliderRange[0]}, {sliderRange[1]}]</p>
                </div>
                <div>
                  <p style={{ marginBottom: "var(--spacing-12)", fontSize: "var(--fontsize-14)", color: "var(--text-secondary)" }}>步长为 25</p>
                  <PimaRangeSlider value={sliderRangeStep} onChange={setSliderRangeStep} min={0} max={100} step={25} />
                  <p style={{ marginTop: "var(--spacing-8)", fontSize: "var(--fontsize-12)", color: "var(--text-tertiary)" }}>当前范围: [{sliderRangeStep[0]}, {sliderRangeStep[1]}]</p>
                </div>
              </div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">带输入框的滑块</h2>
            <div className="app-card__content">
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-32)" }}>
                <div>
                  <p style={{ marginBottom: "var(--spacing-12)", fontSize: "var(--fontsize-14)", color: "var(--text-secondary)" }}>滑块 + 输入框</p>
                  <PimaSliderWithInput value={sliderWithInput} onChange={setSliderWithInput} min={0} max={100} />
                </div>
                <div>
                  <p style={{ marginBottom: "var(--spacing-12)", fontSize: "var(--fontsize-14)", color: "var(--text-secondary)" }}>步长为 2</p>
                  <PimaSliderWithInput value={sliderWithInputStep} onChange={setSliderWithInputStep} min={0} max={10} step={2} />
                </div>
                <div>
                  <p style={{ marginBottom: "var(--spacing-12)", fontSize: "var(--fontsize-14)", color: "var(--text-secondary)" }}>禁用状态</p>
                  <PimaSliderWithInput value={sliderWithInputDisabled} onChange={() => {}} min={0} max={100} disabled />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Switch Section */}
      <div id="section-switch" style={{ marginBottom: "2rem", order: 12 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          开关组件 (Switch) - 统一圆角样式
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础状态</h2>
            <div className="app-card__content">
              <PimaSwitch label="默认开关" checked={switchBasic} onCheckedChange={setSwitchBasic} helperText="点击切换状态" />
              <PimaSwitch label="已开启状态" checked={switchWithText} onCheckedChange={setSwitchWithText} helperText="显示当前状态文本" />
              <PimaSwitch label="禁用状态" checked={switchDisabled} onCheckedChange={() => {}} disabled={true} helperText="当前无法修改" />
              <PimaSwitch label="加载状态" checked={switchLoading} onCheckedChange={() => {}} loading={true} helperText="正在处理中..." />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">验证状态</h2>
            <div className="app-card__content">
              <PimaSwitch label="错误状态" checked={switchError} onCheckedChange={setSwitchError} error={true} required helperText="需要开启此选项" />
              <PimaSwitch label="成功状态" checked={switchSuccess} onCheckedChange={setSwitchSuccess} success={true} helperText="设置成功！" />
              <PimaSwitch label="必填字段" checked={switchRequired} onCheckedChange={setSwitchRequired} required error={!switchRequired} success={!!switchRequired} helperText={switchRequired ? "验证通过！" : "此选项为必选"} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">尺寸变体</h2>
            <div className="app-card__content">
              <PimaSwitch label="小尺寸 (sm)" checked={switchBasic} onCheckedChange={setSwitchBasic} size="sm" helperText="紧凑的小尺寸" />
              <PimaSwitch label="默认尺寸 (default)" checked={switchWithText} onCheckedChange={setSwitchWithText} size="default" helperText="标准尺寸" />
              <PimaSwitch label="大尺寸 (lg)" checked={switchRequired} onCheckedChange={setSwitchRequired} size="lg" helperText="较大的尺寸" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">特殊状态</h2>
            <div className="app-card__content">
              <PimaSwitch label="加载中 - 关闭" checked={false} loading={true} helperText="正在处理请求..." />
              <PimaSwitch label="加载中 - 开启" checked={true} loading={true} helperText="正在保存设置..." />
              <PimaSwitch label="禁用 - 关闭" checked={false} disabled={true} helperText="此功能暂不可用" />
              <PimaSwitch label="禁用 - 开启" checked={true} disabled={true} helperText="此设置已锁定" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
