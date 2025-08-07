import { useContext, useEffect, useState } from "preact/hooks";
import { ExpandableCard } from "../expandable-card/expandable-card";
import "./action-modal.scss";
import { Button } from "../button/button";
import { X } from "lucide-preact";
import { ModalContext } from "../../modal-provider/modal-provider";
import { TransparentButton } from "../transparent-button/transparent-button";
import { StoreContext } from "../../store-provider/store-provider";
import { SocketContext } from "../../socket-provider/socket-provider";
import { WS_MESSAGE } from "../../definitions";
import { Loader } from "../loader/loader";

export const ActionModal = () => {
  const [isExpanded, setExpanded] = useState<boolean[]>([false]);
  const { popModal } = useContext(ModalContext);
  const { canMessageMap } = useContext(StoreContext);
  const { getSocket } = useContext(SocketContext);

  const [isClearingDTC, setClearingDTC] = useState(false);
  const [isCleared, setCleared] = useState(false);

  useEffect(() => {
    const possibleKeys = Object.keys(canMessageMap).filter((idKey) => {
      if (+idKey >= 0x7e8 && +idKey <= 0x7ef) {
        return true;
      }

      return false;
    });

    if (
      possibleKeys.some((k) => {
        const message = canMessageMap[k];

        console.log("Posible ECU response:", message);

        // We are hoarding messages at the momment - delete the one we were waiting for?
        return message.some((can) => {
          return can.data[0] == 0x02 && can.data[1] == 0x44;
        });
      })
    ) {
      setClearingDTC(false);
      setCleared(true);
    }
  }, [canMessageMap]);

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
              disabled={isClearingDTC}
              onClick={() => {
                setClearingDTC(true);
                getSocket()?.send(new Uint8Array(WS_MESSAGE.CLEAR_DTC));
              }}
            >
              {isClearingDTC ? (
                <Loader size="small" style={{ padding: "0 65px" }} />
              ) : (
                "Clear error codes"
              )}
            </Button>
            {isCleared && (
              <div style={{ display: "inline-block", paddingLeft: "10px" }}>
                OK
              </div>
            )}
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
