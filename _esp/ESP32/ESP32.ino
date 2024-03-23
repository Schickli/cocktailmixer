#include <PubSubClient.h>
#include <WiFi.h>

const char* ssid = "cla";
const char* password = "claemmaflavia";
const char* mqttServer = "192.168.1.169";
const int mqttPort = 1883;
const char* mqttUser = "esp32";
const char* mqttPassword = "cocktail";
const char* mqttTopic = "test";

WiFiClient espClient;
PubSubClient client(espClient);

// 15, 4, 16, 17, 5, 18
int pin = 18;
int previousState = HIGH;

void setup() {
  Serial.begin(115200);
  pinMode(pin, INPUT_PULLUP);

  // Verbindung zum WLAN herstellen
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  // Verbindung zum MQTT-Broker herstellen
  client.setServer(mqttServer, mqttPort);
  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void loop() {
  int currentState = digitalRead(pin);
  
  if (currentState != previousState) {
    if (currentState == HIGH) {
      Serial.println("High");
      sendMQTTMessage("High");
    } else {
      Serial.println("Low");
      sendMQTTMessage("Low");
    }
    previousState = currentState;
  }
  
  client.loop();
}

void sendMQTTMessage(const char* message) {
  if (client.connected()) {
    client.publish(mqttTopic, message);
  } else {
    Serial.println("MQTT Disconnected");
  }
}

