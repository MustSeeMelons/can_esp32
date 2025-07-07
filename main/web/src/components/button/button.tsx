import { ComponentChildren } from "preact";
import "./button.scss";

export interface IButtonProps {
  children: ComponentChildren;
  onClick: () => void;
  class?: string;
}

export const Button = ({ children, onClick, class: cl }: IButtonProps) => {
  return (
    <button class={`button ${cl}`} onClick={onClick}>
      {children}
    </button>
  );
};
