// -*- mode: js2-mode; coding: utf-8; indent-tabs-mode: nil -*-

// Auto install plugins
// @see http://d.hatena.ne.jp/sr10/20120109/1326108732
ext.add("auto-install-plugins", function(ev, arg){
    var urls = [
        "https://github.com/mooz/keysnail/raw/master/plugins/bmany.ks.js",
        "https://raw.github.com/gist/1286792/bookmarktag.ks.js",
        "https://github.com/mooz/keysnail/raw/master/plugins/builtin-commands-ext.ks.js",
        "https://github.com/mooz/keysnail/raw/master/plugins/caret-hint.ks.js",
        "https://raw.github.com/gist/1312071/cookie-manager.ks.js",
        "https://raw.github.com/gist/1031072/encoding-switcher.js",
        "https://gist.github.com/raw/905297/find.ks.js",
        "https://raw.github.com/gist/1011984/firefox-addon-manager.ks.js",
        "https://raw.github.com/gist/1011926/firefox-plugin-manager.ks.js",
        "https://github.com/mooz/keysnail/raw/master/plugins/github-plugin.ks.js",
        "https://gist.github.com/raw/895953/history.ks.js",
        "https://github.com/mooz/keysnail/raw/master/plugins/hok.ks.js",
        "https://raw.github.com/gist/992351/hok-ex.ks.js",
        "https://github.com/myuhe/KeySnail_Plugin/raw/master/K2Emacs.ks.js",
        "https://raw.github.com/gist/1369730/ldrnail.ks.js",
        "https://gist.github.com/raw/895703/RILnail.ks.js",
        "https://github.com/mooz/keysnail/raw/master/plugins/_scrollet.ks.js",
        "https://github.com/mooz/keysnail/raw/master/plugins/site-local-keymap.ks.js",
        "https://github.com/myuhe/KeySnail_Plugin/raw/master/Tanything.ks.js",
        "https://raw.github.com/gist/1286784/user-script-manager-ks.js"
    ];

    function inst (a) {
        if (a.length == 0) {
            display.showPopup("auto-install-plugins", "All installation finished.");
        } else {
            var url  = a.shift();
            var path = userscript.pluginDir + userscript.directoryDelimiter + url.match(/[^/]+$/)[0];

            if (plugins.context[path] === undefined) {
                userscript.installPluginFromURL(url, function(){inst(a);});
            } else {
                inst(a);
            }
        }
    }
    inst(urls);
}, "Install plugins automatically if not installed yet.");

// Describe Key
// @see https://gist.github.com/420462
ext.add("describe-key", function (ev, arg) {
    const keyMapRoot = key.keyMapHolder[key.getCurrentMode(ev)];
    const specialKeyPrefs = {};

    specialKeyPrefs[key.quitKey] = "specialKeyQuit";
    specialKeyPrefs[key.helpKey] = "specialKeyHelp";
    specialKeyPrefs[key.escapeKey] = "specialKeyEscape";
    specialKeyPrefs[key.macroStartKey] = "specialKeyMacroStart";
    specialKeyPrefs[key.macroEndKey] = "specialKeyMacroEnd";
    specialKeyPrefs[key.suspendKey] = "specialKeySuspend";
    specialKeyPrefs[key.universalArgumentKey] = "prefixArgumentPos";
    specialKeyPrefs[key.negativeArgument1Key] = "prefixArgumentNeg";
    specialKeyPrefs[key.negativeArgument2Key] = "prefixArgumentNeg";
    specialKeyPrefs[key.negativeArgument3Key] = "prefixArgumentNeg";

    let keyMap = keyMapRoot;
    let keySeq = [];
    let isLocal = true;

    key.passAllKeys = true;

    function fin(msg) {
        display.echoStatusBar(msg || "");
        window.removeEventListener("keypress", handleKeyPress, true);
        key.passAllKeys = false;
    }

    function print(msg) {
        display.prettyPrint(html.unEscapeTag(msg), { timeout : 2500, fade : 100 });
    }

    function displaySpecialKeyHelp(k) {
        let helpStr = k;

        if (specialKeyPrefs[k])
            helpStr += " : " + util.getLocaleString(specialKeyPrefs[k]);

        print(helpStr);
    }

    function getKeyMapValue(k) {
        if (keyMap[k])
            return keyMap[k];

        if (!isLocal)
            return null;

        isLocal = false;

        let globalKeyMap = key.trailByKeySequence(key.keyMapHolder[key.modes.GLOBAL], keySeq);

        return globalKeyMap ? globalKeyMap[k] : null;
    }

    function handleKeyPress(ev) {
        util.stopEventPropagation(ev);

        let k = key.keyEventToString(ev);

        if (!keySeq.length && specialKeyPrefs[k]) {
            displaySpecialKeyHelp(k);
            fin();
        }

        let v = getKeyMapValue(k);

        keySeq.push(k);
        display.echoStatusBar("describe-key: " + keySeq.join(" "));

        if (v) {
            switch (typeof v) {
            case "object":
                keyMap = v;
                break;
            case "function":
                print(keySeq.join(" ") + " : " + v.ksDescription);
                fin();
                break;
            }

            return;
        }

        fin(keySeq.join(" ") + " is undefined");
    }

    display.echoStatusBar("describe-key: ");
    window.addEventListener("keypress", handleKeyPress, true);
}, "Describe key");

