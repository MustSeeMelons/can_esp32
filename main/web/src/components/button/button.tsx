import { ComponentChildren } from "preact";
import "./button.scss";
import { forwardRef } from "preact/compat";

export interface IButtonProps {
  children: ComponentChildren;
  onClick: () => void;
  class?: string;
  title?: string;
}

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ children, onClick, class: cl, title }, ref) => {
    return (
      <button
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
