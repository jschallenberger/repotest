pm2 used in ubutun to make application run in background <br>
install pm2
```npm install pm2 -g```<br>
create the app and run every 2 hours
```pm2 start index.js --cron-restart="0 */2 * * *"```<br>
kill processes so you can start again<br>
```pm2 kill```
list processes
```pm2 list``` or ```ps aux | grep index.js```
