// Enable Electrolysis (multi-process)
user_pref("browser.tabs.remote.autostart", true);
user_pref("dom.ipc.processCount", 2);

// Auto-assignment on memory cache
user_pref("browser.cache.memory.capacity", -1);

// Tab width
user_pref("browser.tabs.tabMaxWidth", 200);
user_pref("browser.tabs.tabMinWidth", 100);

// Don't move and resize window
user_pref("dom.disable_window_move_resize", true);

// Workaround to install user script from Github and use bookmarklet
user_pref("security.csp.enable", false);

// Local Variables:
// mode: js2
// coding: utf-8
// indent-tabs-mode: nil
// End:
