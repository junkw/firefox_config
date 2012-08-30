// -*- mode: js2; coding: utf-8; indent-tabs-mode: nil -*-

// ========================== KeySnail Init File =========================== //

// ============================ PRESERVE area ============================== //
//{{%PRESERVE%
// migemo
// prompt.useMigemo           = true;
// prompt.migemoMinWordLength = 3;

// killring
command.kill.killRingMax   = 20;
command.kill.textLengthMax = -1;

// Disable IME in the prompt
// @see https://gist.github.com/304619
for each (let id in ["keysnail-prompt-textbox", "urlbar"]) {
    let box = document.getElementById(id);
    let input = document.getAnonymousElementByAttribute(box, 'anonid', 'input');
    if (input)
        input.style.imeMode = "inactive";
}

// default keymap in the prompt
util.extendDefaultKeymap = function(keymap) {
    let defaultKeymap = {
        "C-z" : "prompt-toggle-edit-mode",
        "SPC" : "prompt-next-page",
        "ESC" : "prompt-cancel",
        "C-i" : "prompt-select-action",
        "b"   : "prompt-previous-page",
        "j"   : "prompt-next-completion",
        "k"   : "prompt-previous-completion",
        "g"   : "prompt-beginning-of-candidates",
        "G"   : "prompt-end-of-candidates"
    };

    let destKeyMap = {};

    for (let [key, value] in Iterator(defaultKeymap))
        destKeyMap[key] = value;

    if (keymap)
        for (let [key, value] in Iterator(keymap))
            destKeyMap[key] = value;

    return destKeyMap;
};

// Load init files
// @see https://github.com/958/my-keysnail-setting/blob/master/.keysnail.js
(function() {
    try {
        userscript.addLoadPath(util.getExtensionLocalDirectoryRoot().path);
        util.readDirectory(util.getExtensionLocalDirectoryRoot(), true)
            .filter(function (file) !(file.leafName.match("^\\.\\.keysnail\\.js$") ||
                                      !file.leafName.match("\\.keysnail\\.js$") ||
                                      file.isDirectory()))
            .map(function (file) file.leafName)
            .sort()
            .forEach(function (file) {
                util.message('Load sub setting files: ' + file);
                userscript.require(file);
            });
    } catch (ex) { }
})();
//}}%PRESERVE%

// ========================= Special key settings ========================== //

key.quitKey              = "C-g";
key.helpKey              = "<f1>";
key.escapeKey            = "C-q";
key.macroStartKey        = "<f3>";
key.macroEndKey          = "<f4>";
key.universalArgumentKey = "C-u";
key.negativeArgument1Key = "C--";
key.negativeArgument2Key = "C-M--";
key.negativeArgument3Key = "M--";
key.suspendKey           = "<f2>";

// ================================= Hooks ================================= //

hook.setHook('MenuPopupShowing', function stopKeySnail(ev) {
    key.suspended = true;
});

hook.setHook('MenuPopupHiding', function restartKeySnail(ev) {
    key.suspended = false;
});

// @see https://github.com/958/my-keysnail-setting/blob/master/keysnail/hook.keysnail.js
hook.setHook('KeyBoardQuit', function (aEvent) {
    if (key.currentKeySequence.length) {
        return;
    }

    command.closeFindBar();

    if ("allTabs" in window && allTabs.isOpen) {
        allTabs.close();
    }

    if (aEvent.target !== document.getElementById("keysnail-prompt-textbox")) {
        try {
            prompt.finish(true);
        } catch(e) {}
    }

    if (KeySnail.windowType != "navigator:browser") {
        window.close();
    }

    if (util.isCaretEnabled()) {
        if (command.marked(aEvent)) {
            command.resetMark(aEvent);
        }
        util.setBoolPref("accessibility.browsewithcaret", false);
    } else {
        goDoCommand("cmd_selectNone");
    }

    if (KeySnail.windowType === "navigator:browser") {
        key.generateKey(aEvent.originalTarget, KeyEvent.DOM_VK_ESCAPE, true);
    }

    if ("blur" in aEvent.target) {
        aEvent.target.blur();
    }

    if (typeof gBrowser != "undefined") {
        gBrowser.focus();
    }

    if (content) {
        content.focus();
    }
});

