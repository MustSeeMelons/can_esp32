import type { Meta, StoryObj } from "@storybook/preact";

import { TransparentButton } from "./transparent-button";
import { IButtonProps } from "../button/button";
import { ListFilter } from "lucide-preact";

const meta: Meta<IButtonProps> = {
  title: "TransparentButton",
  component: TransparentButton,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<IButtonProps>;

export const Standard: Story = {
  args: { children: <ListFilter size="20px" /> },
};
