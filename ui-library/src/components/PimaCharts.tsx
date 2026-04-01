import React, { useState, useRef, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  Sector
} from 'recharts';
import { PimaButton } from './PimaButton';
import { PimaRadio } from './PimaRadio';
import { PimaTag } from './PimaTag';
import { motion } from "motion/react";
import "../styles/charts.css";

// --- Chart Wrapper to avoid width/height 0 errors ---
const ChartContainer = ({ children, height = 350 }: { children: React.ReactNode; height?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      if (el.clientWidth > 0) {
        setReady(true);
      }
    };
    check();
    if (!ready) {
      const raf = requestAnimationFrame(check);
      const timer = setTimeout(check, 100);
      return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
    }
  }, [ready]);

  return (
    <div ref={ref} style={{ width: '100%', minWidth: 0, height: `${height}px` }}>
      {ready && (
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      )}
    </div>
  );
};

// --- Data Mocks ---

const barData6Months = [
  { name: '1\u6708', value: 4000 },
  { name: '2\u6708', value: 8000 },
  { name: '3\u6708', value: 5500 },
  { name: '4\u6708', value: 2000 },
  { name: '5\u6708', value: 5000 },
  { name: '6\u6708', value: 6000 },
];

const barDataYear = [
  { name: '1\u6708', value: 4000 },
  { name: '2\u6708', value: 8000 },
  { name: '3\u6708', value: 5500 },
  { name: '4\u6708', value: 2000 },
  { name: '5\u6708', value: 5000 },
  { name: '6\u6708', value: 6000 },
  { name: '7\u6708', value: 7000 },
  { name: '8\u6708', value: 8500 },
  { name: '9\u6708', value: 6000 },
  { name: '10\u6708', value: 4500 },
  { name: '11\u6708', value: 3000 },
  { name: '12\u6708', value: 5000 },
];

const lineDataRevenue = [
  { name: '2\u6708', value: 5000 },
  { name: '3\u6708', value: 3000 },
  { name: '4\u6708', value: 2000 },
  { name: '5\u6708', value: 4000 },
  { name: '6\u6708', value: 1500 },
  { name: '7\u6708', value: 4500 },
];

const lineDataProfit = [
  { name: '2\u6708', value: 3000 },
  { name: '3\u6708', value: 4500 },
  { name: '4\u6708', value: 1500 },
  { name: '5\u6708', value: 3000 },
  { name: '6\u6708', value: 4000 },
  { name: '7\u6708', value: 2500 },
];

const areaData = [
  { name: '1\u6708', current: 4000, previous: 2400 },
  { name: '2\u6708', current: 3000, previous: 1398 },
  { name: '3\u6708', current: 2000, previous: 9800 },
  { name: '4\u6708', current: 2780, previous: 3908 },
  { name: '5\u6708', current: 1890, previous: 4800 },
  { name: '6\u6708', current: 2390, previous: 3800 },
  { name: '7\u6708', current: 3490, previous: 4300 },
];

// Smoother area data to match image curve
const areaDataSmooth = [
  { name: '1\u6708', current: 1000, previous: 500 },
  { name: '2\u6708', current: 2500, previous: 1200 },
  { name: '3\u6708', current: 4500, previous: 3800 },
  { name: '4\u6708', current: 3200, previous: 2800 },
  { name: '5\u6708', current: 6000, previous: 4800 },
  { name: '6\u6708', current: 7500, previous: 6000 },
];

const pieDataBrowser = [
  { name: 'Chrome', value: 400 },
  { name: 'Firefox', value: 300 },
  { name: 'Safari', value: 300 },
  { name: 'Edge', value: 200 },
];

const pieDataOS = [
  { name: 'Windows', value: 500 },
  { name: 'Mac', value: 400 },
  { name: 'Linux', value: 100 },
  { name: 'iOS', value: 300 },
];

// --- Colors from CSS Variables ---
// We can't easily read CSS vars in JS without a hook or helper, but we know the hex values from Guidelines.md.
// Or we can use the variable string "var(--name)" for some SVG props, but for others (like Tooltip content style) we might need values.
// Recharts 'fill' and 'stroke' accept CSS variables.

