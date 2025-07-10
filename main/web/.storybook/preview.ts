import type { Preview } from "@storybook/preact-vite";

import "../src/app.scss";
import "../src/variables.scss";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
