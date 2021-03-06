# NEAN (Neo4j, Express, Angular, Node) Stack Starter

A basic app that has all the features that all platforms have like authentication, validation, error handling and more.

## [DEMO](https://nean.io/)

Similar to the MEAN stack just with Neo4j rather than Mongo.

* Angular (client), Node (API), Neo4j (database)
* NodeJS in Typescript
* Basic Webpack build for Node (API)
* Angular CLI
* Chrome extension build output
* JWT (JSON web token) authentication
* Password hashing + salt
* SendGrid Email integration
* Angular Material
* Neo4j query integration
* API architecture (route -> controller -> service -> repository)
* Shared validation between Angular and Node (Error handling)
* Shared strongly typed view models
* Shared strongly typed API endpoints
* Google analytics - automatic page tracking
* Client share actions
* Lazy load routes with preloaded parts 
* Image uploader to Firebase storage
* Tutorial/on-boading/tour framework
* Emoji picker (Material CDK)
* Media (Image, YouTube, Vimeo) display component
* Web share API
* Basic web socket connection
* Notifications area/panel
* Stripe Payment integration
* Custom Material theme + font (Night Mode)
* Progressive Web App (PWA)

Client pages

* sign up
* login
* forgot password/reset password
* header navigation/footer
* newsletter sign up
* email feedback
* profile
* tutorials
* verify email
* terms and conditions, privacy policy and help

## In-progress or coming soon
* Angular localization
* GraphQL integration (Apollo)
* Cordova IOS build output
* Unit + integration tests (Karma + Protractor)

## Running Locally

