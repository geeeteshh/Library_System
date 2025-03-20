#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

constexpr uint8_t RST_PIN = D3;  // Reset pin for ESP8266
constexpr uint8_t SS_PIN = D4;   // Slave select pin

MFRC522 mfrc522(SS_PIN, RST_PIN); // Instance of the class
MFRC522::MIFARE_Key key;      

int blockNum = 2;
byte bufferLen = 18;
byte readBlockData[18];
MFRC522::StatusCode status;

const char* ssid = "Realme C3";
const char* pass = "12november";
const char* serverURL = "http://192.168.163.19:5000/api/rfid";

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, pass);
  SPI.begin();
  mfrc522.PCD_Init();
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void loop() {
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // Print only RFID when a card is scanned
  String rfidString = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) {
      rfidString += "0"; // Add leading zero
    }
    rfidString += String(mfrc522.uid.uidByte[i], HEX);
  }
  
  Serial.println(rfidString);

  // Read data from block and send to server
  ReadDataFromBlock(blockNum, readBlockData);
  sendRFID(readBlockData, 18);
  delay(5000);
}

void ReadDataFromBlock(int blockNum, byte readBlockData[]) {
  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, blockNum, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    return;
  }

  status = mfrc522.MIFARE_Read(blockNum, readBlockData, &bufferLen);
}

void sendRFID(byte *rfid, int length) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient client;
    http.begin(client, serverURL);
    http.addHeader("Content-Type", "application/json");

    String rfidString = "";
    for (int i = 0; i < length; i++) {
      if (rfid[i] < 0x10) {
        rfidString += "0";
      }
      rfidString += String(rfid[i], HEX);
    }

    String payload = "{\"rfid\":\"" + rfidString + "\"}";
    http.POST(payload);
    http.end();
  }
}
