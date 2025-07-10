import type { Meta, StoryObj } from "@storybook/preact";

import { NotFound } from "./not-found";
import { Content } from "../content/content";
import { ThemeProvider } from "../../theme-provider/theme.provider";

const meta: Meta = {
  title: "NotFound",
  component: NotFound,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

export const Standard: Story = {
  render: () => {
    return (
      <ThemeProvider>
        <Content>
          <NotFound />
        </Content>
      </ThemeProvider>
    );
  },
};