Make sure you have [Node.js](http://nodejs.org/), [Neo4j](https://neo4j.com/) and [Angular CLI](https://cli.angular.io/) installed.

Neo4j note: create a local database with with username: neo4j and password: neo4j 

```sh
git clone git@github.com:CharlBest/nean-stack-starter.git
cd nean-stack-starter
npm install
npm run build
npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/)

## Make it your own (after clone)
1. Rename all occurances of the word "nean" to your chosen name
2. Replace logo in client assets folder
3. Create accounts for services
   1. Firebase account (Images)
   2. Google Analytics
   3. Heroku (App Hosting)
   4. Stripe (Payments)
   5. GCP Neo4j Instance (Database Hosting)
      1. Create VM instance in Compute Engine (f1-micro)
      2. 
   6. Cloudflare (DNS)
   7. Namecheap Domain
   8. SendGrid (Emails)
      1. Welcome
      2. Forgot password
      3. Feedback
      4. Email verification link
      5. Payment successful


## Development (watch/hot reload)
```sh
npm run dev
```

Your app should now be running on [localhost:4200](http://localhost:4200/)

## Why Heroku, GrapheneDB and Firebase for demo app hosting
Its free ;)

## Procfile & Heroku
This file is [Heroku](https://www.heroku.com/) specific for hosting the [nean demo app](https://www.nean.io/). Delete it if you're not using Heroku.

You will also notice in the package.json file there is a "heroku-postbuild" script. This is for the continuous build and deployment specific for Heroku. This can be replaced with npm's preinstall script if you want something standard.

## Environment variables
Change to yours.
### Client
In the environments folder there are 2 files. one for dev and one for production. The angular CLI switches them at build time.
### Server
In the environments folder there is 1 file. In development default values are used. In production your hosting service should set process.env with the appropriate variables

Note: firebase storage has authentication on their buckets. Whitelist your url or something




# Server setup

# Google Cloud (VM), Ubuntu server, Xfce4, VNC server, Putty SSH, Git, NGINX, Angular CLI, NodeJS, PM2, Docker, Neo4j, RabbitMQ, Cloudflare, Namecheap

## File destinations
* NGINX: /etc/nginx/sites-avialable/
* Node apps: /var/www/<SITE_NAME>/
* Neo4j: /home/<USERNAME>/neo4j/<SITE_ENVIRONMENT>/
* RabbitMQ:
  * home dir: /var/lib/rabbitmq
  * config file(s): /etc/rabbitmq/rabbitmq.config
  * database dir: /var/lib/rabbitmq/<USERNAME>/rabbit@<NODE_NAME>
* VNC: /home/<USERNAME>/.vnc/ 
* PM2: /home/<USERNAME>/.pm2/ 

## Ports:
### nean.io
* Node web: 3010
* Neo4j browser: 7474
* Neo4j: 7687
* RabbitMQ: 5672
* RabbitMQ management: 15672

### dev.nean.io
* Node web: +10 (3020)
* Neo4j: +1 (7475)
* Neo4j browser: +1 (7688)
* RabbitMQ: +1 (5673)
* RabbitMQ management: +1 (15673)

## Setup Ubuntu Server

Source: https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-18-04

1. Google Cloud Platfrom
2. Compute Engine
3. VM Instance - Create instance
    1. Machine type - micro (1 shared vCPU)
    2. Ubuntu 18.04 LTS Minimal - 20GB SSD
    3. Allow HTTPS traffic
    4. Advanced
        1. Management: Enable deletion protection
        2. Networking: Static external IP (NB: can't assign afterwards)

### Why Google CLoud VM:
Heroku charges $7 per instance that doesn't go to sleep after 30 minutes. That means if I want 3 Node instances, 2 for load balancing and zero downtime updates and 1 for the background worker process I have to pay ~$21. The VM is ~$25 and +- 7 instances can be run on it.

### Why not use the f1-micro or g1-small:
When building the client project with the Angular CLI the server freezes and a possible cause is the shared CPU because it doesn't happen with the standard machine types or it could be an out of memory problem.

## Ubuntu Desktop Environment

Source: https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-vnc-on-ubuntu-18-04

### Update

```sh
sudo apt update
```
#### Breakdown:
* sudo: super user do (admin)
* apt: package manager command (apt combines apt-get and apt-cache commands and sets nice defaults like progress bar and num of packages installed)
* update: Refreshes repository index

```sh
sudo apt upgrade
```
#### Breakdown:
* upgrade: Upgrades all upgradable packages

### Install

Packages repo site: https://packages.ubuntu.com/

```sh
sudo apt install xfce4 xfce4-goodies tightvncserver nano firefox
```
#### Breakdown:
* install: all the following packages needs to be intalled
* xfce4: Meta-package for the Xfce Lightweight Desktop Environment (File Manager, Panel, Session Manager, Settings, etc.)
* xfce4-goodies: enhancements for the Xfce4 Desktop Environment (clipboard, terminal, etc.)
* tightvncserver: virtual network computing server software (Remote desktop)
* text editor
* firefox browser

Optional: autocopysel (clipboard copy paste library but consumes lots of memory and scared of multiple running instances)

### VNC server setup

1. Start
```sh
vncserver
```

2. Enter password and set view-only password to NO

3. 1 represents the number of vnc server running
```sh
vncserver -kill :1 
```

4. Copy of your existing/default VNC configuration
```sh
cp ~/.vnc/xstartup ~/.vnc/xstartup_backup
```

5. Edit default config
```sh
nano ~/.vnc/xstartup
```

6. Edit file
```sh
#!/bin/bash
xsetroot -solid grey
/etc/X11/Xsession
export XKL_XMODMAP_DISABLE=1
startxfce4 &
```

7. Then hit Ctrl + X, and then Y to save and exit Nano

8. Start server again (higher resolution and color depth can degrade performance)
```sh
vncserver -geometry 1280x720 -depth 24
```

### SSH Tunnel for VNC on Windows Client

1. Go to https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html

2. Download and install PuTTY and puttygen.exe

3. Open puttygen
   * Click "Generate"
   * Key comment = <USERNAME> eg. bob
   * Click "Save private key" and use in PuTTY connection utility
   * Copy public key and add to Google Compute allowed SSH keys for your instance via the web console

4. Open PuTTY
    1. Session
        * Host Name (or IP address) = <USERNAME>@<SERVER_IP_ADDRESS> eg. bob@35.225.150.147
        * Port = 22
    2. Connection > SSH > Auth
        * Private key file for authentication
        * Click "Browse" and choose previously generated private key
    3. Connection > SSH > Tunnels
        * Source port = 5901
        * Destination = localhost:5901
        * Click "Add"
    4. Session
        * Saved sessions = vnc
        * Click "Save"
    5. Click "Open" at the bottom
    6. Enter password for instance in console

### VNC viewer

1. Download and install RealVNC from https://www.realvnc.com/en/connect/download/vnc/windows/
2. VNC server address = localhost:5901

## Setup domain

### Namecheap
Buy a domain name and set the name servers to cloudflare

### Cloudflare
* Create free account
* Enable HTTPS certificates
* Setup DNS
  1. Create Cloudflare account
  2. DNS section (Domain name system)
  3. Create A record (root domain) eg. nean.io
     * Name = @
     * IPv4 address = 35.225.150.147
  4. Create cname record
     * name = www
     * Domain name = nean.io
  5. Create A record (sub domain) eg. dev.nean.io
     * Name = dev
     * IPv4 address = 35.225.150.147


## Setup Nginx Web Server

Source: https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04

Complete source: https://medium.com/@jgefroh/a-guide-to-using-nginx-for-static-websites-d96a9d034940

Example: https://github.com/FranciscoKnebel/nginx-reverseproxy

Proxy summary: https://www.digitalocean.com/community/tutorials/understanding-nginx-http-proxying-load-balancing-buffering-and-caching

1. Install
```sh
sudo apt install nginx
```
2. Test
```sh
sudo nginx -v
```

1. Create /etc/nginx/sites-available/nean.io
```text
server {
    listen 443 http2 default_server;
    # IPv6 addresses
    listen [::]:443 http2 default_server;

    ssl on;
    ssl_certificate /etc/letsencrypt/live/nean.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nean.io/privkey.pem;

    server_name nean.io www.nean.io;

    root /var/www/nean.io/prod/dist/client;

    access_log /var/log/nean.io/nginx.access.log;
    error_log  /var/log/nean.io/nginx.error.log;

    include snippets/static-files.conf;

    location /api/ {
        proxy_pass http://localhost:3010;
        include snippets/api-params.conf;
    }
}
```

2. Create /etc/nginx/sites-available/dev.nean.io
```text
server {
    listen 443 http2;
    # IPv6 addresses
    listen [::]:443 http2;
    
    ssl on;
    ssl_certificate /etc/letsencrypt/live/dev.nean.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dev.nean.io/privkey.pem;

    server_name dev.nean.io;

    root /var/www/nean.io/dev/dist/client;

    access_log /var/log/dev.nean.io/nginx.access.log;
    error_log  /var/log/dev.nean.io/nginx.error.log;

    include snippets/static-files.conf;

    location /api/ {
        proxy_pass http://localhost:3020;
        include snippets/api-params.conf;
    }
}
```

3. Create static-files.conf
```text
index index.html;

location / {
    # First attempt to serve request as file, then as directory, then fall back to displaying the index.html
    try_files $uri $uri/ /index.html;
}
```

4. Create static-files.conf
```text
proxy_http_version 1.1;

# Set host header
proxy_set_header Host $host;

# List of IP addresses
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

# Log IP on nginx proxy server
proxy_set_header X-Real-IP $remote_addr;

# HTTP or HTTPS?
proxy_set_header X-Forwarded-Proto $scheme;

# CORS https://www.digitalocean.com/community/questions/allow-cors-origin-for-node-angular-api-on-nginx


proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_set_header Authorization $http_authorization;
# proxy_set_header X-NginX-Proxy true;
# proxy_max_temp_file_size 0;
# proxy_redirect off;
# proxy_read_timeout 240s;
# TODO: proxy_cache_bypass $http_upgrade;
```

5. Create symbolic links in /etc/nginx/sites-enabled
```sh
ln -s /etc/nginx/sites-available/nean.io /etc/nginx/sites-enabled/nean.io

ln -s /etc/nginx/sites-available/dev.nean.io /etc/nginx/sites-enabled/dev.nean.io
```
#### Breakdown:
ln: make link command
-s: symbolic link flag

6. Test config
```sh
sudo nginx -t
```

7. Restart
```sh
sudo service nginx restart
```

8. Set permissions
```sh
sudo chown -R $USER:$USER /var/www/nean.io

sudo chmod -R 755 /var/www/nean.io

# If the above doesn't work use this
# sudo chown -R www-data:www-data /var/www/nean.io
```

## Setup Node.js

Source: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04

Install NVM (Node version manager: https://github.com/creationix/nvm)
```sh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

Test NVM
```sh
nvm --version
```

List Node versions
```sh
nvm ls-remote
```

Install Node
```sh
nvm install v10.13.0
```

Test Node
```sh
node --version
```

NPM packages to work (those that require compiling code from source, for example)
```sh
sudo apt install build-essential
```

Notes:
* check how to run multiple versions of Node and test on newer ones

## Setup PM2

Install PM2
```sh
npm install pm2 -g
```

Test PM2
```sh
pm2 -v
```

### Ecosystem File (configuration)

1. Create ecosystem.config.js in /var/www/nean.io/

2. Replace ecosystem.config.js text
```javascript
// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/

const environmentVariables = {
    APP_HOST: '',
    AUTHENTICATION_KEY: '37LvDSm4XvjYOh9Y',
    NODE_ENV: 'production',
    SENDGRID_API_KEY: '***',
    SENDGRID_TEMPLATE_FEEDBACK: '***',
    SENDGRID_TEMPLATE_FORGOT_PASSWORD: '***',
    SENDGRID_TEMPLATE_INVITE: '***',
    SENDGRID_TEMPLATE_NOTIFICATION: '***',
    SENDGRID_TEMPLATE_PASSWORD_UPDATED: '***',
    SENDGRID_TEMPLATE_PAYMENT_SUCCESSFUL: '***',
    SENDGRID_TEMPLATE_RESEND_EMAIL_VERIFICATION_LINK: '***',
    SENDGRID_TEMPLATE_SYSTEM: '***',
    SENDGRID_TEMPLATE_WELCOME: '***',
    STRIPE_KEY: '***',
    VAPID_PRIVATE_KEY: '***',
    VAPID_PUBLIC_KEY: '***',
};

function generate(environment, server, env, port = 0, instances = 1) {
    return {
        name: `${environment}_${server}`,
        script: `${server}.bundle.js`,
        cwd: `${environment}/dist/server/${server}`,
        instances: instances,
        env: { ...environmentVariables, PORT: port, ...env },
        // Time in ms to wait before restarting a crashing app
        restart_delay: 10000,
        // Number of times a script is restarted when it exits in less than min_uptime
        max_restarts: 10,
        // Minimum uptime of the app to be considered started
        min_uptime: 7000
    }
}

module.exports = {
    apps: [
        generate('prod', 'web', {
            AMQP_URL: 'amqp://server_web:<PASSWORD>@localhost:5672',
            DATABASE_PASSWORD: '<PASSWORD>',
            DATABASE_URI: 'bolt://localhost:7687',
            DATABASE_USERNAME: 'server_web',
        }, 3010, 2),
        generate('prod', 'worker', {
            AMQP_URL: 'amqp://server_worker:<PASSWORD>@localhost:5672',
            DATABASE_PASSWORD: '<PASSWORD>',
            DATABASE_URI: 'bolt://localhost:7687',
            DATABASE_USERNAME: 'server_worker',
        }),
        generate('dev', 'web', {
            AMQP_URL: 'amqp://server_web:<PASSWORD>@localhost:5673',
            DATABASE_PASSWORD: '<PASSWORD>',
            DATABASE_URI: 'bolt://localhost:7688',
            DATABASE_USERNAME: 'server_web',
        }, 3020, 2),
        generate('dev', 'worker', {
            AMQP_URL: 'amqp://server_worker:<PASSWORD>@localhost:5673',
            DATABASE_PASSWORD: '<PASSWORD>',
            DATABASE_URI: 'bolt://localhost:7688',
            DATABASE_USERNAME: 'server_worker',
        }),
    ],
    deploy: {
        dev: {
            host: 'localhost',
            ref: 'origin/dev',
            repo: 'https://github.com/heroku/node-js-getting-started.git',
            path: 'var/www/nean.io/deploy/dev',
            'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js'
        },
        staging: {
            host: 'localhost',
            ref: 'origin/staging',
            repo: 'https://github.com/heroku/node-js-getting-started.git',
            path: 'var/www/nean.io/deploy/staging',
            'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js'
        }
    }
};
```

### Auto start at boot

1. Generate script to run
```sh
pm2 startup
```

2. Copy paste command to setup

3. Take snapshot of what processes should start on startup
```sh
pm2 save
```

4. Test
```sh
sudo systemctl status pm2-<USERNAME>
```

### Link/connect PM2 to web interface
```sh
pm2 link <key> <key> MACHINE_NAME
```

### Detect github commits
https://github.com/adnanh/webhook

### Automatic build and deploy if pushed to DEV

Source: https://medium.com/@riyadhalnur/managing-and-deploying-nodejs-apps-with-pm2-173fbc7d3f95

## Install Git

Source: https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-18-04

1. Install
```sh
sudo apt install git
```

2. Set global git configuration
```sh
git config --global user.name "Your Name"

git config --global user.email "youremail@domain.com"
```

## Setup Nginx with Let's Encrypt SSL (HTTPS certificate)

Source: https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04

1. Acquire an SSL cert
```sh
sudo apt-get install software-properties-common

sudo add-apt-repository ppa:certbot/certbot

sudo apt-get update

sudo apt-get install python-certbot-nginx

sudo certbot --nginx certonly
```

2. Automatic cron job will be created to renew certificates

3. Remember to set disable HTTP access to server in Google Cloud firewall settings

4. Remember to set Cloudflare > Crypto > SSL to "Full (strict)" 

## Setup Nginx with HTTP/2

Source: https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-with-http-2-support-on-ubuntu-18-04

Add http2 in NGINX conf after port numbers
```sh
listen 443 http2;
```

## Setup Neo4j & RabbitMQ with Docker containers (multiple instances)

### Install docker

Source: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04

1. Get package
```sh
sudo apt update

sudo apt install apt-transport-https ca-certificates curl software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"

sudo apt update
```

2. Install
```sh
sudo apt install docker-ce
```

3. Test
```sh
sudo systemctl status docker
```

4. Executing the Docker Command Without Sudo by adding the current user to the docker group
```sh
sudo usermod -aG docker ${USER}
```

5. Log out and back in for changes to take effect

### Docker compose

1. Create docker-compose.yml
```yml
version: '3'

services:
  neo4j.nean.io:
    container_name: neo4j.nean.io
    image: graphfoundation/ongdb-enterprise:3.4.9
    ports:
      - "7474:7474"             ## Browser
      - "7687:7687"             ## Bolt connection
    volumes:
      - $HOME/neo4j/nean.io/data:/data
      - $HOME/neo4j/nean.io/backup:/backup
      ## TODO - $HOME/neo4j/nean.io/logs:/logs
    environment:
      NEO4J_dbms_memory_heap_max__size: "512M"
      NEO4J_dbms_memory_pagecache_size: "512M"
      NEO4J_AUTH: "neo4j/<PASSWORD>"
    restart: unless-stopped

  neo4j.dev.nean.io:
    container_name: neo4j.dev.nean.io
    image: graphfoundation/ongdb-enterprise:3.4.9
    ports:
      - "7475:7474"             ## Browser
      - "7688:7687"             ## Bolt connection
    volumes:
      - $HOME/neo4j/dev.nean.io/data:/data
      - $HOME/neo4j/dev.nean.io/backup:/backup
      ## TODO - $HOME/neo4j/dev.nean.io/logs:/logs
    environment:
      NEO4J_dbms_memory_heap_max__size: "512M"
      NEO4J_dbms_memory_pagecache_size: "512M"
      NEO4J_AUTH: "neo4j/<PASSWORD>"
    restart: unless-stopped

  rabbitmq.nean.io:
      container_name: rabbitmq.nean.io
      image: rabbitmq:3.7-management
      hostname:  rabbitmq.nean.io
      environment:
        - RABBITMQ_DEFAULT_USER = guest
        - RABBITMQ_DEFAULT_PASS = guest
      ports:
        - "15672:15672"       ## Management Plugin
        - "5672:5672"         ## AMQP connection
      restart: unless-stopped

  rabbitmq.dev.nean.io:
      container_name: rabbitmq.dev.nean.io
      image: rabbitmq:3.7-management
      hostname:  rabbitmq.dev.nean.io
      environment:
        - RABBITMQ_DEFAULT_USER = guest
        - RABBITMQ_DEFAULT_PASS = guest
      ports:
        - "15673:15672"       ## Management Plugin
        - "5673:5672"         ## AMQP connection
      restart: unless-stopped

```

#### Breakdown:
* container_name: Unique name for the container
* image: docker hub image
* ports: first port is what docker exposes and second one is what it maps to in the container
    * 7474 for Neo4j Browser
    * 7474 for Neo4j HTTP connection
    * 7473 for Neo4j HTTPS connection
    * 7687 for Neo4j Bolt connection
    * 15672 for RabbitMQ Management Plugin
    * 5672 for RabbitMQ AMQP connection
* volumes: shared filesystems
* environment: spesify environment config
  * Neo4j: 512 MB is the default for both variables but should be increased in prod.
  * RabbitMQ: set username and password for user
* restart=on-failure: Restart only if the container exits with a non-zero exit status.

2. Run docker compose
```sh
docker-compose up -d
```

#### Breakdown:
* up: Download images from docker hub and create container instances
* -d: detached mode: Container starts up and run in background. Console is not attached to the container's process.

3. Create new users

    3.1 Neo4j
    * Go to localhost:7474 in your browser
    * Open "Database Information" sidebar > "Connected as" > "Admin" > ":server user add"
    * Username = "server_web", Roles = "Publisher"
    * Username = "server_worker", Roles = "Publisher"
    * Do the same for other db instance on localhost:7475

    3.2 RabbitMQ
    * Go to localhost:15672 in your browser
    * Change guest user password
    * Open "Admin" > Click on "guest" > "Update this user" > choose new password
    * Open "Admin" > "Add user"
    * Username = "server_web", Tags = None (empty)
    * Username = "server_worker", Tags = None (empty)
    * Click on both the web and worker name a then click "Set permission" which will set the default ".* .* .*" permissions to virtual host "/"
    * Do the same for other db instance on localhost:15673

### Setup periodic backups via cron

1) Create crontab for user
```sh
crontab -e
```

