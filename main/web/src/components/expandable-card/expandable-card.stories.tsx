import type { Meta, StoryObj } from "@storybook/preact";

import { ExpandableCard, IExpandableCardProps } from "./expandable-card";

const meta: Meta<IExpandableCardProps> = {
  title: "ExpandableCard",
  component: ExpandableCard,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<IExpandableCardProps>;

export const Standard: Story = {
  args: { children: <h3>Card title text</h3>, isExpanded: false },
  render: (args) => {
    return (
      <div style={{ width: "400px" }}>
        <ExpandableCard {...args} />
      </div>
    );
  },
};
