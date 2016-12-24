# -*- mode: ruby; coding: utf-8; indent-tabs-mode: nil -*-
require 'pathname'
require 'fileutils'



profile_dir = Pathname(ENV["FIREFOX_PROFILE_DIR"])
chrome_dir  = profile_dir + "/chrome"
keysnail_plugin_dir = profile_dir + "/keysnail/plugins"


task :make_dir do
  FileUtils.mkdir(chrome_dir)
  FileUtils.mkdir_p(keysnail_plugin_dir)
end

task :link do
  FileUtils.ln_sf("#{Dir.pwd}/keysnail", "#{Dir.home}/.keysnail.d")
  FileUtils.ln_sf("#{Dir.pwd}/user.js", profile_dir)
  FileUtils.ln_sf("#{Dir.pwd}/userChrome.css", chrome_dir)
end

task :install_keysnail_plugins do
  cd keysnail_plugin_dir do
    sh "curl -sfLO https://gist.githubusercontent.com/958/1000062/raw/append_anchor.ks.js"
    sh "curl -sfLO https://raw.githubusercontent.com/mooz/keysnail/master/plugins/bmany.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/958/1286792/raw/bookmarktag.ks.js"
    sh "curl -sfLO https://raw.githubusercontent.com/mooz/keysnail/master/plugins/builtin-commands-ext.ks.js"
    sh "curl -sfLO https://raw.githubusercontent.com/mooz/keysnail/master/plugins/caret-hint.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/958/1312071/raw/cookie-manager.ks.js"
    sh "curl -sfL https://gist.githubusercontent.com/958/1031072/raw/encoding-switcher.js -o encoding-switcher.ks.js"
    sh "curl -sfLO https://raw.githubusercontent.com/mooz/keysnail/master/plugins/dabbrev.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/raw/905297/find.ks.js -o find.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/958/1011984/raw/firefox-addon-manager.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/958/1011926/raw/firefox-plugin-manager.ks.js"
    sh "curl -sfLO https://raw.githubusercontent.com/mooz/keysnail/master/plugins/github-plugin.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/raw/895953/history.ks.js"
    sh "curl -sfLO https://raw.githubusercontent.com/mooz/keysnail/master/plugins/hok.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/958/992351/raw/hok-ex.ks.js"
    sh "curl -sfLO https://raw.githubusercontent.com/myuhe/KeySnail_Plugin/master/K2Emacs.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/958/1369730/raw/ldrnail.ks.js"
    sh "curl -sfLO https://raw.githubusercontent.com/mooz/keysnail/master/plugins/query-replace.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/raw/895703/RILnail.ks.js"
    sh "curl -sfLO https://raw.githubusercontent.com/mooz/keysnail/master/plugins/_scrollet.ks.js"
    sh "curl -sfLO https://raw.githubusercontent.com/mooz/keysnail/master/plugins/set-mac.ks.js"
    sh "curl -sfLO https://raw.githubusercontent.com/mooz/keysnail/master/plugins/site-local-keymap.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/958/3630309/raw/tabgroup.ks.js"
    sh "curl -sfLO https://raw.githubusercontent.com/myuhe/KeySnail_Plugin/master/Tanything.ks.js"
    sh "curl -sfL https://gist.githubusercontent.com/958/1286784/raw/user-script-manager-ks.js -o user-script-manager.ks.js"
  end
end

task :default => [:make_dir, :link, :install_keysnail_plugins]