2) Set backup commands every 1 hour
```sh
0 * * * * docker exec neo4j.nean.io bin/neo4j-admin backup --from=localhost:6362 --backup-dir=/backup --name=graph.db-backup --fallback-to-full=true --check-consistency=true --pagecache=2G
```

3) Save file

4) Repeat for neo4j.dev.nean.io instance

5) Optionally send emails after cron job. https://cloud.google.com/compute/docs/tutorials/sending-mail/using-sendgrid

## Setup Neo4j without Docker (single instance)

1. Install Java
```sh
sudo apt install openjdk-8-jre
```

2. Signing Key
```sh
wget -O - https://debian.neo4j.org/neotechnology.gpg.key | sudo apt-key add -
```

3. Source List File
```sh
echo 'deb https://debian.neo4j.org/repo stable/' | sudo tee -a /etc/apt/sources.list.d/neo4j.list
```

4. Install Neo4j
```sh
sudo apt update

sudo apt-get install neo4j=1:3.4.9
```

5. Test
```sh
sudo service neo4j status
```

6. Start automatically on boot
```sh
sudo systemctl enable neo4j
```

Navigate to localhost:7474 in your browser

### Set different user

1. Enter cypher shell
```sh
/usr/bin/cypher-shell -u neo4j -p neo4j
```

