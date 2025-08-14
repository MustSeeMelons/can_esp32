import { useCallback, useContext, useState } from "preact/hooks";
import { ExpandableCard } from "../expandable-card/expandable-card";
import "./action-modal.scss";
import { X } from "lucide-preact";
import { ModalContext } from "../../modal-provider/modal-provider";
import { TransparentButton } from "../transparent-button/transparent-button";
import { ClearDTC } from "./actions/clear-dtc";
import { RpmSniffer } from "./actions/rpm-sniffer/rpm-sniffer";

export const ActionModal = () => {
  const [isExpanded, setExpanded] = useState<boolean[]>([false, false]);
  const { popModal } = useContext(ModalContext);

  const toggleExpand = useCallback(
    (idx: number) => {
      setExpanded((isExpanded) =>
        isExpanded.map((exp, i) => (i === idx ? !exp : exp))
      );
    },
    [setExpanded]
  );

  return (
    <div class="action-modal">
      <div class="action-row">
        <h2>Actions</h2>
        <TransparentButton onClick={() => popModal()}>
          <X />
        </TransparentButton>
      </div>

      <ExpandableCard isExpanded={isExpanded[0]}>
        <h3 onClick={() => toggleExpand(0)}>Clear DTC's</h3>
        {isExpanded[0] && <ClearDTC />}
      </ExpandableCard>
      <ExpandableCard isExpanded={isExpanded[1]}>
        <h3 onClick={() => toggleExpand(1)}>RPM Sniffer</h3>
        {isExpanded[1] && <RpmSniffer />}
      </ExpandableCard>
    </div>
  );
};