const COLORS = {
  primary: 'var(--primary-1-default)',
  success: 'var(--success-1)',
  warning: 'var(--warning-1)',
  error: 'var(--error-1)',
  text: 'var(--text-secondary)',
  grid: 'var(--border-main)', // Assuming border-main matches gray-5 or similar
  chart1: 'var(--primary-1-default)',
  chart2: 'var(--success-1)',
  chart3: 'var(--warning-1)',
  chart4: 'var(--error-1)',
};

const PIE_COLORS = [
  'var(--primary-1-default)',
  'var(--success-1)',
  'var(--warning-1)',
  'var(--error-1)',
];

// --- Helper Components ---

const ChartToggle = ({ options, active, onChange }: { options: { label: string; value: string }[]; active: string; onChange: (v: string) => void }) => {
  return (
    <PimaRadio
      options={options}
      value={active}
      onValueChange={onChange}
      radioStyle="solid"
      orientation="horizontal"
      size="sm"
      style={{ width: 'auto' }}
    />
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          backgroundColor: 'var(--white)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-4)',
          boxShadow: 'var(--elevation-sm)'
        }}
      >
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ margin: '4px 0 0 0', color: entry.color || COLORS.primary, fontSize: '12px' }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </motion.div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  if (!payload) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      flexWrap: 'wrap',
      marginTop: '10px'
    }}>
      {payload.map((entry: any, index: number) => (
        <PimaTag
          key={`legend-${index}`}
          color={entry.color}
          tagStyle="outlined"
          size="sm"
          style={{ cursor: 'default' }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: entry.color, flexShrink: 0 }} />
            {entry.value}
          </span>
        </PimaTag>
      ))}
    </div>
  );
};

const PieCustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    const color = entry.payload.fill || entry.color || COLORS.primary;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          backgroundColor: 'var(--white)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-4)',
          boxShadow: 'var(--elevation-sm)'
        }}
      >
        <p style={{ margin: 0, color: color, fontSize: '12px', fontWeight: 600 }}>
          {entry.name}: {entry.value}
        </p>
      </motion.div>
    );
  }
  return null;
};

// --- Main Chart Components ---