2. Create user and disable password set on first login
```sh
CALL dbms.security.createUser('nean_dev', 'nean_dev', false)
```

## Setup RabbitMQ without Docker (single instance)

1. Signing Key
```sh
wget -O - "https://github.com/rabbitmq/signing-keys/releases/download/2.0/rabbitmq-release-signing-key.asc" | sudo apt-key add -
```

2. Source List File (debian bionic main + erlang)
```sh
echo "deb https://dl.bintray.com/rabbitmq/debian bionic main erlang" | sudo tee /etc/apt/sources.list.d/bintray.rabbitmq.list
```

3. Install packages
```sh
sudo apt update

sudo apt install rabbitmq-server
```

4. Test
```sh
sudo service rabbitmq-server status
```

5. Install management plugin
```sh
sudo rabbitmq-plugins enable rabbitmq_management
```

5. Test

Navigate to localhost:15672 in your browser

## Setup Reddis

## Logs retention
* .pm2 folder in $HOME for pm2 logs
* web + worker logs in dist > server
* neo4j logs
* rabbitmq logs
* nginx logs
  * /var/log/nginx/access.log
  * /var/log/nginx/error.log
* vnc logs (.vnc/HOSTNAME:1.log)
* docker logs (/var/lib/docker/containers/<CONTAINER_ID>/<CONTAINER_ID>-json.log)

