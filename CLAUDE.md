# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RidePal (友邻顺路) is a **WeChat Mini Program** for carpooling/ride-sharing. It is in early development with mock data and no backend integration yet.

## Development Environment

- **Platform**: WeChat Mini Program (微信小程序)
- **UI Framework**: Vant Weapp v1.11.7 (`@vant/weapp`)
- **Map SDK**: Tencent QQ Map (`utils/qqmap-wx-jssdk.min.js`)
- **Dev Tools**: WeChat DevTools (no custom npm scripts — use DevTools to build/preview/debug)
- **NPM**: After `npm install`, use WeChat DevTools menu "Tools → Build npm" to compile `miniprogram_npm/`

## Architecture

### Page Routing & Tab Bar

4 tab pages: message (信息), contacts (通讯录), carpooling (服务), me (我). The tab bar is **custom** (`custom-tab-bar/`) built with Vant `van-tabbar`. **Tab index 2 (服务) does not navigate** — it intercepts the tap and calls `openServiceMenu()` on the current page to show a service modal overlay.

Each tab page must sync the tab bar active state in `onShow()`:
```js
onShow() {
  if (typeof this.getTabBar === 'function' && this.getTabBar()) {
    this.getTabBar().setData({ active: 0 }) // 0=信息, 1=通讯录, 2=服务, 3=我
  }
}
```

### Behaviors (Mixins)

`behaviors/service-popup.js` — shared by all tab pages. Provides `showServiceMenu` data field and `openServiceMenu`/`onCloseServiceMenu`/`onSelectService` methods. Pages using it must include the `<service-menu-modal>` component in their wxml.

### Components

- `components/service-menu-modal/` — scrollable grid popup with 10 service options, uses Vant popup/grid

### Global Vant Components

Registered in `app.json` usingComponents: van-icon, van-search, van-nav-bar, van-checkbox, van-checkbox-group, van-cell, van-cell-group, van-button, van-tabbar, van-tabbar-item. Additional Vant components are registered per-page in each page's `.json`.

### Navigation Patterns

- Tab switching: `wx.switchTab()` (only for the 4 tab pages)
- Push page: `wx.navigateTo()` (chat, contact-detail, select-contact, select-location)
- Back: `wx.navigateBack()`

### Pages

| Page | Path | Role |
|------|------|------|
| message | `pages/message/` | Chat list (tab) |
| contacts | `pages/contacts/` | Contact directory with search (tab) |
| carpooling | `pages/carpooling/` | Carpool listings with filters (tab, custom nav bar) |
| me | `pages/me/` | User profile (tab) |
| chat | `pages/chat/` | 1-on-1 chat detail with message bubbles |
| contact-detail | `pages/contact-detail/` | Contact info card |
| select-contact | `pages/select-contact/` | Multi-select contact picker |
| select-location | `pages/select-location/` | Map-based location picker (Tencent Map) |

### Utilities

- `utils/util.js` — `filterList(list, keyword, keys)` for search filtering, `formatTime(date)` for date formatting
- `utils/qqmap-wx-jssdk.min.js` — Tencent Map SDK (reverse geocoding, location suggestions)

## Conventions

- All data is currently **mock/hardcoded** — no real API calls yet
- Search inputs use **500ms debounce** (contacts, select-contact)
- The carpooling page uses `navigationStyle: "custom"` in its `.json` for a custom header; other pages use the default navigation bar
- File structure per page: `.wxml` (template), `.wxss` (styles), `.js` (logic), `.json` (config)
- Global styles in `app.wxss` are currently empty; each page owns its styles
