import { ComponentChildren } from "preact";
import { Card } from "../card/card";
import { ArrowDown } from "lucide-preact";
import "./expandable-card.scss";
import "../../utils/utils.scss";

export interface IExpandableCardProps {
  children: ComponentChildren;
  isExpanded: boolean;
}

export const ExpandableCard = ({
  children,
  isExpanded,
}: IExpandableCardProps) => {
  return (
    <div class="expandable-card">
      <Card>
        {children}
        <div id="exp-arrow" class={isExpanded ? "rotate-180" : ""}>
          {<ArrowDown />}
        </div>
      </Card>
    </div>
  );
};
