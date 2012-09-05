// -*- mode: js2; coding: utf-8; indent-tabs-mode: nil -*-

// Site local keymap
var local = {};
plugins.options["site_local_keymap.local_keymap"] = local;

function fake(k, i) function () { key.feed(k, i); };
function pass(k, i) [k, fake(k, i)];
function ignore(k, i) [k, null];

local["^https?://mail.google.com/mail/"] = [
    // junmping
    pass(["g", "i"], 3), pass(["g", "s"], 3), pass(["g", "t"], 3), pass(["g", "d"], 3), pass(["g", "a"], 3),
    pass(["g", "c"], 3), pass(["g", "k"], 3), pass(["g", "l"], 3),
    // threadlist selection
    pass(["*", "a"], 3), pass(["*", "n"], 3), pass(["*", "r"], 3), pass(["*", "u"], 3), pass(["*", "s"], 3),
    pass(["*", "t"], 3),
    // navigation
    ["u", null], ["k", null], ["j", null], ["o", null], ["RET", null],
    ["p", null], ["n", null], ["`", null], ["~", null],
    // application
    ["c", null], ["/", null], ["q", null], ["?", null],
    // actions
    [",", null], ["x", null], ["s", null], ["y", null], ["e", null],
    ["m", null], ["!", null], ["#", null], ["r", null], ["R", null],
    ["a", null], ["A", null], ["f", null], ["F", null], ["N", null],
    ["<tab>", null], ["RET", null], ["ESC", null], ["]", null], ["}", null],
    ["[", null], ["{", null], ["z", null], [".", null], ["I", null],
    ["U", null], ["_", null], ["C-s", null], ["+", null], ["=", null],
    ["-", null], ["h", null], ["T", null]
];
local["^https?://www.google.(com|co.jp)/reader/view/"] = [
    // navigation
    ["j", null], ["k", null], ["SPC", null], ["S-SPC", null], ["n", null],
    ["p", null], ["N", null], ["P", null], ["X", null], ["O", null],
    // jumping
    pass(["g", "h"]), pass(["g", "a"]), pass(["g", "s"]), pass(["g", "u"]), pass(["g", "t"]),
    pass(["g", "T"]), pass(["g", "d"]), pass(["g", "e"]), pass(["g", "p"]),
    // application
    ["r", null], ["f", null], ["u", null], ["1", null], ["2", null],
    ["/", null], ["a", null], ["=", null], ["-", null]
    // acting on items
    ["s", null], ["t", null], ["e", null], ["S", null], ["d", null],
    ["v", null], ["o", null], ["RET", null], ["m", null], ["A", null],
    ["T", null],
    // add-on, user-script
    ["@", null], ["i", null], ["z", null]
];
local["^https?://www.google.com/calendar/"] = [
    // navigation
    ["j", null], ["k", null], ["n", null], ["p", null], ["t", null],
    // views
    ["1", null], ["2", null], ["3", null], ["4", null], ["5", null],
    ["d", null], ["w", null], ["m", null], ["x", null], ["a", null],
    // actions
    ["c", null], ["e", null], ["<delete>", null],  ["M-z", null], ["z", null],
    // application
    ["/", null], ["+", null], ["q", null], ["M-p", null], ["s", null],
    ["M-?", null], ["?", null]
];
local["^https://github.com/"] = [
    ["s", null], ["?", null], ["t", null], ["l", null], ["w", null],
    ["y", null], ["c", null], ["o", null], ["RET", null], ["x", null]
    ["i", null], ["I", null], ["u", null], ["U", null], ["e", null],
    ["/", null], ["h", null], ["H", null], ["j", null], ["J", null],
    ["k", null], ["K", null], ["l", null], ["L", null]
];

// LDRnail
plugins.options["ldrnail.include_urls"] = [
    "^https?://www\\.google\\.(co\\.jp|com)/search.*",
    "^https?://www\\.amazon\\.co\\.jp/s/.*"
];

plugins.options["ldrnail.keybind"] = {
    'j': 'next',
    'k': 'prev',
    'i': 'pin',
    'L': 'list',
    'f': 'focus',
    'v': 'view',
    'o': 'open',
    'S': 'siteinfo'
};

