@echo off

call npm install --audit=false --fund=false
SETLOCAL
SET PATH=node_modules\.bin;node_modules\hubot\node_modules\.bin;%PATH%

node_modules\.bin\hubot.cmd --name "<%= botName %>" %* 
