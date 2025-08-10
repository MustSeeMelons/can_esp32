import { useContext, useEffect, useState } from "preact/hooks";
import { CAN_ID, PCI, SID, WS_MESSAGE } from "../../../definitions";
import { SocketContext } from "../../../socket-provider/socket-provider";
import { StoreContext } from "../../../store-provider/store-provider";
import "../action-modal.scss";
import { Loader } from "../../loader/loader";
import { Button } from "../../button/button";

export const ClearDTC = () => {
  const { canMessageMap, setMessages } = useContext(StoreContext);
  const { getSocket } = useContext(SocketContext);

  const [isClearingDTC, setClearingDTC] = useState(false);
  const [isCleared, setCleared] = useState(false);

  useEffect(() => {
    if (!isClearingDTC) {
      return;
    }

    console.log("Looking for clear DTC response...");

    const engineMessages = canMessageMap[CAN_ID.Engine];
    const idx = engineMessages.findIndex((m) => {
      return (
        m.data[0] === PCI.SINGLE_FRAME_2_BYTE &&
        m.data[1] === SID.CLEAR_DTC + 0x40
      );
    });

    // If a message will have multiple interested parties - create a hook for retrieving it, with a timeout delete
    if (idx !== -1) {
      console.log("Response found!");
      const updated = [...canMessageMap[CAN_ID.Engine]];
      updated.splice(idx, 1);
      setMessages({
        ...canMessageMap,
        [CAN_ID.Engine]: [...updated],
      });
      setClearingDTC(false);
      setCleared(true);
    } else {
      console.log("Response not found!");
    }
  }, [canMessageMap]);

  return (
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
        <div style={{ display: "inline-block", paddingLeft: "10px" }}>OK</div>
      )}
      {canMessageMap[0]}
    </div>
  );
};
