import type { Meta, StoryObj } from "@storybook/preact";

import { Portal, IPortalProps } from "./portal";

const meta: Meta<IPortalProps> = {
  title: "Portal",
  component: Portal,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<IPortalProps>;

export const Standard: Story = {
  args: { children: <p>I'm detached</p> },
  render: (args) => {
    return (
      <div style={{ width: "200px", height: "50px", backgroundColor: "red" }}>
        <Portal {...args} />
      </div>
    );
  },
};