// Firefox Sync
ext.add("sync-firefox-data", function() {
    window.gSyncUI.doSync();
}, "Start Firefox Sync");

// Clear cache
// @see http://www.pshared.net/diary/20111029.html
ext.add("clear-cache", function(ev, arg) {
    let cacheService = Cc["@mozilla.org/network/cache-service;1"].getService(Ci.nsICacheService);
    cacheService.evictEntries(Ci.nsICache.STORE_IN_MEMORY);
    cacheService.evictEntries(Ci.nsICache.STORE_ON_DISK);
    cacheService.evictEntries(Ci.nsICache.STORE_ON_DISK_AS_FILE);
    cacheService.evictEntries(Ci.nsICache.STORE_OFFLINE);
    cacheService.evictEntries(Ci.nsICache.STREAM_BASED);
}, "Clear cache");

// List tab history
// @see http://malblue.tumblr.com/post/349001250/tips-japanese-keysnail-github
ext.add("list-tab-history", function () {
    var tabHistory     = [];
    var sessionHistory = gBrowser.webNavigation.sessionHistory;

    if (sessionHistory.count < 1)
        return void display.echoStatusBar("Tab history not exist", 2000);

    var curIdx = sessionHistory.index;

    for (var i = 0; i < sessionHistory.count; i++) {
        var entry = sessionHistory.getEntryAtIndex(i, false);
        if (!entry)
            continue;
        tabHistory.push([util.getFaviconPath(entry.URI.spec), entry.title, entry.URI.spec, i]);
    }

    for (var thIdx = 0; thIdx < tabHistory.length; thIdx++) {
        if (tabHistory[thIdx][3] == curIdx) break;
    }

    prompt.selector({
        message      : "Select history in tab",
        collection   : tabHistory,
        flags        : [ICON | IGNORE, 0, 0, IGNORE | HIDDEN],
        header       : ["Title", "URL"],
        initialIndex : thIdx,
        callback     : function(i) { if (i >= 0) gBrowser.webNavigation.gotoIndex(tabHistory[i][3]); },
        keymap       : util.extendDefaultKeymap(),
        stylist      : function (args, n, current) {
            let style = '';
            if (args[3]== thIdx) style += 'font-weight:bold;';
            return style;
        }
    });
}, "List tab history");

// List closed tabs
// @see http://d.hatena.ne.jp/mooz/20091123/p1
ext.add("list-closed-tabs", function () {
    const fav = "chrome://mozapps/skin/places/defaultFavicon.png";
    var ss    = Cc["@mozilla.org/browser/sessionstore;1"].getService(Ci.nsISessionStore);
    var json  = Cc["@mozilla.org/dom/json;1"].createInstance(Ci.nsIJSON);
    var closedTabs = [[tab.image || fav, tab.title] for each (tab in json.decode(ss.getClosedTabData(window)))];

    if (!closedTabs.length)
        return void display.echoStatusBar("Not found closed tabs recently.", 2000);

    prompt.selector({
            message    : "Select tab to undo:",
            collection : closedTabs,
            flags      : [ICON | IGNORE, 0],
            callback   : function (i) { if (i >= 0) window.undoCloseTab(i); }
        });
}, "List closed tabs");

// Toggle style sheet
// @see http://lab.designsatellites.jp/?p=1499
ext.add("css-toggle",function(){
    getMarkupDocumentViewer().authorStyleDisabled = !getMarkupDocumentViewer().authorStyleDisabled;
},"Toggle style sheet");

