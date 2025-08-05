import { useContext, useState } from "preact/hooks";
import { ExpandableCard } from "../expandable-card/expandable-card";
import "./action-modal.scss";
import { Button } from "../button/button";
import { X } from "lucide-preact";
import { ModalContext } from "../../modal-provider/modal-provider";
import { TransparentButton } from "../transparent-button/transparent-button";
import { StoreContext } from "../../store-provider/store-provider";
import { SocketContext } from "../../socket-provider/socket-provider";

export const ActionModal = () => {
  const [isExpanded, setExpanded] = useState<boolean[]>([false]);
  const { popModal } = useContext(ModalContext);
  const { canMessageMap } = useContext(StoreContext);
  const { getSocket } = useContext(SocketContext);

  // TODO split each card into component
  return (
    <div class="action-modal">
      <div class="action-row">
        <h2>Actions</h2>
        <TransparentButton onClick={() => popModal()}>
          <X />
        </TransparentButton>
      </div>

      <ExpandableCard isExpanded={isExpanded[0]}>
        <h3
          onClick={() => {
            setExpanded(isExpanded.map((exp, idx) => (idx === 0 ? !exp : exp)));
          }}
        >
          Clear DTC's
        </h3>
        {isExpanded[0] && (
          <div class="expandable-content">
            <Button
              onClick={() => {
                // TODO send to FW - figure out format
                getSocket()?.send(new Uint8Array([]));
              }}
            >
              Clear error codes
            </Button>
            {/* TODO show OK if we get response */}
            {canMessageMap[0]}
          </div>
        )}
      </ExpandableCard>
      <ExpandableCard isExpanded={isExpanded[1]}>
        <h3
          onClick={() => {
            setExpanded(isExpanded.map((exp, idx) => (idx === 1 ? !exp : exp)));
          }}
        >
          Rev View (TBD)
        </h3>
      </ExpandableCard>
    </div>
  );
};
