/**
 * Background Script for Web Performance Advisor
 * Handles communication between popup and content scripts
 */

console.log("Web Performance Advisor background script loaded");

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Web Performance Advisor installed");
});

// Handle messages from popup to content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // This is handled by the content script directly
  // The background script mainly serves as a relay if needed
  return true;
});

// Handle tab updates to potentially trigger analysis
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Could be used for automatic analysis in the future
  if (changeInfo.status === 'complete' && tab.url) {
    console.log(`Tab updated: ${tab.url}`);
  }
});

export {};