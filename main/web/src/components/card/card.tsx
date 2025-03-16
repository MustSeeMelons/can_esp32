import { ComponentChildren } from "preact";
import "./card.scss";

interface ICardProps {
  children: ComponentChildren;
}

export const Card = ({ children }: ICardProps) => {
  return <div class="card">{children}</div>;
};
