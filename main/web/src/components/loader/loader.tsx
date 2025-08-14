import { CSSProperties } from "preact/compat";
import "./loader.scss";

export interface ILoaderProps {
  size: "small" | "medium";
  style?: CSSProperties;
}

export const Loader = ({ size, style }: ILoaderProps) => {
  const getStyle = (): CSSProperties => {
    const result: CSSProperties = { ...style };

    if (size === "small") {
      result.width = "16px";
      result.height = "16px";
    }

    return result;
  };

  return (
    <div class="loader">
      <div style={{ ...getStyle() }} />
    </div>
  );
};
