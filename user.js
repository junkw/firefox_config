// -*- mode: js2; coding: utf-8; indent-tabs-mode: nil -*-

// Auto-assignment on memory cache
user_pref("browser.cache.memory.capacity", -1);

// Disabel disk cache
//user_pref("browser.cache.disk.enable", false);

// Enable SPDY protocol
user_pref("network.http.spdy.enabled", true);
user_pref("network.http.spdy.enabled.v3", true);

// Use "I'm Feeling Lucky" in location bar
user_pref("keyword.URL", "http://www.google.com/search?btnI=I%27m+Feeling+Lucky&ie=UTF-8&oe=UTF-8&q=");

// about:newtab
user_pref("browser.newtabpage.enabled", true);

// Enable In-Content Preferences
user_pref("browser.preferences.inContent", true);

// Tab width
user_pref("browser.tabs.tabMaxWidth", 200);
user_pref("browser.tabs.tabMinWidth", 100);

// Don't move and resize window
user_pref("dom.disable_window_move_resize", true);