plugins.options["ldrnail.pinned_list_actions"] = [
    [function(aIndex) {
         if (aIndex < 0)
             return;

         let link = plugins.ldrnail.getItemLink(plugins.ldrnail.pinnedItems[aIndex]);

         if (link)
             openUILinkIn(link, 'tabshifted');
     },
     "Open link in background tab", "open,c",
    ],

    [function(aIndex) {
         if (aIndex < 0)
             return;

         let elem = plugins.ldrnail.pinnedItems[aIndex];

         if (elem)
             elem.scrollIntoView(true);
     },
     "Scroll to this item", "scroll,c",
    ],
];

plugins.options["ldrnail.pinned_list_keymap"] = {
    "o": "open",
    "s": "scroll"
};

// Expander
// @see http://lab.designsatellites.jp/?p=1499
plugins.options["dabbrev.next_key"] = "C-i";
plugins.options["dabbrev.prev_key"] = "C-M-i";

plugins.options["dabbrev.candidates"] = [
    "Apache",
    "CentOS",
    "Chrome",
    "Debian",
    "Facebook",
    "Emacs",
    "Evernote",
    "Firefox",
    "Github",
    "KeySnail",
    "MacOS X",
    "PostgreSQL",
    "Safari",
    "Twitter",
    "ubuntu",
    "Windows"
];

// K2Emacs
plugins.options["K2Emacs.editor"] = "/usr/local/bin/emacsclient -a /Applications/TextEdit.app/Contents/MacOS/TextEdit";
plugins.options["K2Emacs.ext"]    = "txt";
plugins.options["K2Emacs.encode"] = "UTF-8";
plugins.options["K2Emacs.sep"]    = "/";

// Tabgroup Controller
plugins.options['tabgroup.keymap'] = util.extendDefaultKeymap({
    "s" : "select",
    "c" : "create",
    "q" : "close",
    "r" : "edit-title",
    "g" : "move-tab-to",
});

// Tanything
plugins.options["tanything_opt.keymap"] = util.extendDefaultKeymap({
    "o" : "localOpen",
    "q" : "localClose",
    "Q" : "localAllclose",
    "p" : "localLeftclose",
    "n" : "localRightclose",
    "d" : "localDomainclose",
    "w" : "localClipUT",
    "e" : "localMovetoend",
    "i" : "localTogglePin"
});

// bmany
plugins.options["bmany.default_open_type"] = "tab";
plugins.options["bmany.keymap"] = {
    "E" : "edit-bookmark",
    "O" : "open-background-tab,cn"
};

// History
plugins.options['history.max-results'] = 5000;
plugins.options["hok.local_queries"] = [
    ["^about:newtab$", "a, input:not(.newtab-control-pin)", true]
];

// Hok ex
plugins.options['hok_ex.extra_actions'] = [
    // Open selected textarea with K2Emacs
    {
        type    : 'unique',
        matcher : function(elem) (elem.localName.toLowerCase() == 'textarea'),
        fn      : function(elem) {
            elem.focus();
            ext.exec('edit_text', null, { originalTarget: elem });
        }
    }
];

// RILnail
plugins.options["ril.keymap"] = {
    "o" : "open,c",
    "O" : "open-background,c",
    "d" : "delete"
};

// Firefox plugin manager
plugins.options["firefox_plugin_manager.keymap"] = util.extendDefaultKeymap({
    "X" : "toggle",
    'M' : 'open-plugin-manager'
});

// Firefox addon manager
plugins.options["firefox_addon_manager.keymap"] = util.extendDefaultKeymap({
    "X" : "toggle-state",
    "O" : "option",
    "U" : "toggle-uninstall",
    "+" : "toggle-update",
    "M" : "open-addon-manager"
});

// User script manager
plugins.options["user_script_manager.keymap"] = util.extendDefaultKeymap({
    "X" : "toggle",
    "E" : "edit",
    "U" : "uninstall",
    'O' : 'option',
    "M" : "open-sciprt-manager"
});
