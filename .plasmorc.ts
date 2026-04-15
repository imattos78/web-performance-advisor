import { Config } from "plasmo";

export default {
  manifest: {
    name: "Web Performance Advisor",
    description: "Analyze any website for performance, SEO, accessibility, and best practices",
    version: "0.0.1",
    author: "imattos78",
    action: {
      default_title: "Web Performance Advisor",
      default_popup: "popup.html"
    },
    content_scripts: [
      {
        matches: ["<all_urls>"],
        js: ["content.ts"]
      }
    ],
    background: {
      service_worker: "background.ts"
    },
    permissions: ["activeTab", "tabs"],
    host_permissions: ["https://*/*", "http://*/*"]
  }
} satisfies Config;