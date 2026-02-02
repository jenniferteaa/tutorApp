import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "tutor",
    description: "This tool can be used to set study with ai interaction",
    version: "1.0.0",
    permissions: ["storage", "tabs", "activeTab", "scripting"],
    host_permissions: ["<all_urls>"],
    action: {
      default_title: "vibetutor",
      default_popup: "entrypoints/popup/index.html",
    },
    web_accessible_resources: [
      {
        resources: ["assets/*", "logo2.png"],
        matches: ["<all_urls>"],
      },
    ],
    commands: {},
  },
});
