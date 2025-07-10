import { ComponentChildren } from "preact";
import "./card.scss";

export interface ICardProps {
  children: ComponentChildren;
}

export const Card = ({ children }: ICardProps) => {
  return <div class="card">{children}</div>;
};
