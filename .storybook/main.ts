//main.ts
import type { StorybookConfig } from "@storybook/nextjs-vite";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { mergeConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ALIAS_PATH = path.resolve(__dirname, "../src");

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal: async (baseConfig) => {
    return mergeConfig(baseConfig, {
      resolve: {
        alias: {
          "@": ALIAS_PATH,
        },
      },
    });
  },
};
export default config;
