import type { Meta, StoryObj } from "@storybook/preact";

import { Button, IButtonProps } from "./button";

const meta: Meta<IButtonProps> = {
  title: "Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<IButtonProps>;

export const Standard: Story = {
  args: { children: "Regular button" },
};
