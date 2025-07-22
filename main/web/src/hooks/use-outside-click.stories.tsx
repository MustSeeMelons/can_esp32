import type { Meta, StoryObj } from "@storybook/preact";
import { useOutsideClick } from "./use-outside-click";
import { useRef, useState } from "preact/hooks";

const Wrapper = () => {
  const [show, setShow] = useState(true);
  const ref = useRef(null);
  useOutsideClick(() => {
    setShow(false);
  }, [ref]);

  return (
    <div style={{ backgroundColor: "green", width: "200px", height: "200px" }}>
      <div
        style={{
          backgroundColor: "red",
          width: "100px",
          height: "100px",
          display: show ? "block" : "none",
        }}
        ref={ref}
      >
        Click outside of me an I will disappear
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "hooks/useOutsideClick",
  component: Wrapper,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

export const Standard: Story = {};
