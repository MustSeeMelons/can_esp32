import "./monitor.scss";
import {
  CanMessageMap,
  StoreContext,
} from "../../store-provider/store-provider";
import { mapIdentifierToName } from "../../definitions";
import { Button } from "../../components/button/button";
import { saveAsJson } from "../../utils";
import { formatTime } from "../../utils/date-utils";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { ExpandableCard } from "../../components/expandable-card/expandable-card";
import { ListFilter, SquareActivity } from "lucide-preact";
import { ActionMenu } from "../../components/action-menu/action-menu";
import { TransparentButton } from "../../components/transparent-button/transparent-button";
import { ModalContext } from "../../modal-provider/modal-provider";
import { ActionModal } from "../../components/action-modal/action-modal";
import { Checkbox } from "../../components/checkbox/checkbox";
import { toHex } from "../../utils/number-utils";

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
  const [isExpanded, setExpanded] = useState<{ [key: string]: boolean }>({}); // Identifier children open
  const [isSelected, setSelected] = useState<{ [key: string]: boolean }>({}); // Identifier rendered
  let { canMessageMap, setMessages } = useContext(StoreContext);
  const { pushModal } = useContext(ModalContext);

  // Add fake messages if configured
  useEffect(() => {
    if (import.meta.env.VITE_FAKE_MESSAGES === "true") {
      setMessages(canMessagesStub);
    }
  }, []);

  // React to new messages arriving
  useEffect(() => {
    if (Object.keys(isExpanded).length === 0) {
      const initial = Object.keys(canMessageMap).reduce<{
        [key: string]: boolean;
      }>((acc, curr) => {
        acc[curr] = false;

        return acc;
      }, {});

      setSelected(initial);
      setExpanded(initial);
    } else {
      const newArrivals = Object.keys(canMessageMap)
        .filter((k) => isExpanded[k] === undefined)
        .reduce<{
          [key: string]: boolean;
        }>((acc, curr) => {
          acc[curr] = false;

          return acc;
        }, {});

      // Set expanded to false to new arrivals
      setExpanded({ ...isExpanded, ...newArrivals });
      setSelected({ ...isExpanded, ...newArrivals });
    }
  }, [canMessageMap]);

  const filters = useMemo(() => {
    return Object.keys(canMessageMap).map((k) => {
      return {
        label: (
          <Checkbox
            label={`${toHex(k)} [${mapIdentifierToName(Number(k))}]`}
            checked={isSelected[k]}
            onChange={(v) => {
              setSelected((prev) => {
                return {
                  ...prev,
                  [k]: v,
                };
              });
            }}
          />
        ),
        onClick: () => {},
      };
    });
  }, [canMessageMap, isSelected]);

  const canMessageToRender = useMemo(() => {
    const selected = Object.keys(isSelected).filter((k) => {
      return isSelected[k];
    });

    if (selected.length > 0) {
      return selected.reduce<CanMessageMap>((acc, curr) => {
        acc[curr] = canMessageMap[curr];

        return acc;
      }, {});
    }

    return canMessageMap;
  }, [canMessageMap, isSelected]);

  return (
    <div class="monitor-page">
      <div class="actions">
        <Button
          onClick={() => {
            setMessages({});
            setExpanded({});
            setSelected({});
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
          items={filters}
          variant="transparent"
          isCloseOnClick={false}
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
      {Object.keys(canMessageToRender).map((identifierKey) => {
        return (
          <ExpandableCard isExpanded={isExpanded[identifierKey]}>
            <h3
              onClick={() => {
                setExpanded((prev) => {
                  return {
                    ...prev,
                    [identifierKey]: !prev[identifierKey],
                  };
                });
              }}
            >
              {`${toHex(identifierKey)} [${mapIdentifierToName(
                Number(identifierKey)
              )}]`}
            </h3>
            {isExpanded[identifierKey] &&
              canMessageToRender[Number(identifierKey)].map((msg) => {
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
