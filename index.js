const mqtt = require('mqtt');
const TuyAPI = require('tuyapi');

const configurations = require('./configurations.json');

const device = new TuyAPI(configurations.device);
const mqttClient = mqtt.connect(configurations.mqtt);

if ('ip' in configurations.device) {
  device.find().then(() => device.connect());
} else {
  device.connect();
}

device.on('connected', () => console.info('Connected to device!'));
device.on('disconnected', () => console.info('Disconnected from device.'));
device.on('error', (error) => console.error('Error!', error));
device.on('data', (data) => console.debug('Data from device:', data));

function onExitHandled() {
  device.disconnect();
  mqttClient.end();
}

const exitEvents = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException'];
exitEvents.forEach((exitEvent) => process.on(exitEvent, onExitHandled));
