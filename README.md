<p align="center">
  <img src="https://s3.gifyu.com/images/revregistration-transparent.png" height="200" alt="RevRegistration">
  <br><br><span>Registration of presence using fingerprints.</span>
</p>

## Table Of Contents
- [Hardware](#hardware)
- [Installation](#installation)
  - [XServer](#xserver)
  - [LCD screen](#lcd-screen)
  - [Fingerprint sensor](#fingerprint-sensor)
  - [RevRegistration](#revregistration)
- [Configuration](#configuration)
- [Server api](#server-api)

## Hardware
![](https://media.giphy.com/media/hvMZRz05ugyAeQybld/giphy.gif)
#### Components that you need to create a device:
- Raspberry Pi 3 B+
- Fingerprint sensor
- USB - UART converter
- 3.5 inch TFT LCD display

## Installation
First you need to [install Raspbian Lite](https://www.raspberrypi.org/documentation/installation/installing-images/) and update it.
### XServer
Then set up your Raspberry Pi as a Kiosk. [This](https://www.youtube.com/watch?v=I2laR5G5FFo) video explains how to do it exactly and below are the commands:
##### Install [xserver](https://en.wikipedia.org/wiki/X.Org_Server) so that Raspbian can display graphical interface:
```
~$ sudo apt install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox
```
##### Run xserver at system startup - add to the file: **/home/pi/.profile**
```
[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx -- -nocursor
```
##### Add the following lines to the **/etc/xdg/openbox/autostart** file to disable the screensaver.

```
xset s off
xset s noblank
xset -dpms
```
### LCD screen
For the screen we advise you to use the [LCD-show](https://github.com/goodtft/LCD-show) driver developed by goodtft. For more details visit the github repo. For the 3.5" display the commands are as follows:
```
~$ git clone https://github.com/goodtft/LCD-show.git
~$ chmod -R 755 LCD-show
~$ cd LCD-show/
~$ sudo ./LCD35-show
```
##### To make the xserver work on the display you need to install the following driver:
```
~$ sudo apt install xserver-xorg-video-fbturbo
```
And change it's config file: **/usr/share/X11/xorg.conf.d/99-fbturbo.conf** by setting the **fbdev** option to **/dev/fb1** (second frame buffer - your TFT display).
```
Option          "fbdev" "/dev/fb1"
```
By default it is set to **/dev/fb0** (first frame buffer - HDMI).
### Fingerprint sensor
To operate the fingerprint sensor RevRegistration uses the Python library called [pyfingerprint](https://github.com/bastianraschke/pyfingerprint) developed by Bastian Raschke. Check it out for more details on how to set it up. Also make sure to install the Python 3 version. Here are the commands:
```
~$ sudo apt-get install git devscripts equivs
~$ git clone https://github.com/bastianraschke/pyfingerprint.git
~$ cd ./pyfingerprint/src/
~$ sudo mk-build-deps -i debian/control
~$ dpkg-buildpackage -uc -us
```
```
~$ sudo dpkg -i ../python3-fingerprint*.deb
~$ sudo apt-get -f install
```
```
~$ sudo usermod -a -G dialout pi
~$ sudo reboot
```
For now, if you want to enroll a new finger you have to do it manually by running the **example_enroll.py** script.
### RevRegistration
Now you are ready to install the RevRegistration app. First you have to build it using node.js and yarn (we recommend doing this on your desktop). You can download node.js with npm [here](https://nodejs.org/en/download/) and optionally yarn [here](https://yarnpkg.com/en/docs/getting-started).
##### Clone the repository:
```
~$ git clone https://github.com/fpdrozd/revregistration-raspberry.git
```
##### Install dependencies
```
~$ cd revregistration
~$ yarn
```
##### Build the package
```
~$ yarn make
```
This might take a few minutes.

##### When it's done you need to copy the Debian package to your Raspberry Pi:
```
~$ scp out/make/revregistration*.deb pi@192.168.0.100:/home/pi/
```

##### Then install the package:
```
~$ sudo dpkg -i revregistration*.deb
```
##### Install missing dependencies:
```
~$ sudo apt -f install
```
And the installation is completed.

## Configuration
The application is accessible in the system by the following command:

```
~$ revregistration
```
You need to add it to the **/etc/xdg/openbox/autostart** file with the proper parameters. For example:
```
revregistration --lang en --api_host https://example.com --api_path /registration --raspberry_pwd !@#$%^& --sensor_id UNIQUE-USB-DEVICE-ID
```
#### Here is a description of all parameters:
<table>
<thead>
  <tr>
    <th align="left" colspan="2">Option</th>
    <th align="left">Default</th>
    <th align="left">Description</th>
  </tr>
</thead>
<tr>
  <td colspan="2"><code>lang</code></td>
  <td><code>en</code></td>
  <td>Interface language. Possible values are: <code>en</code>, <code>pl</code></td>
</tr>
<tr>
  <td colspan="2"><code>api_host</code></td>
  <td><code>none</code></td>
  <td>The hostname of your api.</td>
</tr>
<tr>
  <td colspan="2"><code>api_path</code></td>
  <td><code>none</code></td>
  <td>A path to your api.</td>
</tr>
<tr>
  <td colspan="2"><code>raspberry_pwd</code></td>
  <td><code>none</code></td>
  <td>A password that will be used to authenticate your Raspberry Pi against the server.</td>
</tr>
<tr>
  <td colspan="2"><code>sensor_id</code></td>
  <td><code>none</code></td>
  <td>A unique id of your uart converter that can be fined under the <b>/dev/serial/by-id/</b> directory.</td>
</tr>
</table>

## Server api
For the system to work correctly you need a server with some kind of database that will store and manage all the presences. Lets suppose that your server is running under the **<span>https://</span>example.com/registration**.
### Requests
When the application starts up it's first trying to fetch all the users by requesting the **<span>https://</span>example.com/registration/api/raspberry/fetch**. In response it expects a JSON data in the following form:
```
{
  data: [
    { email: 'peter@gmail.com', firstName: 'Peter', lastName: 'Griffin', department: 'sales', fingerprintIds: [0, 1] },
    { email: 'brian@gmail.com', firstName: 'Brian', lastName: 'Griffin', department: 'accounting', fingerprintIds: [2, 3] }
    ...
  ]
}
```
### Socket.io
Then it's trying to connect to the Socket.io server under the **<span>https://</span>example.com/registration/api/socket.io**.
#### Here is the comprehensive list of all the Socket.io events:

<table>
<thead>
  <tr>
    <th align="left" colspan="2">Event name</th>
    <th align="left">Description</th>
  </tr>
</thead>
<tr>
  <td colspan="2"><code>newPresence</code></td>
  <td>It's triggered when the person places a finger and the fingerprint is recognized. It comes with the JSON object in the following form: <code>{ email: 'peter@gmail.com', department: 'sales' }</code></td>
</tr>
</table>

### This is how a Node.js api might look like:
```javascript
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

// Express and Socket.io setup
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handle a post request to fetch users
app.post('/raspberry/fetch', (req, res) => {
  const pwd = req.body.password;

  if (pwd && pwd == process.env.RASPBERRY_PWD) {
    // Query to the database here

    const queryResult = [
      { email: 'peter@gmail.com', firstName: 'Peter', lastName: 'Griffin', department: 'sales', fingerprintIds: [0, 1] },
      { email: 'brian@gmail.com', firstName: 'Brian', lastName: 'Griffin', department: 'accounting', fingerprintIds: [2, 3] }
    ];
    // Send a list of users in JSON
    res.json({ data: queryResult });
  }
});

// Set up "raspberry" namespace
const raspberry = io.of('/raspberry');

// Namespace authentication middleware
raspberry.use((socket, next) => {
  const query = socket.handshake.query;

  const verifyRaspberry = () => {
    if (query.raspberryPwd == process.env.RASPBERRY_PWD) next();
    else next(new Error('Unauthorized'));
  };

  if (query.raspberryPwd && typeof query.raspberryPwd == 'string') verifyRaspberry();
  else next(new Error('Bad Request'));
});

// Handle new connections
raspberry.on('connection', (socket) => {
  // Handle "newPresence" event
  socket.on('newPresence', (person) => {
    // Save to the database here
  });
});

server.listen(3000);
```
#### And here is the Nginx configuration:
```nginx
server {
  listen 80;
  server_name 127.0.0.1;

  location /registration/api/ {
    proxy_pass http://127.0.0.1:3000/;
  }
  location /registration/api/socket.io/ {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    proxy_pass http://127.0.0.1:3000/socket.io/;
  }
}
```
