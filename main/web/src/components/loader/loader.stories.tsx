import type { Meta, StoryObj } from "@storybook/preact";

import { Loader } from "./loader";

const meta: Meta = {
  title: "Loader",
  component: Loader,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

export const Standard: Story = {};
