import type { Meta, StoryObj } from "@storybook/preact";
import { ModalConsumer } from "./modal-consumer";
import {
  ModalContext,
  ModalProvider,
} from "../../modal-provider/modal-provider";
import { useContext } from "preact/hooks";
import { Button } from "../button/button";

const Wrapper = () => {
  return (
    <div>
      <ModalProvider>
        <ModalConsumer />
        <Content />
      </ModalProvider>
    </div>
  );
};

const Content = () => {
  const { pushModal, popModal } = useContext(ModalContext);

  return (
    <Button
      onClick={() => {
        pushModal(
          "test",
          <div style={{ padding: "20px", backgroundColor: "pink" }}>
            <Button
              onClick={() => {
                pushModal(
                  "test2",
                  <div style={{ padding: "20px", backgroundColor: "green" }}>
                    <Button
                      onClick={() => {
                        popModal();
                      }}
                    >
                      Click me too!
                    </Button>
                  </div>
                );
              }}
            >
              Click me!
            </Button>
          </div>
        );
      }}
    >
      Click me now!
    </Button>
  );
};

const meta: Meta = {
  title: "ModalConsumer",
  component: Wrapper,
  parameters: {},
};

export default meta;

type Story = StoryObj;

export const Standard: Story = {
  args: {},
  render: () => (
    <div style={{ width: "500px", height: "500px" }}>
      <Wrapper />
    </div>
  ),
};