// Copy current page info
ext.add("copy-page-info", function(ev, arg) {
    var templates = {
        Title    : "{0}",
        URL      : "{1}",
        Link     : "<a href=\"{1}\">{0}</a>",
        Doxygen  : "@see {1}",
        TracWiki : "[{1} {0}]",
        Org      : "[[{1}][{0}]]"
    };

    function getLineSeprator() {
        var sysInfo = Cc['@mozilla.org/system-info;1'].getService(Ci.nsIPropertyBag2);
        var platform = sysInfo.getProperty("name");

        if (platform.indexOf("Windows") >= 0) {
            return "\r\n";
        } else {
            return "\n";
        }
    }

    var regexp = /\{(\d)\}/g;

    function format() {
        var args = Array.prototype.slice.apply(arguments);
        var format = args.shift();
        return format && format.replace(regexp, function () {
            return args[arguments[1]] || "";
        });
    }

    var promptList = [];

    for (var key in templates) {
        promptList.push([key, templates[key].replace(/\n/g, '\\n')]);
    }

    var title = window.content.document.title;
    var url = window.content.location.href;

    prompt.selector({
        message: "copy from: ",
        flags: [0, 0],
        collection: promptList,
        header: ["key", "format"],
        callback: function (index) {
            if (index < 0) {
                return;
            }

            var key = promptList[index][0];
            var template = templates[key].replace(/\n/g, getLineSeprator());
            var text = format(template, title, url);
            Cc['@mozilla.org/widget/clipboardhelper;1'].getService(Ci.nsIClipboardHelper).copyString(text);
        }
    });
}, "Copy current page info");

// Copy feed of current page
// @see http://keysnail.g.hatena.ne.jp/mooz/20100619/1276943161
ext.add("copy-feed", function () {
    const doc = content.document;

    let feeds = [[e.getAttribute("title"), e.getAttribute("href")]
                 for ([, e] in Iterator(doc.querySelectorAll(['link[type="application/rss+xml"]',
                                                              'link[type="application/atom+xml"]'])))];

    prompt.selector(
        {
            message    : "Select feed",
            collection : feeds,
            callback   : function (i) {
                if (i >= 0)
                    command.setClipboardText(feeds[i][1]);
            }
        }
    );
}, "Copy feed of current page");

// follow next/previous link
// @see https://gist.github.com/304619
plugins.options["follow-link.targets"] = 'a[href], input:not([type="hidden"]), button';
plugins.options["follow-link.nextpattern"] = "^次へ|進む|^次.*|続|→|\\bnext|Next|≫";
plugins.options["follow-link.prevpattern"] = "\\bback|戻る|^前.*|←|\\bprev|Before|≪";

function findPattern(doc, pattern) {
    let target = plugins.options["follow-link.targets"];
    let regex = RegExp(pattern);
    let result = doc.querySelectorAll(target);

    for (let i=result.length-1;i>=0;--i) {
        let elem = result[i];

        if (regex.test(elem.textContent) || regex.test(elem.value)) {
            return elem;
        }
    }
    return false;
}

function findRel(doc, rel) {
    for each(let query in ['a[rel~="%s"]', 'link[rel~="%s"]']) {
        let link = doc.querySelector(util.format(query, rel));

        if (link)
            return link;
    }
    return false;
}

function followLink(doc, rel, pattern) {
    let link = findRel(doc, rel) || findPattern(doc, pattern);

    if (link);
    plugins.hok.followLink(link, plugins.hok.CURRENT_TAB);
}

ext.add("follow-next-link", function () followLink(content.document, "next", plugins.options["follow-link.nextpattern"]), "follow next link");
ext.add("follow-prev-link", function () followLink(content.document, "prev", plugins.options["follow-link.prevpattern"]), "follow previous link");

// Search with suggest
// @see https://gist.github.com/285701
ext.add("search-with-suggest", function(ev, arg) {
    let engines = util.suggest.getEngines();
    let suggestEngines = [util.suggest.ss.getEngineByName("Google")];
    let collection = engines.map(function (engine) [(engine.iconURI || {spec: ""}).spec, engine.name, engine.description]);
    prompt.selector({
        message    : "engine:",
        collection : collection,
        flags      : [ICON | IGNORE, 0, 0],
        header     : ["Name", "Description"],
        callback   : function (i) {
            if (i >= 0) {
                let text = content.document.getSelection().toString();

                if (text.length > 0)
                    openUILinkIn(engines[i].getSubmission(text, null).uri.spec, "tab");
                else
                    util.suggest.searchWithSuggest(engines[i], suggestEngines, "tab");
            }
        }
    });
}, "Search with suggest");
