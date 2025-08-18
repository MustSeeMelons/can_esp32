import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { FORD_ID, WS_MESSAGE } from "../../../../definitions";
import { SocketContext } from "../../../../socket-provider/socket-provider";
import "../../action-modal.scss";
import "./rpm-sniffer.scss";
import { Button } from "../../../button/button";
import { Loader } from "../../../loader/loader";
import { StoreContext } from "../../../../store-provider/store-provider";
import { mapRange } from "../../../../utils/number-utils";

const minDegrees = 0;
const maxDegress = 90;
const maxRpm = 7000;

const sniffIntervalMs = 1000;

export const RpmSniffer = () => {
  const { canMessageMap } = useContext(StoreContext);
  const { getSocket } = useContext(SocketContext);
  const [isMonitoring, setMonitoring] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const rpmRef = useRef(0);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [intervalRef]);

  useEffect(() => {
    const engineMessages = canMessageMap[FORD_ID.RPM];

    const rpmMessage = engineMessages?.find((m) => {
      return m.consumed === false;
    });

    if (rpmMessage) {
      rpmMessage.consumed = true;

      const rpm = rpmMessage.data[2] * 16;
      rpm && (rpmRef.current = rpm);
    }
  }, [canMessageMap[FORD_ID.RPM]]);

  return (
    <div class="expandable-content rpm-sniffer">
      <div style={{ display: "flex", alignItems: "center", columnGap: "10px" }}>
        <Button
          style={{ width: "100px" }}
          onClick={() => {
            setMonitoring((m) => !m);

            if (!isMonitoring) {
              intervalRef.current = setInterval(() => {
                getSocket()?.send(new Uint8Array(WS_MESSAGE.REQUEST_RPM));
              }, sniffIntervalMs);
            }
          }}
        >
          {isMonitoring ? "Stop" : "Monitor"}
        </Button>
        {isMonitoring && <Loader size="small" />}
      </div>
      <div class="dash">
        <div
          class="needle"
          style={{
            transform: `rotate(${mapRange(
              rpmRef.current,
              0,
              maxRpm,
              minDegrees,
              maxDegress
            )}deg)`,
          }}
        />
        <div class="rpm">{rpmRef.current}</div>
      </div>
    </div>
  );
};
