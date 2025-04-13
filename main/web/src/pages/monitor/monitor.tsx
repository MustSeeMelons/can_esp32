// import { useContext } from "preact/hooks";
import "./monitor.scss";
import {
  CanMessageTree,
  // StoreContext,
} from "../../store-provider/store-provider";
import { mapIdentifierToName } from "../../definitions";
import { Button } from "../../components/button/button";
import { saveAsJson } from "../../utils";
import { formatTime } from "../../utils/date-utils";
import { useEffect, useState } from "preact/hooks";
import { ExpandableCard } from "../../components/expandable-card/expandable-card";

const canMessages: CanMessageTree = (() => {
  return new Array(15)
    .fill(0)
    .map((_, i) => i)
    .reduce<CanMessageTree>((acc, curr) => {
      const id = curr + 1 * 100;

      acc[id] = [
        {
          timestamp: new Date(),
          data: [255, 255, 255, 255, 255, 255, 255, 255],
          dataLengthCode: 8,
          identifier: id,
        },
        {
          timestamp: new Date(),
          data: [255, 255, 255, 255, 255, 255, 255, 255],
          dataLengthCode: 8,
          identifier: id,
        },
        {
          timestamp: new Date(),
          data: [255, 255, 255, 255, 255, 255, 255, 255],
          dataLengthCode: 8,
          identifier: id,
        },
      ];

      return acc;
    }, {});
})();

export const MonitorPage = () => {
  const [isExpanded, setExpanded] = useState<boolean[]>([]);
  // const { canMessages } = useContext(StoreContext);

  useEffect(() => {
    const currCount = Object.keys(canMessages).length;

    if (isExpanded.length === 0) {
      setExpanded(new Array(currCount).fill(false));
    } else {
      const diff = currCount - isExpanded.length;

      setExpanded([...isExpanded, ...new Array(diff).fill(false)]);
    }
  }, [canMessages]);

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
                return {
                  data: msg.data
                    .map((d) => `0x${d.toString(16).toUpperCase()}`)
                    .join(", "),
                  timestamp: formatTime(msg.timestamp),
                };
              }),
            };
          });

          saveAsJson(obj);
        }}
      >
        Save JSON
      </Button>
      {Object.keys(canMessages).map((identifierKey, index) => {
        return (
          <ExpandableCard isExpanded={isExpanded[index]}>
            <h3
              onClick={() => {
                setExpanded(
                  isExpanded.map((exp, idx) => (idx === index ? !exp : exp))
                );
              }}
            >
              ID: 0x{new Number(identifierKey).toString(16)} [
              {mapIdentifierToName(Number(identifierKey))}]
            </h3>
            {isExpanded[index] &&
              canMessages[Number(identifierKey)].map((msg) => {
                return (
                  <div>
                    <span>[{formatTime(msg.timestamp)}]</span>
                    <span>
                      {msg.data
                        .map((d) => `0x${d.toString(16).toUpperCase()}`)
                        .join(" ")}
                    </span>
                    {/* TODO add decoded message on we know what it is */}
                    {/* <div>99mph</div> */}
                  </div>
                );
              })}
          </ExpandableCard>
        );
      })}
    </div>
  );
};
