import { ComponentChildren, createContext } from "preact";
import { useState } from "preact/hooks";
import { ICanMessage } from "../services/can-message-service";

export type CanMessageMap = { [key: number]: ICanMessage[] };

export interface IStoreContext {
  canMessageMap: CanMessageMap;
  addMessage: (msg: ICanMessage) => void;
  setMessages: (messages: CanMessageMap) => void;
}

export const StoreContext = createContext<IStoreContext>({
  addMessage: () => {},
  canMessageMap: {},
  setMessages: () => {},
});

type IStoreProviderProps = {
  children: ComponentChildren;
};

export const StoreProvider = ({ children }: IStoreProviderProps) => {
  const [canMessageMap, setCanMessageMap] = useState<CanMessageMap>({});

  const addMessage = (msg: ICanMessage) => {
    // Must use set so we can access prev in ws setup handler
    setCanMessageMap((prev) => {
      if (prev[msg.identifier]) {
        const curr = prev[msg.identifier];

        if (
          curr.some((m) => {
            if (msg.dataLengthCode === m.dataLengthCode) {
              for (let i = 0; i < m.dataLengthCode; i++) {
                // Data not equal
                if (msg.data[i] !== m.data[i]) {
                  return true;
                }
              }
            }

            // DLC mismatch, not equal
            return false;
          })
        ) {
          return {
            ...prev,
            [msg.identifier]: [...(prev[msg.identifier] || []), msg],
          };
        } else {
          return prev;
        }
      } else {
        // New message, add it in
        return { ...prev, [msg.identifier]: [msg] };
      }
    });
  };

  const storeContextData: IStoreContext = {
    canMessageMap,
    addMessage,
    setMessages: (messages: CanMessageMap) => {
      setCanMessageMap(messages);
    },
  };

  return (
    <StoreContext.Provider value={storeContextData}>
      {children}
    </StoreContext.Provider>
  );
};
