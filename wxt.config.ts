import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "tutor",
    description: "AI tutor for DSA coding practice",
    version: "1.0.0",
    icons: {
      16: "icon/16.png",
      32: "icon/32.png",
      48: "icon/48.png",
      96: "icon/96.png",
      128: "icon/128.png",
    },
    permissions: ["storage", "tabs", "activeTab", "scripting"],
    host_permissions: ["https://leetcode.com/problems/*"],
    action: {
      default_title: "tutor",
      default_popup: "entrypoints/popup/index.html",
    },
    web_accessible_resources: [
      {
        resources: ["assets/*", "tutor.png"],
        matches: ["<all_urls>"],
      },
    ],
    commands: {},
  },
});
