const scriptsForever = {
    "jobworker": "forever start -l log/jobWorker.run.log -o log/jobWorker.log -e log/jobWorker.err.log jobWorker.js ",
    "server": "forever start -l log/server.run.log -o log/server.log -e log/server.err.log server.js ",
    "start": "mkdirp ./data ~/.forever/log;NODE_ENV=production concurrently \"npm run server\" \"npm run jobworker\" ",
    "poststart": "np-m run sleep ",
    "stop": "concurrently \"npm run stop:jobworker\" \"npm run stop:server\" ",
    "stop:jobworker": "forever stop jobWorker.js ",
    "stop:server": "forever stop server.js ",
    "sleep": "while(true);do sleep 10s;done"
}

const scriptsPM2 =  {
      "server": "pm2 start server.js --env production -i 1 --name server ",
      "worker": "pm2 start jobWorker.js --env production -i 0 --name worker ",
      "prestart": "rimraf ~/.pm2;mkdirp data ",
      "start": "NODE_ENV=production npm run server;npm run worker;npm run sleep ",
      "stop": "pm2 kill",
      "sleep": "while(true);do sleep 10s;done"
}

export const scripts = scriptsPM2
