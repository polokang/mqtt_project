const mqtt = require('mqtt');

const MQTT_BROKER = 'mqtt://127.0.0.1:1883';
const MQTT_TOPIC = 'device/status';

(async () => {
  const mqttClient = mqtt.connect(MQTT_BROKER);

  mqttClient.on('connect', () => {
    console.log('Connected to MQTT Broker');
    mqttClient.subscribe(MQTT_TOPIC, (err) => {
      if (!err) {
        console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
      } else {
        console.error('Subscription error:', err);
      }
    });
  });

  mqttClient.on('message', async (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
  });

  mqttClient.on('error', (err) => {
    console.error('MQTT Error:', err);
  });

  process.on('SIGINT', async () => {
    mqttClient.end();
    process.exit();
  });
})();