## Copy file to VM
```sh
gcloud compute scp --recurse <FROM_DIR> <USERNAME>@<VM_INSTANCE_NAME>:/var/www/nean.io/
```

#### Breakdown:
* gcloud: Google Cloud SDK
* compute: Google's term for their VM offering
* scp: secure copy paste
* --recurse: recursively copy directory and all inner file/folders
* <FROM_DIR>: C:\Users\...
* <USERNAME>: Linux username
* <VM_INSTANCE_NAME>: VM instance name

## Top things to check

Source: https://hashnode.com/post/10-things-you-shouldnt-do-while-running-nodejs-in-production-cisab2fyu0s9oth5341faywcw



# Setup Cordova
### Source: https://medium.com/@nacojohn/convert-your-angular-project-to-mobile-app-using-cordova-f0384a7711a6

## Install

1. Install Node + NPM

2. Install Cordova CLI globally
```sh
npm install -g cordova
```

3. Install packages
```sh
cordova create src/client-mobile com.example.hello client-mobile
```

#### Breakdown:
* cordova: cli name
* create: create new app
* path + folder name: optional path with folder it should be created in
* com.example.hello: Reverse domain-style identifier that maps to id attribute of widget element in config.xml
* client-mobile: the application name

5. Go to client-mobile folder
```sh
cd src/client-mobile
```

4. Add platform
```sh
cordova platform add android

cordova platform add ios
```

#### Breakdown:
* platform: add native platforms you want to compile into
* android: name of platfrom. Can be either android, ios or blackberry 

5. Merge package.json and delete then delete package.json, package-lock.json and node_modules within client-mobile

6. Add platforms, plugins and www folder to .gitignore
```sh
# Cordova
src/client-mobile/platforms
src/client-mobile/plugins
src/client-mobile/www
```

7. NPM install
```sh
npm install
```

8. Create index.mobile.html file
9. Add another build configuration in angular.json
   * Replace index.html with index.mobile.html
   * "serviceWorker": false
   * "baseHref": "./"
   * "outputPath": "src/client-mobile/www"

10. Install pre-requisites for building
    * Android: https://cordova.apache.org/docs/en/8.x/guide/platforms/android/index.html#requirements-and-support
        * Java Development Kit (JDK)
        * Gradle
        * Android Studio (with SDK)
    * IOS: https://cordova.apache.org/docs/en/8.x/guide/platforms/ios/index.html#requirements-and-support

11. Build
```sh
cd src/client-mobile && cordova build android && cd ../..
```