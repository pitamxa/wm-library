import { useState, useEffect, useCallback } from "react";
import type { ThemeMode, ThemeConfig } from "../types/pima-components";

/**
 * 主题配置常量（v1.0.8）
 * teacher = WM-T（蓝色品牌）  student = WM-S（绿色品牌）
 */
const THEME_CONFIGS: Record<ThemeMode, ThemeConfig> = {
  teacher: {
    mode: "teacher",
    primaryColor: "#365AA4", /* Brand/200 WM-T */
    borderRadius: 0,
  },
  student: {
    mode: "student",
    primaryColor: "#4FAD4E", /* Brand/200 WM-S */
    borderRadius: 0,
  },
};

/**
 * 主题 Hook 的返回类型
 */
interface UseThemeReturn {
  /** 当前主题模式 */
  theme: ThemeMode;
  /** 主题配置 */
  config: ThemeConfig;
  /** 设置主题模式 */
  setTheme: (mode: ThemeMode) => void;
  /** 切换主题 */
  toggleTheme: () => void;
}

/**
 * 主题管理 Hook
 * 
 * 通过在 <html> 上切换 CSS 类来激活不同的 Brand 色板：
 *   - teacher (WM-T)：默认，不添加类名
 *   - student (WM-S)：添加 class="theme-wm-s"
 * 
 * @param defaultTheme - 默认主题模式
 * 
 * @example
 * ```tsx
 * const { theme, setTheme, toggleTheme } = useTheme("teacher");
 * 
 * return (
 *   <div>
 *     <button onClick={toggleTheme}>切换主题</button>
 *   </div>
 * );
 * ```
 */
export function useTheme(defaultTheme: ThemeMode = "teacher"): UseThemeReturn {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // 尝试从 localStorage 读取主题
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pima-theme");
      if (saved === "teacher" || saved === "student") {
        return saved;
      }
    }
    return defaultTheme;
  });

  // 应用主题到 DOM
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      
      // 移除所有主题类
      root.classList.remove("theme-wm-s");
      
      // WM-S (student) 模式添加 theme-wm-s 类，WM-T (teacher) 为默认无需类名
      if (theme === "student") {
        root.classList.add("theme-wm-s");
      }
      
      // 保存到 localStorage
      localStorage.setItem("pima-theme", theme);
    }
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "teacher" ? "student" : "teacher"));
  }, []);

  return {
    theme,
    config: THEME_CONFIGS[theme],
    setTheme,
    toggleTheme,
  };
}
