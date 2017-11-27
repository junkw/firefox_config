# -*- mode: ruby; coding: utf-8; indent-tabs-mode: nil -*-
require 'pathname'
require 'fileutils'


profile_dir = Pathname(ENV["FIREFOX_PROFILE_DIR"])
chrome_dir  = "#{profile_dir}/chrome"


task :make_chrome_dir do
  FileUtils.mkdir(chrome_dir)
end

task :link do
  FileUtils.ln_sf("#{Dir.pwd}/user.js", profile_dir)
  FileUtils.ln_sf("#{Dir.pwd}/userChrome.css", chrome_dir)
end


task :default => [:make_chrome_dir, :link]
