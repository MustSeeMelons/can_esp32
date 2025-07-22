import { ComponentChildren, createContext } from "preact";
import { useMemo, useState } from "preact/hooks";

export interface IModal {
  id: string;
  node: ComponentChildren;
}

interface IModalContext {
  modals: IModal[];
  pushModal: (id: string, node: ComponentChildren) => void;
  popModal: () => void;
}

type ModalContextProps = {
  children: ComponentChildren;
};

export const ModalContext = createContext<IModalContext>({
  modals: [],
  popModal: () => {},
  pushModal: () => {},
});

export const ModalProvider = ({ children }: ModalContextProps) => {
  const [modals, setModals] = useState<IModal[]>([]);

  const modalContextData: IModalContext = useMemo(() => {
    return {
      modals,
      pushModal: (id, node) => {
        if (!modals.some((m) => m.id === id)) {
          setModals((modals) => [...modals, { id, node }]);
        }
      },
      popModal: () => {
        setModals((modals) => modals.slice(0, modals.length - 1));
      },
    };
  }, [modals, setModals]);

  return (
    <ModalContext.Provider value={modalContextData}>
      {children}
    </ModalContext.Provider>
  );
};
