import { ComponentChildren } from "preact";
import "./button.scss";

interface IButtonProps {
  children: ComponentChildren;
  onClick: () => void;
}

export const Button = ({ children, onClick }: IButtonProps) => {
  return (
    <button class="button" onClick={onClick}>
      {children}
    </button>
  );
};