// ============================== Black list =============================== //

hook.addToHook("LocationChange", function (aNsURI) {
    var URL = aNsURI ? aNsURI.spec : null;
    key.suspendWhenMatched(URL, key.blackList);
});

key.blackList = [
];

// ============================= Key bindings ============================== //

// Global
key.setGlobalKey('C-M-r', function (ev) {
    userscript.reload();
}, 'Reload the initialization file', true);

key.setGlobalKey('M-x', function (ev, arg) {
    command.closeFindBar();
    ext.select(arg, ev);
}, 'List exts and execute selected one', true);

key.setGlobalKey('M-:', function (ev) {
    command.interpreter();
}, 'Command interpreter', true);

key.setGlobalKey([key.helpKey, 'b'], function (ev) {
    key.listKeyBindings();
}, 'List all keybindings');

key.setGlobalKey([key.helpKey, 'F'], function (ev) {
    openHelpLink("firefox-help");
}, 'Display Firefox help');

key.setGlobalKey([key.helpKey, 'k'], function (ev, arg) {
    ext.exec("describe-key", arg, ev);
}, 'Describe key');

key.setGlobalKey('C-m', function (ev) {
    key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_RETURN, true);
}, 'Generate the return key code');

key.setGlobalKey(['C-x', 'l'], function (ev) {
    command.closeFindBar();
    command.focusToById("urlbar");
}, 'Focus to the location bar', true);

key.setGlobalKey(['C-x', 'g'], function (ev) {
    command.closeFindBar();
    command.focusToById("searchbar");
}, 'Focus to the search bar', true);

key.setGlobalKey(['C-x', 't'], function (ev) {
    command.focusElement(command.elementsRetrieverTextarea, 0);
}, 'Focus to the first textarea', true);

key.setGlobalKey(['C-x', 's'], function (ev) {
    command.focusElement(command.elementsRetrieverButton, 0);
}, 'Focus to the first button', true);

key.setGlobalKey(['C-x', 'k'], function (ev) {
    BrowserCloseTabOrWindow();
}, 'Close tab / window');

key.setGlobalKey(['C-x', 'K'], function (ev) {
    closeWindow(true);
}, 'Close the window');

key.setGlobalKey(['C-x', 'n'], function (ev) {
    OpenBrowserWindow();
}, 'Open new window');

key.setGlobalKey(['C-x', 'C-c'], function (ev) {
    goQuitApplication();
}, 'Exit Firefox', true);

key.setGlobalKey(['C-x', 'o'], function (ev, arg) {
    command.focusOtherFrame(arg);
}, 'Select next frame');

key.setGlobalKey(['C-x', '1'], function (ev) {
    window.loadURI(ev.target.ownerDocument.location.href);
}, 'Show current frame only', true);

key.setGlobalKey(['C-x', 'C-f'], function (ev) {
    BrowserOpenFileWindow();
}, 'Open the local file', true);

key.setGlobalKey(['C-x', 'C-s'], function (ev) {
    saveDocument(window.content.document);
}, 'Save current page to the file', true);

key.setGlobalKey('M-w', function (ev) {
    command.copyRegion(ev);
}, 'Copy selected text', true);

key.setGlobalKey('C-s', function (ev) {
    command.iSearchForwardKs(ev);
}, 'isearch forward', true);

key.setGlobalKey('C-r', function (ev) {
    command.iSearchBackwardKs(ev);
}, 'isearch backward', true);

key.setGlobalKey(['C-c', 'u'], function (ev) {
    undoCloseTab();
}, 'Undo closed tab');

key.setGlobalKey(['C-c', 'C-c', 'C-v'], function (ev) {
    toJavaScriptConsole();
}, 'Display JavaScript console', true);

key.setGlobalKey(['C-c', 'C-c', 'C-c'], function (ev) {
    command.clearConsole();
}, 'Clear Javascript console', true);

