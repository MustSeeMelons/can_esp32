import "./monitor.scss";
import {
  CanMessageMap,
  StoreContext,
} from "../../store-provider/store-provider";
import { mapIdentifierToName } from "../../definitions";
import { Button } from "../../components/button/button";
import { saveAsJson } from "../../utils";
import { formatTime } from "../../utils/date-utils";
import { useContext, useEffect, useState } from "preact/hooks";
import { ExpandableCard } from "../../components/expandable-card/expandable-card";
import { ListFilter, SquareActivity } from "lucide-preact";
import { ActionMenu } from "../../components/action-menu/action-menu";
import { TransparentButton } from "../../components/transparent-button/transparent-button";
import { ModalContext } from "../../modal-provider/modal-provider";
import { ActionModal } from "../../components/action-modal/action-modal";

const canMessagesStub: CanMessageMap = (() => {
  return new Array(15)
    .fill(0)
    .map((_, i) => i)
    .reduce<CanMessageMap>((acc, curr) => {
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
  let { canMessageMap, setMessages } = useContext(StoreContext);
  const { pushModal } = useContext(ModalContext);

  useEffect(() => {
    if (import.meta.env.VITE_FAKE_MESSAGES === "true") {
      setMessages(canMessagesStub);
    }
  }, []);

  useEffect(() => {
    const currCount = Object.keys(canMessageMap).length;

    if (isExpanded.length === 0) {
      setExpanded(new Array(currCount).fill(false));
    } else {
      const diff = currCount - isExpanded.length;

      setExpanded([...isExpanded, ...new Array(diff).fill(false)]);
    }
  }, [canMessageMap]);

  return (
    <div class="monitor-page">
      <div class="actions">
        <Button
          onClick={() => {
            setMessages({});
            setExpanded([]);
          }}
        >
          Clear
        </Button>
        <Button
          onClick={() => {
            const obj = Object.keys(canMessageMap).map((identifierKey) => {
              const message = canMessageMap[Number(identifierKey)];

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
        <ActionMenu
          btnLabel={<ListFilter size="25px" />}
          // TODO show all messages for selection
          items={[
            { label: "Action 1", onClick: () => {} },
            { label: "Action 2", onClick: () => {} },
          ]}
          variant="transparent"
        />
        <TransparentButton
          title="Actions"
          onClick={() => {
            pushModal("action-modal", <ActionModal />);
          }}
        >
          <SquareActivity size={"25px"} />
        </TransparentButton>
      </div>
      {Object.keys(canMessageMap).map((identifierKey, index) => {
        return (
          <ExpandableCard isExpanded={isExpanded[index]}>
            <h3
              onClick={() => {
                setExpanded(
                  isExpanded.map((exp, idx) => (idx === index ? !exp : exp))
                );
              }}
            >
              ID: 0x
              {new Number(identifierKey)
                .toString(16)
                .toUpperCase()
                .padStart(3, "0")}
              [{mapIdentifierToName(Number(identifierKey))}]
            </h3>
            {isExpanded[index] &&
              canMessageMap[Number(identifierKey)].map((msg) => {
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
