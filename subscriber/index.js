const mqtt = require('mqtt');
const { createClient } = require('redis');

const MQTT_BROKER = 'mqtt://emqx:1883';
const REDIS_HOST = 'redis://redis:6379';
const MQTT_TOPIC = 'device/status';

(async () => {
  const redisClient = createClient({ url: REDIS_HOST });
  await redisClient.connect();
  console.log("Connected to Redis");

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
    await redisClient.set(`device:${topic}`, message.toString());
  });

  mqttClient.on('error', (err) => {
    console.error('MQTT Error:', err);
  });

  process.on('SIGINT', async () => {
    await redisClient.quit();
    mqttClient.end();
    process.exit();
  });
})();
