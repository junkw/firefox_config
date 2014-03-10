# -*- mode: ruby; coding: utf-8; indent-tabs-mode: nil -*-


profile_dir = ENV["FIREFOX_PROFILE_DIR"]

task :make_dir do
  sh "mkdir -p #{profile_dir}/chrome #{profile_dir}/keysnail #{profile_dir}/keysnail/plugins"
end

task :link do
  sh "ln -s #{Dir.pwd}/keysnail/_keysnail.js ~/.keysnail.js"
  sh "ln -s #{Dir.pwd}/keysnail/_plugins.keysnail.js #{profile_dir}/keysnail/"
  sh "ln -s #{Dir.pwd}/keysnail/exts.keysnail.js #{profile_dir}/keysnail/"
end

task :install_keysnail_plugins do
  cd "#{profile_dir}/keysnail/plugins/" do
    sh "curl -sfLO https://gist.githubusercontent.com/958/1000062/raw/append_anchor.ks.js"
    sh "curl -sfLO https://raw.github.com/mooz/keysnail/master/plugins/bmany.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/958/1286792/raw/bookmarktag.ks.js"
    sh "curl -sfLO https://raw.github.com/mooz/keysnail/master/plugins/builtin-commands-ext.ks.js"
    sh "curl -sfLO https://raw.github.com/mooz/keysnail/master/plugins/caret-hint.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/958/1312071/raw/cookie-manager.ks.js"
    sh "curl -sfL https://gist.githubusercontent.com/958/1031072/raw/encoding-switcher.js -o encoding-switcher.js"
    sh "curl -sfLO https://raw.github.com/mooz/keysnail/master/plugins/dabbrev.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/raw/905297/find.ks.js -o find.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/958/1011984/raw/firefox-addon-manager.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/958/1011926/raw/firefox-plugin-manager.ks.js"
    sh "curl -sfLO https://raw.github.com/mooz/keysnail/master/plugins/github-plugin.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/raw/895953/history.ks.js"
    sh "curl -sfLO https://raw.github.com/mooz/keysnail/master/plugins/hok.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/958/992351/raw/hok-ex.ks.js"
    sh "curl -sfLO https://raw.github.com/myuhe/KeySnail_Plugin/master/K2Emacs.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/958/1369730/raw/ldrnail.ks.js"
    sh "curl -sfLO https://raw.github.com/mooz/keysnail/master/plugins/query-replace.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/raw/895703/RILnail.ks.js"
    sh "curl -sfLO https://raw.github.com/mooz/keysnail/master/plugins/_scrollet.ks.js"
    sh "curl -sfLO https://raw.github.com/mooz/keysnail/master/plugins/site-local-keymap.ks.js"
    sh "curl -sfLO https://gist.githubusercontent.com/958/3630309/raw/tabgroup.ks.js"
    sh "curl -sfLO https://raw.github.com/myuhe/KeySnail_Plugin/master/Tanything.ks.js"
    sh "curl -sfL https://gist.githubusercontent.com/958/1286784/raw/user-script-manager-ks.js -o user-script-manager.ks.js"
  end
end

task :default => [:make_dir, :link, :install_keysnail_plugins]
