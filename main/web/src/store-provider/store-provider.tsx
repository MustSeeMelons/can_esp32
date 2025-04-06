import { ComponentChildren, createContext } from "preact";
import { useState } from "preact/hooks";
import { ICanMessage } from "../services/can-message-service";

export type CanMessageTree = { [key: number]: ICanMessage[] };

export interface IStoreContext {
  canMessages: CanMessageTree;
  addMessage: (msg: ICanMessage) => void;
}

export const StoreContext = createContext<IStoreContext>({
  addMessage: () => {},
  canMessages: {},
});

type IStoreProviderProps = {
  children: ComponentChildren;
};

export const StoreProvider = ({ children }: IStoreProviderProps) => {
  const [canMessages, setCanMessages] = useState<CanMessageTree>({});

  const addMessage = (msg: ICanMessage) => {
    // Must use set so we can access prev in ws setup handler
    setCanMessages((prev) => {
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
    canMessages,
    addMessage,
  };

  return (
    <StoreContext.Provider value={storeContextData}>
      {children}
    </StoreContext.Provider>
  );
};
