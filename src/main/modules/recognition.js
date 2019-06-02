const socketIoClient = require('socket.io-client');
const axios = require('axios');
const spawn = require('child_process').spawn;
const { ipcMain } = require('electron');

const recognition = (mainWindow, argv) => {
  let users, sensorReady = false, socketReady = false;

  const emitReady = () => {
    if (sensorReady && socketReady) mainWindow.webContents.send('ready');
  };
  const emitError = () => mainWindow.webContents.send('error');
  const emitUnknown = () => mainWindow.webContents.send('unknown');
  const emitMatch = (person) => {
    mainWindow.webContents.send('match', person);
    socket.emit('newPresence', {
      email: person.email,
      department: person.department
    });
  };

  ipcMain.on('guiReady', emitReady);

  const socketConnect = () => {
    socketReady = true;
    emitReady();
  };
  const socketDisconnect = () => {
    socketReady = false;
    emitError();
  };
  const socket = socketIoClient(`${argv.api_host}/raspberry`, {
    path: `${argv.api_path != '/' ? argv.api_path : ''}/api/socket.io`,
    query: { raspberryPwd: argv.raspberry_pwd }
  });
  socket.on('connect', socketConnect);
  socket.on('disconnect', socketDisconnect);

  const fingerprintReady = () => {
    sensorReady = true;
    emitReady();
  };
  const fingerprintError = () => {
    sensorReady = false;
    emitError();
  };
  const fingerprintMatch = (id) => {
    const person = users.find(user => user.fingerprintIds.includes(parseInt(id)));
    if (socketReady) emitMatch(person);
  };

  const connectSensor = () => {
    const fingerprint = spawn('python3', ['-u', `${__dirname}/sensor/recognition.py`, argv.sensor_id]);
    fingerprint.stdout.on('data', (data) => {
      let msg = data.toString().replace(/\n/g, "");

      if (msg == 'ready') fingerprintReady();
      else if (msg == 'error') fingerprintError();
      else if (msg == 'unknown') emitUnknown();
      else fingerprintMatch(msg);
    });
  };

  const retryToFetchUsers = () => setTimeout(fetchUsers, 5000);
  const fetchUsers = () => axios({
    method: 'post',
    url: `${argv.api_path != '/' ? argv.api_path : ''}/api/raspberry/fetch`,
    baseURL: argv.api_host,
    data: {
      password: argv.raspberry_pwd
    }
  }).then(res => res.data)
  .then(res => users = res.data)
  .then(connectSensor)
  .catch(err => { retryToFetchUsers(); });

  fetchUsers();
};

module.exports = { init: recognition };
