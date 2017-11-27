# -*- mode: ruby; coding: utf-8; indent-tabs-mode: nil -*-
require 'fileutils'


task :link, 'profile'
task :link do |task, arg|
  profile_dir = arg['profile']
  if RUBY_PLATFORM.include?('darwin') && !profile_dir.include?('/')
    profile_path = Dir.home + '/Library/Application Support/Firefox/Profiles/' + profile_dir + '/'
  else
    profile_path = profile_dir
  end

  FileUtils.ln_sf("#{Dir.pwd}/user.js", profile_path)
  FileUtils.ln_sf("#{Dir.pwd}/chrome", profile_path)
end