export const InteractiveBarChart = () => {
  const [range, setRange] = useState<'6m' | '1y'>('6m');
  const data = range === '6m' ? barData6Months : barDataYear;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ minWidth: '120px' }}>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 400, color: 'var(--text-main)' }}>{'\u4ea4\u4e92\u5f0f\u67f1\u72b6\u56fe'}</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>{'\u70b9\u51fb\u6309\u94ae\u5207\u6362\u67e5\u770b\u4e0d\u540c\u65f6\u95f4\u6bb5\u7684\u8bbf\u95ee\u6570\u636e'}</p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <ChartToggle
            options={[{ label: '\u8fd16\u4e2a\u6708', value: '6m' }, { label: '\u5168\u5e74', value: '1y' }]}
            active={range}
            onChange={(v) => setRange(v as any)}
          />
        </div>
      </div>
      <div style={{ width: '100%', minHeight: '300px', minWidth: '300px', height: '350px' }}>
        <ChartContainer height={350}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
            <CartesianGrid key="bar-grid" strokeDasharray="3 3" vertical={false} stroke="var(--border-main)" />
            <XAxis
              key="bar-xaxis"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-family-base)' }}
              dy={10}
              interval={0}
            />
            <YAxis
              key="bar-yaxis"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-family-base)' }}
            />
            <Tooltip key="bar-tooltip" content={<CustomTooltip />} cursor={{ fill: 'var(--primary-7-bg)' }} isAnimationActive={false} />
            <Bar
              key="bar-data"
              dataKey="value"
              name="bar-value"
              fill={COLORS.primary}
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export const InteractiveLineChart = () => {
  const [metric, setMetric] = useState<'revenue' | 'profit'>('revenue');
  const data = metric === 'revenue' ? lineDataRevenue : lineDataProfit;
  const color = metric === 'revenue' ? COLORS.success : COLORS.warning;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ minWidth: '120px' }}>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 400, color: 'var(--text-main)' }}>{'\u591a\u7ef4\u6298\u7ebf\u56fe'}</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>{'\u5207\u6362\u5c55\u793a\u6536\u5165\u6216\u5229\u6da6\u8d8b\u52bf'}</p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <ChartToggle
            options={[{ label: '\u6536\u5165\u8d8b\u52bf', value: 'revenue' }, { label: '\u5229\u6da6\u8d8b\u52bf', value: 'profit' }]}
            active={metric}
            onChange={(v) => setMetric(v as any)}
          />
        </div>
      </div>
      <div style={{ width: '100%', minHeight: '300px', minWidth: '300px', height: '350px' }}>
        <ChartContainer height={350}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid key="line-grid" strokeDasharray="3 3" vertical={false} stroke="var(--border-main)" />
            <XAxis
              key="line-xaxis"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-family-base)' }}
              dy={10}
            />
            <YAxis
              key="line-yaxis"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-family-base)' }}
            />
            <Tooltip key="line-tooltip" content={<CustomTooltip />} isAnimationActive={false} />
            <Line
              key="line-data"
              type="monotone"
              dataKey="value"
              name="line-value"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1000}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export const InteractiveAreaChart = () => {
  const [showComparison, setShowComparison] = useState(true);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ minWidth: '120px' }}>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 400, color: 'var(--text-main)' }}>{'\u5bf9\u6bd4\u9762\u79ef\u56fe'}</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>{'\u70b9\u51fb\u6309\u94ae\u663e\u793a/\u9690\u85cf\u4e0a\u6708\u5bf9\u6bd4\u6570\u636e'}</p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <PimaButton
            onClick={() => setShowComparison(!showComparison)}
            size="sm"
            variant="outline"
          >
            {showComparison ? '\u9690\u85cf\u5bf9\u6bd4' : '\u663e\u793a\u5bf9\u6bd4'}
          </PimaButton>
        </div>
      </div>
      <div style={{ width: '100%', minHeight: '300px', minWidth: '300px', height: '350px' }}>
        <ChartContainer height={350}>
          <AreaChart data={areaDataSmooth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="pimaColorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.warning} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={COLORS.warning} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid key="area-grid" strokeDasharray="3 3" vertical={false} stroke="var(--border-main)" />
            <XAxis
              key="area-xaxis"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-family-base)' }}
              dy={10}
            />
            <YAxis
              key="area-yaxis"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-family-base)' }}
            />
            <Tooltip key="area-tooltip" content={<CustomTooltip />} isAnimationActive={false} />
            {showComparison && (
              <Area
                key="area-previous"
                type="monotone"
                dataKey="previous"
                stroke="var(--text-tertiary)"
                strokeDasharray="5 5"
                fill="transparent"
                strokeWidth={2}
                name={'\u4e0a\u6708'}
                animationDuration={500}
              />
            )}
            <Area
              key="area-current"
              type="monotone"
              dataKey="current"
              stroke={COLORS.warning}
              fillOpacity={1}
              fill="url(#pimaColorCurrent)"
              strokeWidth={2}
              name={'\u672c\u6708'}
              animationDuration={1000}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export const InteractivePieChart = () => {
  const [category, setCategory] = useState<'browser' | 'os'>('browser');
  const data = category === 'browser' ? pieDataBrowser : pieDataOS;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ minWidth: '120px' }}>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 400, color: 'var(--text-main)' }}>{'\u6570\u636e\u5207\u6362\u73af\u5f62\u56fe'}</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>{'\u5207\u6362\u67e5\u770b\u6d4f\u89c8\u5668\u6216\u64cd\u4f5c\u7cfb\u7edf\u5206\u5e03'}</p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <ChartToggle
            options={[{ label: '\u6d4f\u89c8\u5668', value: 'browser' }, { label: '\u64cd\u4f5c\u7cfb\u7edf', value: 'os' }]}
            active={category}
            onChange={(v) => setCategory(v as any)}
          />
        </div>
      </div>
      <div style={{ width: '100%', minHeight: '300px', minWidth: '300px', height: '350px', position: 'relative' }}>
        <ChartContainer height={350}>
          <PieChart>
            <Pie
              key="pie-data"
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${category}-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip key="pie-tooltip" content={<PieCustomTooltip />} isAnimationActive={false} />
            <Legend key="pie-legend" content={<CustomLegend />} verticalAlign="bottom" height={48} iconType="circle" />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
};