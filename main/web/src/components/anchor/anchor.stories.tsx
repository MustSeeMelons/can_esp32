import type { Meta, StoryObj } from "@storybook/preact";

import { Anchor, IAnchorProps } from "./anchor";
import { useRef } from "preact/hooks";

const meta: Meta<IAnchorProps> = {
  title: "Anchor",
  component: Anchor,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<IAnchorProps>;

export const Standard: Story = {
  render: (_args) => {
    const ref = useRef(null);

    return (
      <div ref={ref} style={{ backgroundColor: "grey" }}>
        <p>I'm but a paragraph</p>
        <Anchor anchorRef={ref}>I'm but an anchor!</Anchor>
      </div>
    );
  },
};
