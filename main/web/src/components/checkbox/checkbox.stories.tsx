import type { Meta, StoryObj } from "@storybook/preact";

import { Checkbox, ICheckboxProps } from "./checkbox";

const meta: Meta<ICheckboxProps> = {
  title: "Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<ICheckboxProps>;

export const Naked: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: "Do you agree?",
    onChange: (v) => {
      console.log(v);
    },
  },
};

export const Disabled: Story = {
  args: { label: "Cant change me!", disabled: true },
};
