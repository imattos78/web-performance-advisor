# Web Performance Advisor – Project Context

## Overview
This project is a browser extension built with Plasmo, React, TypeScript, and Tailwind CSS.

The extension analyzes any website and provides:
- Performance insights
- SEO checks
- Accessibility analysis (WCAG)
- Best practices

It generates a report with actionable recommendations.

---

## Core Features

### Analysis
- Runs automatically on current page
- Extracts DOM data
- Uses axe-core for accessibility

### Report
- Score (0–100)
- Categories:
  - Performance
  - SEO
  - Accessibility
  - Best Practices

### Recommendations
- Each issue includes:
  - Description
  - Impact (low/medium/high)
  - Suggested fix

---

## Authentication Model

- User can run analysis without login
- Results are LOCKED until login
- After login:
  - Full report visible
  - Data saved to backend

---

## Tech Stack
- Plasmo
- React
- TypeScript
- Tailwind
- Supabase (auth + database)

---

## Architecture

- content.ts → runs analysis
- popup.tsx → UI
- background.ts → messaging
- services/ → logic (analysis, scoring, recommendations)
- components/ → UI components

---

## Coding Guidelines
- Use TypeScript strictly
- Use functional components
- Keep logic modular
- Avoid duplication