key.setGlobalKey('C-M-l', function (ev) {
    getBrowser().mTabContainer.advanceSelectedTab(1, true);
}, 'Select next tab');

key.setGlobalKey('C-M-h', function (ev) {
    getBrowser().mTabContainer.advanceSelectedTab(-1, true);
}, 'Select previous tab');

key.setGlobalKey(["C-x", "C-b"], function (ev, arg) {
    command.closeFindBar();
    ext.exec("tanything", arg);
}, "View all tabs", true);

// View mode
key.setViewKey([['C-n'], ['j']], function (ev) {
    key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_DOWN, true);
}, 'Scroll line down');

key.setViewKey([['C-p'], ['k']], function (ev) {
    key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_UP, true);
}, 'Scroll line up');

key.setViewKey([['C-f'], ['.']], function (ev) {
    key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_RIGHT, true);
}, 'Scroll right');

key.setViewKey([['C-b'], [',']], function (ev) {
    key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_LEFT, true);
}, 'Scroll left');

key.setViewKey([['M-v'], ['b']], function (ev) {
    goDoCommand("cmd_scrollPageUp");
}, 'Scroll page up');

key.setViewKey([['C-v'], ['SPC']], function (ev) {
    goDoCommand("cmd_scrollPageDown");
}, 'Scroll page down');

key.setViewKey([['J'], ['C-d']], function (ev, arg) {
    ext.exec("scrollet-scroll-document-down", arg, ev);
}, 'Scroll document down', true);

key.setViewKey([['K'], ['M-u']], function (ev, arg) {
    ext.exec("scrollet-scroll-document-up", arg, ev);
}, 'Scroll document up', true);

key.setViewKey([['M-<'], ['g']], function (ev) {
    goDoCommand("cmd_scrollTop");
}, 'Scroll to the top of the page', true);

key.setViewKey([['M->'], ['G']], function (ev) {
    goDoCommand("cmd_scrollBottom");
}, 'Scroll to the bottom of the page', true);

key.setViewKey('%', function (ev, arg) {
    ext.exec("scrollet-scroll-percent", arg);
}, 'Scroll document to the specified percent');

key.setViewKey([['C-x', 'r', 'SPC'], ['m']], function (ev, arg) {
    ext.exec("scrollet-set-mark", arg, ev);
}, "Save current scroll / caret position to the mark", true);

key.setViewKey([['C-x', 'r', 'j'], ['\'']], function (ev, arg) {
    command.closeFindBar();
    ext.exec("scrollet-jump-to-mark", arg, ev);
}, "Jump to the saved position", true);

// @see http://lab.designsatellites.jp/?p=1499
key.setViewKey(['C-c', 'd', 'u'], function () {
    var uri = getBrowser().currentURI;
    if (uri.path == "/") {
        return;
    }
    var pathList = uri.path.split("/");
    if (!pathList.pop()) {
        pathList.pop();
    }
    loadURI(uri.prePath + pathList.join("/") + ("/"));
}, 'Go to the superior directory of this page');

