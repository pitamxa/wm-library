import React, { useState } from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import {
  PimaDatePicker, PimaCheckbox, PimaTextarea,
  PimaInput, PimaSearch,
} from "../index";
import { hobbies } from "./showcase-data";

export function DataEntryBundleC() {
  // DatePicker states
  const [dateBasic, setDateBasic] = useState<Date | undefined>(undefined);
  const [dateWithValue, setDateWithValue] = useState<Date | undefined>(new Date());
  const [dateError, setDateError] = useState<Date | undefined>(undefined);
  const [dateSuccess, setDateSuccess] = useState<Date | undefined>(new Date());
  const [dateTimeBasic, setDateTimeBasic] = useState<Date | undefined>(undefined);
  const [dateTimeWithValue, setDateTimeWithValue] = useState<Date | undefined>(new Date());
  const [dateTimeWithSeconds, setDateTimeWithSeconds] = useState<Date | undefined>(new Date());
  const [weekPicker, setWeekPicker] = useState<Date | undefined>(undefined);
  const [monthPicker, setMonthPicker] = useState<Date | undefined>(undefined);
  const [yearPicker, setYearPicker] = useState<Date | undefined>(undefined);
  const [dateRangeBasic, setDateRangeBasic] = useState<{ from: Date | undefined; to?: Date }>({ from: undefined });
  const [dateRangeWithValue, setDateRangeWithValue] = useState<{ from: Date | undefined; to?: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  // Checkbox states
  const [cbDefault, setCbDefault] = useState<boolean>(false);
  const [cbAllChecked, setCbAllChecked] = useState<boolean>(true);
  const [cbIndeterminate, setCbIndeterminate] = useState<boolean | "indeterminate">("indeterminate");
  const [cbGroup, setCbGroup] = useState<boolean[]>([true, false, true]);
  const cbGroupLabels = ["选项一", "选项二", "选项三"];
  const cbGroupAllChecked = cbGroup.every(Boolean);
  const cbGroupSomeChecked = cbGroup.some(Boolean) && !cbGroupAllChecked;
  const cbGroupHeaderState: boolean | "indeterminate" = cbGroupAllChecked ? true : cbGroupSomeChecked ? "indeterminate" : false;
  const handleCbGroupHeader = (v: boolean | "indeterminate") => { const next = v === true; setCbGroup([next, next, next]); };
  const handleCbGroupItem = (idx: number, v: boolean) => { setCbGroup((prev) => prev.map((val, i) => (i === idx ? v : val))); };
  const [hobbiesSelected, setHobbiesSelected] = useState<string[]>([]);
  // Textarea states
  const [textareaBasic, setTextareaBasic] = useState<string>("");
  const [textareaWithValue, setTextareaWithValue] = useState<string>("这是一段预填充的文本内容。");
  const [textareaRequired, setTextareaRequired] = useState<string>("");
  const [textareaWithLimit, setTextareaWithLimit] = useState<string>("");
  const [textareaAutoResize, setTextareaAutoResize] = useState<string>("");
  // Input states
  const [inputBasic, setInputBasic] = useState<string>("");
  const [inputUsername, setInputUsername] = useState<string>("用户名");
  const [inputEmail, setInputEmail] = useState<string>("example@email.com");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [inputPhone, setInputPhone] = useState<string>("");
  const [inputWithLimit, setInputWithLimit] = useState<string>("");
  // Search states
  const [searchControlled, setSearchControlled] = useState<string>("");

  return (
    <>
      {/* DatePicker Section */}
      <div id="section-datepicker" style={{ marginBottom: "2rem", order: 4 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          日期选择器组件 (DatePicker)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础状态</h2>
            <div className="app-card__content">
              <PimaDatePicker label="默认状态" date={dateBasic} onDateChange={setDateBasic} placeholder="选择日期" size="sm" />
              <PimaDatePicker label="已选择状态" date={dateWithValue} onDateChange={setDateWithValue} helperText="已选择一个日期" size="sm" />
              <PimaDatePicker label="悬停 &amp; 聚焦状态" placeholder="点击或使用键盘导航" helperText="支持键盘导航和无障碍访问" size="sm" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">验证状态</h2>
            <div className="app-card__content">
              <PimaDatePicker label="错误状态" date={dateError} onDateChange={setDateError} placeholder="请选择日期" error={true} helperText="请选择一个有效日期" required size="sm" />
              <PimaDatePicker label="成功状态" date={dateSuccess} onDateChange={setDateSuccess} success={true} helperText="验证通过！" size="sm" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">日期时间选择</h2>
            <div className="app-card__content">
              <PimaDatePicker label="日期+时间" mode="datetime" date={dateTimeBasic} onDateChange={setDateTimeBasic} placeholder="选择日期和时间" size="sm" />
              <PimaDatePicker label="已填写" mode="datetime" date={dateTimeWithValue} onDateChange={setDateTimeWithValue} helperText="包含日期和时间" size="sm" />
              <PimaDatePicker label="含秒" mode="datetime" date={dateTimeWithSeconds} onDateChange={setDateTimeWithSeconds} showSeconds size="sm" helperText="显示秒级精度" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">特殊模式</h2>
            <div className="app-card__content">
              <PimaDatePicker label="周选择器" mode="week" date={weekPicker} onDateChange={setWeekPicker} placeholder="选择周" size="sm" />
              <PimaDatePicker label="月选择器" mode="month" date={monthPicker} onDateChange={setMonthPicker} placeholder="选择月份" size="sm" />
              <PimaDatePicker label="年选择器" mode="year" date={yearPicker} onDateChange={setYearPicker} placeholder="选择年份" size="sm" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">日期范围</h2>
            <div className="app-card__content">
              <PimaDatePicker label="日期范围（空）" mode="range" range={dateRangeBasic} onRangeChange={setDateRangeBasic} placeholder="选择起止日期" size="sm" />
              <PimaDatePicker label="日期范围（有值）" mode="range" range={dateRangeWithValue} onRangeChange={setDateRangeWithValue} helperText="已选择近7天" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Checkbox Section */}
      <div id="section-checkbox" style={{ marginBottom: "2rem", order: 3 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          复选框组件 (Checkbox)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">状态展示</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
              <div className={`wm-checkbox-item wm-checkbox-item--default${cbDefault ? " wm-checkbox-item--checked" : ""}`}>
                <RadixCheckbox.Root checked={cbDefault} onCheckedChange={(v) => setCbDefault(v === true)} className={`wm-checkbox-item__box wm-checkbox-item__box--default${cbDefault ? " wm-checkbox-item__box--checked" : ""}`} id="cb-s-default">
                  <RadixCheckbox.Indicator className="wm-checkbox-item__indicator"><Check className="wm-checkbox-item__icon wm-checkbox-item__icon--default" /></RadixCheckbox.Indicator>
                </RadixCheckbox.Root>
                <label htmlFor="cb-s-default" className="wm-checkbox-item__label wm-checkbox-item__label--default">默认</label>
              </div>
              <div className={`wm-checkbox-item wm-checkbox-item--default${cbAllChecked ? " wm-checkbox-item--checked" : ""}`}>
                <RadixCheckbox.Root checked={cbAllChecked} onCheckedChange={(v) => setCbAllChecked(v === true)} className={`wm-checkbox-item__box wm-checkbox-item__box--default${cbAllChecked ? " wm-checkbox-item__box--checked" : ""}`} id="cb-s-all">
                  <RadixCheckbox.Indicator className="wm-checkbox-item__indicator"><Check className="wm-checkbox-item__icon wm-checkbox-item__icon--default" /></RadixCheckbox.Indicator>
                </RadixCheckbox.Root>
                <label htmlFor="cb-s-all" className="wm-checkbox-item__label wm-checkbox-item__label--default">全选</label>
              </div>
              <div className="wm-checkbox-item wm-checkbox-item--default">
                <RadixCheckbox.Root checked={cbIndeterminate} onCheckedChange={(v) => setCbIndeterminate(v === true ? true : false)} className={`wm-checkbox-item__box wm-checkbox-item__box--default${cbIndeterminate !== false ? " wm-checkbox-item__box--checked" : ""}`} id="cb-s-indeterminate">
                  <RadixCheckbox.Indicator className="wm-checkbox-item__indicator">
                    {cbIndeterminate === "indeterminate" ? <Minus className="wm-checkbox-item__icon wm-checkbox-item__icon--default" /> : <Check className="wm-checkbox-item__icon wm-checkbox-item__icon--default" />}
                  </RadixCheckbox.Indicator>
                </RadixCheckbox.Root>
                <label htmlFor="cb-s-indeterminate" className="wm-checkbox-item__label wm-checkbox-item__label--default">半选</label>
              </div>
              <div className="wm-checkbox-item wm-checkbox-item--default wm-checkbox-item--disabled">
                <RadixCheckbox.Root checked={false} disabled className="wm-checkbox-item__box wm-checkbox-item__box--default wm-checkbox-item__box--disabled" id="cb-s-disabled">
                  <RadixCheckbox.Indicator className="wm-checkbox-item__indicator"><Check className="wm-checkbox-item__icon wm-checkbox-item__icon--default" /></RadixCheckbox.Indicator>
                </RadixCheckbox.Root>
                <label htmlFor="cb-s-disabled" className="wm-checkbox-item__label wm-checkbox-item__label--default wm-checkbox-item__label--disabled">禁用</label>
              </div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">禁用状态</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
              <div className="wm-checkbox-item wm-checkbox-item--default wm-checkbox-item--disabled wm-checkbox-item--checked">
                <RadixCheckbox.Root checked={true} disabled className="wm-checkbox-item__box wm-checkbox-item__box--default wm-checkbox-item__box--checked wm-checkbox-item__box--disabled" id="cb-d-all">
                  <RadixCheckbox.Indicator forceMount className="wm-checkbox-item__indicator"><Check className="wm-checkbox-item__icon wm-checkbox-item__icon--default" /></RadixCheckbox.Indicator>
                </RadixCheckbox.Root>
                <label htmlFor="cb-d-all" className="wm-checkbox-item__label wm-checkbox-item__label--default wm-checkbox-item__label--disabled">全选</label>
              </div>
              <div className="wm-checkbox-item wm-checkbox-item--default wm-checkbox-item--disabled">
                <RadixCheckbox.Root checked="indeterminate" disabled className="wm-checkbox-item__box wm-checkbox-item__box--default wm-checkbox-item__box--indeterminate wm-checkbox-item__box--disabled" id="cb-d-indeterminate">
                  <RadixCheckbox.Indicator forceMount className="wm-checkbox-item__indicator"><Minus className="wm-checkbox-item__icon wm-checkbox-item__icon--default" /></RadixCheckbox.Indicator>
                </RadixCheckbox.Root>
                <label htmlFor="cb-d-indeterminate" className="wm-checkbox-item__label wm-checkbox-item__label--default wm-checkbox-item__label--disabled">半选</label>
              </div>
              <div className="wm-checkbox-item wm-checkbox-item--default wm-checkbox-item--disabled">
                <RadixCheckbox.Root checked={false} disabled className="wm-checkbox-item__box wm-checkbox-item__box--default wm-checkbox-item__box--disabled" id="cb-d-default">
                  <RadixCheckbox.Indicator className="wm-checkbox-item__indicator"><Check className="wm-checkbox-item__icon wm-checkbox-item__icon--default" /></RadixCheckbox.Indicator>
                </RadixCheckbox.Root>
                <label htmlFor="cb-d-default" className="wm-checkbox-item__label wm-checkbox-item__label--default wm-checkbox-item__label--disabled">默认</label>
              </div>
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">Checkbox 组</h2>
            <div className="app-card__content" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
              <div className={`wm-checkbox-item wm-checkbox-item--default${cbGroupAllChecked ? " wm-checkbox-item--checked" : ""}`} style={{ paddingBottom: "var(--spacing-8)", borderBottom: "1px solid var(--border-split)" }}>
                <RadixCheckbox.Root checked={cbGroupHeaderState} onCheckedChange={(v) => handleCbGroupHeader(v as boolean | "indeterminate")} className={`wm-checkbox-item__box wm-checkbox-item__box--default${cbGroupHeaderState !== false ? " wm-checkbox-item__box--checked" : ""}`} id="cb-g-header">
                  <RadixCheckbox.Indicator className="wm-checkbox-item__indicator">
                    {cbGroupHeaderState === "indeterminate" ? <Minus className="wm-checkbox-item__icon wm-checkbox-item__icon--default" /> : <Check className="wm-checkbox-item__icon wm-checkbox-item__icon--default" />}
                  </RadixCheckbox.Indicator>
                </RadixCheckbox.Root>
                <label htmlFor="cb-g-header" className="wm-checkbox-item__label wm-checkbox-item__label--default" style={{ color: "var(--text-primary)" }}>全选</label>
              </div>
              {cbGroupLabels.map((label, idx) => (
                <div key={idx} className={`wm-checkbox-item wm-checkbox-item--default${cbGroup[idx] ? " wm-checkbox-item--checked" : ""}`}>
                  <RadixCheckbox.Root checked={cbGroup[idx]} onCheckedChange={(v) => handleCbGroupItem(idx, v === true)} className={`wm-checkbox-item__box wm-checkbox-item__box--default${cbGroup[idx] ? " wm-checkbox-item__box--checked" : ""}`} id={`cb-g-${idx}`}>
                    <RadixCheckbox.Indicator className="wm-checkbox-item__indicator"><Check className="wm-checkbox-item__icon wm-checkbox-item__icon--default" /></RadixCheckbox.Indicator>
                  </RadixCheckbox.Root>
                  <label htmlFor={`cb-g-${idx}`} className="wm-checkbox-item__label wm-checkbox-item__label--default">{label}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">PimaCheckbox 组件</h2>
            <div className="app-card__content">
              <PimaCheckbox label="兴趣爱好" options={hobbies} value={hobbiesSelected} onValueChange={setHobbiesSelected} orientation="horizontal" size="sm" helperText="选择您的兴趣爱好" />
            </div>
          </div>
        </div>
      </div>

      {/* Textarea Section */}
      <div id="section-textarea" style={{ marginBottom: "2rem", order: 13 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          文本域组件 (Textarea)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础状态</h2>
            <div className="app-card__content">
              <PimaTextarea label="默认状态" value={textareaBasic} onValueChange={setTextareaBasic} placeholder="输入文本" />
              <PimaTextarea label="已填充状态" value={textareaWithValue} onValueChange={setTextareaWithValue} helperText="已填充文本内容" />
              <PimaTextarea label="悬停 &amp; 聚焦状态" placeholder="点击或使用键盘导航" helperText="支持键盘导航和无障碍访问" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">验证状态</h2>
            <div className="app-card__content">
              <PimaTextarea label="错误状态" value={textareaRequired} onValueChange={setTextareaRequired} placeholder="请输入" error={true} helperText="请输入有效的文本" required />
              <PimaTextarea label="成功状态" value="这是一段成功的文本内容。" onValueChange={setTextareaRequired} success={true} helperText="验证通过，输入成功！" />
              <PimaTextarea label="必填字段" value={textareaWithLimit} onValueChange={setTextareaWithLimit} placeholder="此字段为必填" required error={!textareaWithLimit} success={!!textareaWithLimit} helperText={textareaWithLimit ? "验证通过！" : "此字段为必填项"} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">特殊功能</h2>
            <div className="app-card__content">
              <PimaTextarea label="自动调整大小" value={textareaAutoResize} onValueChange={setTextareaAutoResize} placeholder="输入文本..." autoResize={true} minRows={2} maxRows={8} helperText="根据内容自动调整大小（最小2行，最大8行）" />
              <PimaTextarea label="字符计数" value={textareaWithLimit} onValueChange={setTextareaWithLimit} placeholder="输入不超过200字的文本..." maxLength={200} showCount={true} helperText="显示字符计数" />
              <PimaTextarea label="只读文本" value="这是只读文本，无法编辑。" readOnly={true} helperText="此文本为只读模式" />
              <PimaTextarea label="禁用状态" value="这是禁用状态的文本。" disabled={true} helperText="此功能暂不可用" />
            </div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div id="section-input" style={{ marginBottom: "2rem", order: 6 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          输入框组件 (Input)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础状态</h2>
            <div className="app-card__content">
              <PimaInput label="默认状态" value={inputBasic} onValueChange={setInputBasic} placeholder="输入文本" clearable />
              <PimaInput label="已填充状态" value={inputUsername} onValueChange={setInputUsername} placeholder="用户名" helperText="已填充文本内容" clearable />
              <PimaInput label="悬停 &amp; 聚焦状态" placeholder="点击或使用键盘导航" helperText="支持键盘导航和无障碍访问" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">验证状态</h2>
            <div className="app-card__content">
              <PimaInput label="错误状态" value={inputEmail} onValueChange={setInputEmail} placeholder="请输入有效的电子邮件" error={true} helperText="请输入有效的电子邮件地址" required />
              <PimaInput label="成功状态" value="example@email.com" onValueChange={setInputEmail} success={true} helperText="验证通过，输入成功！" />
              <PimaInput label="必填字段" value={inputWithLimit} onValueChange={setInputWithLimit} placeholder="此字段为必填" required error={!inputWithLimit} success={!!inputWithLimit} helperText={inputWithLimit ? "验证通过！" : "此字段为必填项"} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">特殊功能</h2>
            <div className="app-card__content">
              <PimaInput label="字符计数" value={inputPhone} onValueChange={setInputPhone} placeholder="输入不超过200字的文本..." maxLength={200} showCount={true} helperText="显示字符计数" />
              <PimaInput label="只读文本" value="这是只读文本，无法编辑。" readOnly={true} helperText="此文本为只读模式" />
              <PimaInput label="禁用状态" value="这是禁用状态的文本。" disabled={true} helperText="此功能暂不可用" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">组合状态</h2>
            <div className="app-card__content">
              <PimaInput label="错误 + 必填" value={inputEmail} onValueChange={setInputEmail} error={true} required={true} size="sm" placeholder="此字段为必填项" helperText="请输入有效内容" clearable />
              <PimaInput label="成功 + 字符计数" value={inputUsername} onValueChange={setInputUsername} success={true} size="sm" maxLength={300} showCount={true} helperText="验证通过，内容成功！" />
              <PimaInput label="密码 + 字符计数" value={inputPassword} onValueChange={setInputPassword} type="password" size="sm" maxLength={500} showCount={true} helperText="密码输入并显示字符计数" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div id="section-search" style={{ marginBottom: "2rem", order: 9 }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-1-default)" }}>
          搜索框组件 (Search)
        </h2>
        <div className="app-grid">
          <div className="app-card">
            <h2 className="app-card__title">基础状态</h2>
            <div className="app-card__content">
              <PimaSearch label="默认状态" size="sm" onSearch={(val) => alert(`搜索: ${val}`)} placeholder="请输入关键词" />
              <PimaSearch label="禁用状态" size="sm" disabled placeholder="禁止输入" onSearch={(val) => console.log(val)} />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">验证状态</h2>
            <div className="app-card__content">
              <PimaSearch label="错误状态" size="sm" error="搜索内容包含非法字符" status="error" onSearch={(val) => alert(`搜索: ${val}`)} />
              <PimaSearch label="受控模式" size="sm" value={searchControlled} onChange={(e) => setSearchControlled(e.target.value)} onClear={() => setSearchControlled("")} onSearch={(val) => alert(`搜索: ${val}`)} placeholder="输入值受状态控制" />
            </div>
          </div>
          <div className="app-card">
            <h2 className="app-card__title">交互演示</h2>
            <div className="app-card__content">
              <PimaSearch label="带回调的搜索" size="sm" onSearch={(val) => { if (!val) { alert("请输入搜索内容"); } else { alert(`正在搜索: ${val}`); } }} onClear={() => alert("已清除内容")} placeholder="尝试输入、回车或点击搜索按钮" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
