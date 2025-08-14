import { ComponentChildren } from "preact";
import "./button.scss";
import { forwardRef } from "preact/compat";
import { CSSProperties } from "preact/compat";

export interface IButtonProps {
  children: ComponentChildren;
  onClick: () => void;
  class?: string;
  title?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ children, onClick, class: cl, title, disabled, style }, ref) => {
    return (
      <button
        style={style}
        disabled={disabled}
        ref={ref}
        class={`button${cl ? ` ${cl}` : ""}`}
        title={title}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
);