key.setViewKey(['C-c', 'd', 'r'], function () {
    var uri = window._content.location.href;
    if (uri == null) {
        return;
    }
    var root = uri.match(/^[a-z]+:\/\/[^/]+\//);
    if (root) {
        loadURI(root, null, null);
    }
}, 'Go to the root directory of this host');

key.setViewKey(['C-c', '>'], function (ev, arg) {
    ext.exec('follow-next-link', arg, ev);
}, 'Follow next link', true);

key.setViewKey(['C-c', '<'], function (ev, arg) {
    ext.exec('follow-prev-link', arg, ev);
}, 'Follow previous link', true);

key.setViewKey('l', function (ev) {
    getBrowser().mTabContainer.advanceSelectedTab(1, true);
}, 'Select next tab');

key.setViewKey('h', function (ev) {
    getBrowser().mTabContainer.advanceSelectedTab(-1, true);
}, 'Select previous tab');

// @see http://lab.designsatellites.jp/?p=1499
key.setViewKey('H', function () {
    if (gBrowser.mCurrentTab.previousSibling) {
        gBrowser.moveTabTo(gBrowser.mCurrentTab, gBrowser.mCurrentTab._tPos - 1);
    } else {
        gBrowser.moveTabTo(gBrowser.mCurrentTab, gBrowser.mTabContainer.childNodes.length - 1);
    }
}, 'Move current tab to the left');

key.setViewKey('L', function () {
    if (gBrowser.mCurrentTab.nextSibling) {
        gBrowser.moveTabTo(gBrowser.mCurrentTab, gBrowser.mCurrentTab._tPos + 1);
    } else {
        gBrowser.moveTabTo(gBrowser.mCurrentTab, 0);
    }
}, 'Move current tab to the right');

// @see http://lab.designsatellites.jp/?p=1499
key.setViewKey('C-M-s', function (ev) {
    openUILinkIn('view-source:' + content.location.href, 'tab');
}, 'View Source');

key.setViewKey(['C-x', 'RET', 'r'], function (ev, arg) {
    command.closeFindBar();
    ext.exec('set-encoding', arg, ev);
}, 'Set encoding', true);

key.setViewKey('R', function (ev) {
    BrowserReload();
}, 'Reload the page', true);

key.setViewKey('B', function (ev) {
    BrowserBack();
}, 'Back');

key.setViewKey('F', function (ev) {
    BrowserForward();
}, 'Forward');

key.setViewKey(['C-x', 'h'], function (ev) {
    goDoCommand("cmd_selectAll");
}, 'Select all', true);

key.setViewKey('f', function (ev) {
    command.focusElement(command.elementsRetrieverTextarea, 0);
}, 'Focus to the first textarea', true);

key.setViewKey('M-p', function (ev) {
    command.walkInputElement(command.elementsRetrieverButton, true, true);
}, 'Focus to the next button');

key.setViewKey('M-n', function (ev) {
    command.walkInputElement(command.elementsRetrieverButton, false, true);
}, 'Focus to the previous button');

key.setViewKey('e', function (aEvent, aArg) {
    ext.exec("hok-start-foreground-mode", aArg);
}, 'Hok - Foreground hint mode', true);

key.setViewKey('E', function (aEvent, aArg) {
    ext.exec("hok-start-background-mode", aArg);
}, 'HoK - Background hint mode', true);

key.setViewKey(';', function (aEvent, aArg) {
    ext.exec("hok-start-extended-mode", aArg);
}, 'HoK - Extented hint mode', true);

key.setViewKey(['C-c', 'e'], function (aEvent, aArg) {
    ext.exec("hok-start-continuous-mode", aArg);
}, 'Start continuous HaH', true);

key.setViewKey('W', function (ev, arg) {
    command.closeFindBar();
    ext.exec("copy-page-info", arg, ev);
}, 'Copy current page info');

key.setViewKey(['C-x', 'G'], function (ev, arg) {
    command.closeFindBar();
    ext.exec("search-with-suggest", arg, ev);
}, 'Search with suggest', true);

key.setViewKey(['C-c', 'b', 'a'], function (ev, arg) {
    PlacesCommandHook.bookmarkCurrentPage(true, PlacesUtils.bookmarksMenuFolderId);
}, 'Add to bookmark', true);

key.setViewKey(['C-c', 'b', 'l'], function (ev, arg) {
    command.closeFindBar();
    ext.exec("bmany-list-all-bookmarks", arg, ev);
}, 'bmany - List all bookmarks', true);

key.setViewKey(['C-c', 'b', 'L'], function (ev, arg) {
    command.closeFindBar();
    ext.exec("bmany-list-bookmarklets", arg, ev);
}, "bmany - List all bookmarklets", true);

key.setViewKey(['C-c', 'b', 'k'], function (ev, arg) {
    command.closeFindBar();
    ext.exec("bmany-list-bookmarks-with-keyword", arg, ev);
}, "bmany - List bookmarks with keyword", true);

key.setViewKey(['C-c', 'b', 't'], function (ev, arg) {
    command.closeFindBar();
    ext.exec("bmany-list-bookmarks-with-tag", arg, ev);
}, "bmany - List bookmarks with tag", true);

key.setViewKey(['C-c', 'r', 'l'], function (ev, arg) {
    command.closeFindBar();
    ext.exec("ril-show-reading-list", arg, ev);
}, "RIL - Show reading list", true);

key.setViewKey(['C-c', 'r', 'm'], function (ev, arg) {
    ext.exec("ril-toggle", arg, ev);
    BrowserCloseTabOrWindow();
}, "RIL - Append or remove current tab", true);

key.setViewKey(':', function (ev, arg) {
    try {
        prompt.finish();
    } catch (e) {
    }
    command.closeFindBar();
    shell.input(null, arg);
}, 'List and execute commands', true);

// @see https://github.com/958/my-keysnail-setting/blob/master/.keysnail.js
key.setViewKey('C', function (ev, arg) {
    util.setBoolPref("accessibility.browsewithcaret", !util.getBoolPref("accessibility.browsewithcaret"));
}, 'Caret mode', true);

// Edit mode
key.setEditKey(["C-c", "C-e"], function (ev, arg) {
    ext.exec("edit_text", arg, ev);
}, "Edit with Emacs", true);

key.setEditKey(['C-x', 'h'], function (ev) {
    command.selectAll(ev);
}, 'Select whole text', true);

key.setEditKey([['C-x', 'u'], ['C-/']], function (ev) {
    display.echoStatusBar("Undo!", 2000);
    goDoCommand("cmd_undo");
}, 'Undo');

key.setEditKey(['C-x', 'r', 'd'], function (ev, arg) {
    command.replaceRectangle(ev.originalTarget, "", false, !arg);
}, 'Delete text in the region-rectangle', true);

key.setEditKey(['C-x', 'r', 't'], function (ev) {
    prompt.read("String rectangle: ", function (aStr, aInput) {
        command.replaceRectangle(aInput, aStr);
    },
    ev.originalTarget);
}, 'Replace text in the region-rectangle with user inputted string', true);

key.setEditKey(['C-x', 'r', 'o'], function (ev) {
    command.openRectangle(ev.originalTarget);
}, 'Blank out the region-rectangle, shifting text right', true);

key.setEditKey(['C-x', 'r', 'k'], function (ev, arg) {
    command.kill.buffer = command.killRectangle(ev.originalTarget, !arg);
}, 'Delete the region-rectangle and save it as the last killed one', true);

key.setEditKey(['C-x', 'r', 'y'], function (ev) {
    command.yankRectangle(ev.originalTarget, command.kill.buffer);
}, 'Yank the last killed rectangle with upper left corner at point', true);

key.setEditKey([['C-SPC'], ['C-@']], function (ev) {
    command.setMark(ev);
}, 'Set the mark', true);

key.setEditKey('C-o', function (ev) {
    command.openLine(ev);
}, 'Open line');

key.setEditKey('C-M-/', function (ev) {
    display.echoStatusBar("Redo!", 2000);
    goDoCommand("cmd_redo");
}, 'Redo');

key.setEditKey('C-a', function (ev) {
    command.beginLine(ev);
}, 'Beginning of the line');

key.setEditKey('C-e', function (ev) {
    command.endLine(ev);
}, 'End of the line');

key.setEditKey('C-f', function (ev) {
    command.nextChar(ev);
}, 'Forward char');

key.setEditKey('C-b', function (ev) {
    command.previousChar(ev);
}, 'Backward char');

key.setEditKey('M-f', function (ev) {
    command.forwardWord(ev);
}, 'Next word');

key.setEditKey('M-b', function (ev) {
    command.backwardWord(ev);
}, 'Previous word');

key.setEditKey('C-n', function (ev) {
    command.nextLine(ev);
}, 'Next line');

key.setEditKey('C-p', function (ev) {
    command.previousLine(ev);
}, 'Previous line');

key.setEditKey('C-v', function (ev) {
    command.pageDown(ev);
}, 'Page down');

key.setEditKey('M-v', function (ev) {
    command.pageUp(ev);
}, 'Page up');

key.setEditKey('M-<', function (ev) {
    command.moveTop(ev);
}, 'Beginning of the text area');

key.setEditKey('M->', function (ev) {
    command.moveBottom(ev);
}, 'End of the text area');

key.setEditKey('C-d', function (ev) {
    goDoCommand("cmd_deleteCharForward");
}, 'Delete forward char');

key.setEditKey('C-h', function (ev) {
    goDoCommand("cmd_deleteCharBackward");
}, 'Delete backward char');

key.setEditKey('M-d', function (ev) {
    command.deleteForwardWord(ev);
}, 'Delete forward word');

key.setEditKey([['C-<backspace>'], ['M-<delete>']], function (ev) {
    command.deleteBackwardWord(ev);
}, 'Delete backward word');

key.setEditKey('M-u', function (ev, arg) {
    command.wordCommand(ev, arg, command.upcaseForwardWord, command.upcaseBackwardWord);
}, 'Convert following word to upper case');

key.setEditKey('M-l', function (ev, arg) {
    command.wordCommand(ev, arg, command.downcaseForwardWord, command.downcaseBackwardWord);
}, 'Convert following word to lower case');

key.setEditKey('M-c', function (ev, arg) {
    command.wordCommand(ev, arg, command.capitalizeForwardWord, command.capitalizeBackwardWord);
}, 'Capitalize the following word');

key.setEditKey('C-k', function (ev) {
    command.killLine(ev);
}, 'Kill the rest of the line');

key.setEditKey('C-y', command.yank, 'Paste (Yank)');

key.setEditKey('M-y', command.yankPop, 'Paste pop (Yank pop)', true);

key.setEditKey('C-M-y', function (ev) {
    if (!command.kill.ring.length) {
        return;
    }

    let(ct = command.getClipboardText())(!command.kill.ring.length || ct != command.kill.ring[0]) && command.pushKillRing(ct);

    prompt.selector({
        message: "Paste:",
        collection: command.kill.ring,
        callback: function (i) {
            if (i >= 0) {
                key.insertText(command.kill.ring[i]);
            }
        }
    });
}, 'Show kill-ring and select text to paste', true);

key.setEditKey('C-w', function (ev) {
    goDoCommand("cmd_copy");
    goDoCommand("cmd_delete");
    command.resetMark(ev);
}, 'Cut current region', true);

key.setEditKey('M-n', function (ev) {
    command.walkInputElement(command.elementsRetrieverTextarea, true, true);
}, 'Focus to the next text area');

key.setEditKey('M-p', function (ev) {
    command.walkInputElement(command.elementsRetrieverTextarea, false, true);
}, 'Focus to the previous text area');

key.setEditKey(plugins.options["dabbrev.next_key"], function (ev, arg) {
    ext.exec("dabbrev-expand-with-suggestions", arg, ev);
}, "Expand previous word \"dynamically\".");

// Caret mode
key.setCaretKey([['C-a'], ['^']], function (ev) {
    ev.target.ksMarked ? goDoCommand("cmd_selectBeginLine") : goDoCommand("cmd_beginLine");
}, 'Move caret to the beginning of the line');

key.setCaretKey([['C-e'], ['$'], ['M->'], ['G']], function (ev) {
    ev.target.ksMarked ? goDoCommand("cmd_selectEndLine") : goDoCommand("cmd_endLine");
}, 'Move caret to the end of the line');

key.setCaretKey([['C-n'], ['j']], function (ev) {
    ev.target.ksMarked ? goDoCommand("cmd_selectLineNext") : goDoCommand("cmd_scrollLineDown");
}, 'Move caret to the next line');

key.setCaretKey([['C-p'], ['k']], function (ev) {
    ev.target.ksMarked ? goDoCommand("cmd_selectLinePrevious") : goDoCommand("cmd_scrollLineUp");
}, 'Move caret to the previous line');

key.setCaretKey([['C-f'], ['l']], function (ev) {
    ev.target.ksMarked ? goDoCommand("cmd_selectCharNext") : goDoCommand("cmd_scrollRight");
}, 'Move caret to the right');

key.setCaretKey([['C-b'], ['h']], function (ev) {
    ev.target.ksMarked ? goDoCommand("cmd_selectCharPrevious") : goDoCommand("cmd_scrollLeft");
}, 'Move caret to the left');

key.setCaretKey([['M-f'], ['w']], function (ev) {
    ev.target.ksMarked ? goDoCommand("cmd_selectWordNext") : goDoCommand("cmd_wordNext");
}, 'Move caret to the right by word');

key.setCaretKey([['M-b'], ['W']], function (ev) {
    ev.target.ksMarked ? goDoCommand("cmd_selectWordPrevious") : goDoCommand("cmd_wordPrevious");
}, 'Move caret to the left by word');

key.setCaretKey([['C-v'], ['SPC']], function (ev) {
    ev.target.ksMarked ? goDoCommand("cmd_selectPageNext") : goDoCommand("cmd_movePageDown");
}, 'Move caret down by page');

key.setCaretKey([['M-v'], ['b']], function (ev) {
    ev.target.ksMarked ? goDoCommand("cmd_selectPagePrevious") : goDoCommand("cmd_movePageUp");
}, 'Move caret up by page');

key.setCaretKey([['M-<'], ['g']], function (ev) {
    ev.target.ksMarked ? goDoCommand("cmd_selectTop") : goDoCommand("cmd_scrollTop");
}, 'Move caret to the top of the page');

key.setCaretKey('J', function (ev) {
    util.getSelectionController().scrollLine(true);
}, 'Scroll line down');

key.setCaretKey('K', function (ev) {
    util.getSelectionController().scrollLine(false);
}, 'Scroll line up');

key.setCaretKey(',', function (ev) {
    util.getSelectionController().scrollHorizontal(true);
    goDoCommand("cmd_scrollLeft");
}, 'Scroll left');

key.setCaretKey('.', function (ev) {
    goDoCommand("cmd_scrollRight");
    util.getSelectionController().scrollHorizontal(false);
}, 'Scroll right');

key.setCaretKey('z', function (ev) {
    command.recenter(ev);
}, 'Scroll to the cursor position');

key.setCaretKey([['C-SPC'], ['C-@']], function (ev) {
    command.setMark(ev);
}, 'Set the mark', true);

key.setCaretKey('R', function (ev) {
    BrowserReload();
}, 'Reload the page', true);

key.setCaretKey('B', function (ev) {
    BrowserBack();
}, 'Back');

key.setCaretKey('F', function (ev) {
    BrowserForward();
}, 'Forward');

key.setCaretKey(['C-x', 'h'], function (ev) {
    goDoCommand("cmd_selectAll");
}, 'Select all', true);

key.setCaretKey('f', function (ev) {
    command.focusElement(command.elementsRetrieverTextarea, 0);
}, 'Focus to the first textarea', true);

key.setCaretKey('M-p', function (ev) {
    command.walkInputElement(command.elementsRetrieverButton, true, true);
}, 'Focus to the next button');

key.setCaretKey('M-n', function (ev) {
    command.walkInputElement(command.elementsRetrieverButton, false, true);
}, 'Focus to the previous button');

key.setCaretKey(['C-x', 'C-x'], function (ev, arg) {
    ext.exec("swap-caret", arg, ev);
}, 'Swap caret', true);

key.setCaretKey(':', function (ev, arg) {
    try {
        prompt.finish();
    } catch (e) {
    }
    command.closeFindBar();
    shell.input(null, arg);
}, 'List and execute commands', true);

// @see https://github.com/958/my-keysnail-setting/blob/master/.keysnail.js
key.setCaretKey([['ESC'], ['q']], function (ev, arg) {
    util.setBoolPref("accessibility.browsewithcaret", !util.getBoolPref("accessibility.browsewithcaret"));
}, 'Escape from caret mode', true);
