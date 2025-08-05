import { ComponentChildren, createContext } from "preact";
import { useState } from "preact/hooks";

export interface ISocketContext {
  setSocket: (socket: WebSocket) => void;
  getSocket: () => WebSocket | undefined;
}

export const SocketContext = createContext<ISocketContext>({
  setSocket: (_socket: WebSocket) => {},
  getSocket: () => undefined,
});

type ISocketProviderProps = {
  children: ComponentChildren;
};

export const SocketProvider = ({ children }: ISocketProviderProps) => {
  const [socket, setSocket] = useState<WebSocket | undefined>();

  const socketContextData: ISocketContext = {
    setSocket: (socket: WebSocket) => setSocket(socket),
    getSocket: () => socket,
  };

  return (
    <SocketContext.Provider value={socketContextData}>
      {children}
    </SocketContext.Provider>
  );
};
