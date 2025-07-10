import type { Meta, StoryObj } from "@storybook/preact";

import { Card, ICardProps } from "./card";

const meta: Meta<ICardProps> = {
  title: "Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<ICardProps>;

export const Standard: Story = {
  args: { children: <p>some paragraph content</p> },
};
