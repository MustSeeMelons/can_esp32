import type { Meta, StoryObj } from "@storybook/preact";

import { Header } from "./header";
import { ThemeProvider } from "../../theme-provider/theme.provider";

const meta: Meta = {
  title: "Header",
  component: Header,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

export const Standard: Story = {
  render: (args) => {
    return (
      <div style={{ width: "600px" }}>
        <ThemeProvider>
          <Header {...args} />
        </ThemeProvider>
      </div>
    );
  },
};
