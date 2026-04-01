/**
 * @deprecated 请使用 <PimaSelector mode="multiple" /> 代替
 * 此文件保留仅为向后兼容，内部直接委托给 PimaSelector
 */
import { PimaSelector } from "./PimaSelector";
import type { PimaMultiSelectorProps } from "../types/pima-components";

export type { PimaMultiSelectorProps };

export function PimaMultiSelector(props: PimaMultiSelectorProps) {
  return <PimaSelector {...props} mode="multiple" />;
}
