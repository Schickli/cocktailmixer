#include <PubSubClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>

const char* ssid = "cla";
const char* password = "claemmaflavia";
const char* mqttServer = "192.168.1.169";
const int mqttPort = 1883;
const char* mqttUser = "esp32";
const char* mqttPassword = "cocktail";
const char* orderTopic = "order";
const char* statusTopic = "status";

WiFiClient espClient;
PubSubClient client(espClient);

const int numSensors = 3;
const int sensorInfo[][2] = {
  { 18, 1 },  // {pin, position}
  { 17, 2 },
  { 16, 3 }
};

void setup() {
  Serial.begin(115200);

  // Initialisiere die Positionssensoren
  for (int i = 0; i < numSensors; ++i) {
    pinMode(sensorInfo[i][0], INPUT_PULLUP);
  }

  // Verbinde mit dem WLAN
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  // Verbinde mit dem MQTT-Broker
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
      Serial.println("connected");
      client.subscribe(orderTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}

int getCurrentPosition() {
  for (int i = 0; i < numSensors; ++i) {
    if (digitalRead(sensorInfo[i][0]) == LOW) {
      return sensorInfo[i][1];
    }
  }
  return 99;  // Reset to unknown if neither pos1 nor pos2 is LOW
}

void reconnect() {
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection...");
    if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
      Serial.println("connected");
      client.subscribe(orderTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void sendStatusMessage(const char* message) {
  client.publish(statusTopic, message);
}

void handleOrder(const char* message) {
  bool timeoutReached = false;
  Serial.println("Received order to start.");

  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, message);
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return;
  }

  if (!doc.is<JsonArray>()) {
    Serial.println("Invalid JSON message: Not an array");
    return;
  }

  JsonArray orders = doc.as<JsonArray>();
  for (JsonVariant order : orders) {
    if (!order.containsKey("position")) {
      Serial.println("Invalid order: Missing position");
      continue;
    }

    if (!order.containsKey("amount")) {
      Serial.println("Invalid order: Missing amount");
      continue;
    }

    int targetPos = order["position"];
    int direction = getDirection(targetPos, getCurrentPosition());
    // TODO: move in this direction
    unsigned long startTime = millis();
    const unsigned long TIMEOUT_DURATION = 5000;

    while (getCurrentPosition() != targetPos) {
      delay(100);

      if (millis() - startTime >= TIMEOUT_DURATION) {
        Serial.println("Timeout reached while waiting for position.");
        timeoutReached = true;
        break;
      }
    }

    // TODO: stop moving

    if (timeoutReached) {
      sendStatusMessage("timeout");
      return;
    }

    Serial.println(targetPos);
    pourShots(order["position"]);

    delay(1000);  // Fake processing for now
  }

  sendStatusMessage("finished");
}

void pourShots(int amount) {
  // TODO Move motor up
  Serial.println("Pouring shot");
  delay(500);
  Serial.println("Finished shot");
}

void callback(char* topic, byte* payload, unsigned int length) {
  payload[length] = '\0';
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  Serial.println((char*)payload);

  if (strcmp(topic, orderTopic) == 0) {
    handleOrder((char*)payload);
  }
}

int getDirection(const int des, const int src) {
  if (des > src) {
    return 0;
  } else {
    return 1;
  }
}