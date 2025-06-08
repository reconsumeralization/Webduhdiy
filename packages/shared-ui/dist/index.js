"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAPINavigationConfig = exports.getBoltDIYNavigationConfig = exports.getDashboardNavigationConfig = exports.webduhNavigationConfig = exports.Navigation = void 0;
// Navigation Components
var Navigation_1 = require("./components/Navigation/Navigation");
Object.defineProperty(exports, "Navigation", { enumerable: true, get: function () { return Navigation_1.Navigation; } });
// Navigation Configuration
var navigation_1 = require("./config/navigation");
Object.defineProperty(exports, "webduhNavigationConfig", { enumerable: true, get: function () { return navigation_1.webduhNavigationConfig; } });
Object.defineProperty(exports, "getDashboardNavigationConfig", { enumerable: true, get: function () { return navigation_1.getDashboardNavigationConfig; } });
Object.defineProperty(exports, "getBoltDIYNavigationConfig", { enumerable: true, get: function () { return navigation_1.getBoltDIYNavigationConfig; } });
Object.defineProperty(exports, "getAPINavigationConfig", { enumerable: true, get: function () { return navigation_1.getAPINavigationConfig; } });
