// import { useContext } from "preact/hooks";
import { Card } from "../../components/card/card";
import "./monitor.scss";
import {
  CanMessageTree,
  // StoreContext,
} from "../../store-provider/store-provider";
import { mapIdentifierToName } from "../../definitions";
import { Button } from "../../components/button/button";
import { saveAsJson } from "../../utils";

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
      <Button
        onClick={() => {
          const obj = Object.keys(canMessages).map((identifierKey) => {
            const message = canMessages[Number(identifierKey)];

            return {
              id: `0x${new Number(identifierKey).toString(16)}`,
              name: mapIdentifierToName(Number(identifierKey)),
              dlc: message[0].dataLengthCode,
              data: message.map((msg) => {
                return msg.data
                  .map((d) => `0x${d.toString(16).toUpperCase()}`)
                  .join(", ");
              }),
            };
          });

          saveAsJson(obj);
        }}
      >
        Save JSON
      </Button>
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
