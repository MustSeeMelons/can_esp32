import type { Meta, StoryObj } from "@storybook/preact";

import { Footer } from "./footer";

const meta: Meta = {
  title: "Footer",
  component: Footer,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

export const Standard: Story = {};
