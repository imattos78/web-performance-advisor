import { Config } from "plasmo";

export default {
  manifest: {
  name: "Web Performance Advisor",
  description: "...",
  version: "0.0.1",
  permissions: ["activeTab", "tabs"],
  host_permissions: ["<all_urls>"]
}
} satisfies Config;