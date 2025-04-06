// import { useContext } from "preact/hooks";
import { Card } from "../../components/card/card";
import "./monitor.scss";
import {
  CanMessageTree,
  // StoreContext,
} from "../../store-provider/store-provider";
import { mapIdentifierToName } from "../../definitions";

const canMessages: CanMessageTree = (() => {
  return new Array(15)
    .fill(0)
    .map((_, i) => i)
    .reduce<CanMessageTree>((acc, curr) => {
      const id = curr + 1 * 100;

      acc[id] = [
        {
          data: [255, 255, 255, 255, 255, 255, 255, 255],
          dataLengthCode: 8,
          identifier: id,
        },
        {
          data: [255, 255, 255, 255, 255, 255, 255, 255],
          dataLengthCode: 8,
          identifier: id,
        },
      ];

      return acc;
    }, {});
})();

export const MonitorPage = () => {
  // const { canMessages } = useContext(StoreContext);

  return (
    <div class="monitor-page">
      {Object.keys(canMessages).map((identifierKey) => {
        return (
          <Card>
            <h3>
              ID: 0x{new Number(identifierKey).toString(16)} [
              {mapIdentifierToName(Number(identifierKey))}]
            </h3>
            {canMessages[Number(identifierKey)].map((msg) => {
              return (
                <span>
                  {msg.data
                    .map((d) => `0x${d.toString(16).toUpperCase()}`)
                    .join(" ")}
                </span>
                // TODO add decoded message on we know what it is
              );
            })}
          </Card>
        );
      })}
    </div>
  );
};
