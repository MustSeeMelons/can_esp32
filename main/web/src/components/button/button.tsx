import { ComponentChildren } from "preact";
import "./button.scss";
import { forwardRef } from "preact/compat";

export interface IButtonProps {
  children: ComponentChildren;
  onClick: () => void;
  class?: string;
}

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ children, onClick, class: cl }, ref) => {
    return (
      <button ref={ref} class={`button${cl ? ` ${cl}` : ""}`} onClick={onClick}>
        {children}
      </button>
    );
  }
);
