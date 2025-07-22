import { useContext } from "preact/hooks";
import { ModalContext } from "../../modal-provider/modal-provider";
import "./modal-consumer.scss";

export const ModalConsumer = () => {
  const { modals } = useContext(ModalContext);

  return (
    <div
      style={{ opacity: modals.length === 0 ? 0 : 1 }}
      id="modal-consumer-backdrop"
      class="modal-consumer-backdrop"
    >
      {modals.map((m, i) => (
        <div class="modal-child" style={{ zIndex: (i + 1) * 10 }}>
          {m.node}
        </div>
      ))}
    </div>
  );
};
