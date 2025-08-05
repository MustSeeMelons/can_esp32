import { ComponentChildren } from "preact";
import { useContext, useEffect } from "preact/hooks";
import { canMessageService } from "../../services/can-message-service";
import { StoreContext } from "../../store-provider/store-provider";
import { SocketContext } from "../../socket-provider/socket-provider";

type IContentProps = {
  children: ComponentChildren;
};

export const Content = ({ children }: IContentProps) => {
  const { addMessage } = useContext(StoreContext);
  const { setSocket } = useContext(SocketContext);

  useEffect(() => {
    const url = `ws://${window.location.host}/ws`;
    const socket = new WebSocket(url);
    socket.binaryType = "arraybuffer";

    socket.onmessage = (event) => {
      const msg = canMessageService.transformMessage(event.data);
      addMessage(msg);
    };

    socket.onerror = (error) => {
      // TODO add to state?
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      // TODO add to state?
      console.log("WebSocket connection closed.");
    };

    setSocket(socket);
  }, []);

  return <div class="content">{children}</div>;
};
