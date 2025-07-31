import type { Meta, StoryObj } from "@storybook/preact";
import { ActionMenu, IActionMenuProps } from "./action-menu";
import { ListFilter } from "lucide-preact";

const meta: Meta<IActionMenuProps> = {
  title: "Action Menu",
  component: ActionMenu,
  parameters: {},
};

export default meta;

type Story = StoryObj<IActionMenuProps>;

const items = [
  { label: "Save", onClick: () => {} },
  { label: "Delete", onClick: () => {} },
  { label: "Publish", onClick: () => {} },
];

export const Standard: Story = {
  args: {
    btnLabel: "Actions",
    items,
  },
};

export const Transparent: Story = {
  args: {
    btnLabel: <ListFilter size="20px" />,
    variant: "transparent",
    items,
  },
};
