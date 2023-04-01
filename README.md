# htxarchive
Scratchpad for ideas, I want to eventually build an events page for the local houston punk/hardcore/metal/indie scene and use that as an excuse to learn modern react and generally level up my fullstack skills.

For now, I'm going to start small. One thing that has always bummed me out is how ephemeral venues and their webpages are. This script aims to send event listing urls to archive.org's wayback machine to store for posterity.

You can find the Archive.org Save Page Now 2 API docs here:
https://docs.google.com/document/d/1Nsv52MvSjbLb2PCpHlat0gkzw0EvtSgpKHu4mk0MnrA

docker-compose.yml
```yaml
version: '3.9'
services:
  crawler:
    build: .
    environment:
      - ACCESS_KEY=myaccesskey
      - SECRET=mysecret
    volumes:
      - ./data:/app/data
    command: >
      sh -c "
      echo '0 6 * * 0 /app/run.sh >> /var/log/cron.log 2>&1' > /etc/cron.d/crawler-cron &&
      chmod 0644 /etc/cron.d/crawler-cron &&
      crontab /etc/cron.d/crawler-cron &&
      touch /var/log/cron.log &&
      tail -f /var/log/cron.log
      "
```

run.sh
```bash
#!/bin/sh

echo "Starting crawler at $(date)"

cd /app
node index.js

echo "Crawler finished at $(date)"
```
