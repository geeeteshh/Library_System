#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// Define RFID module pins for ESP8266
constexpr uint8_t RST_PIN = D3;  // GPIO4 (D2)
constexpr uint8_t SS_PIN = D4;   // GPIO5 (D1)

MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance
MFRC522::MIFARE_Key key;      

int blockNum = 2;
byte bufferLen = 18;
byte readBlockData[18];

MFRC522::StatusCode status;

// WiFi credentials
const char* ssid = "Realme C3";
const char* pass = "12november";
const char* serverURL = "http://192.168.163.19:5000/api/rfid";

void setup() 
{
  Serial.begin(115200);
  WiFi.begin(ssid, pass);

  SPI.begin();
  mfrc522.PCD_Init();
  Serial.println("Scan a MIFARE 1K Tag to read data...");

  // Connect to WiFi with a timeout
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected to WiFi");
  } else {
    Serial.println("\nFailed to connect to WiFi");
  }

  sendRFID(readBlockData, 18);
}

void loop()
{
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }
  
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }
  
  Serial.println("**Card Detected**");
  Serial.print(F("Card UID: "));

  String rfidString = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
    
    // Convert UID to a string
    if (mfrc522.uid.uidByte[i] < 0x10) {
      rfidString += "0"; // Leading zero for consistency
    }
    rfidString += String(mfrc522.uid.uidByte[i], HEX);
  }
  Serial.println();
  
  Serial.print(F("PICC type: "));
  Serial.println(mfrc522.PICC_GetTypeName(mfrc522.PICC_GetType(mfrc522.uid.sak)));
         
  Serial.println("Reading from Data Block...");
  ReadDataFromBlock(blockNum, readBlockData);
  
  Serial.print("\nData in Block ");
  Serial.print(blockNum);
  Serial.print(": ");
  for (int j = 0; j < 18; j++)
  {
    Serial.write(readBlockData[j]);
  }
  Serial.println();

  sendRFID(readBlockData, 18);
}

void ReadDataFromBlock(int blockNum, byte readBlockData[]) 
{
  for (byte i = 0; i < 6; i++)
  {
    key.keyByte[i] = 0xFF;
  }

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, blockNum, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK)
  {
    Serial.print("Authentication failed for Read: ");
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  Serial.println("Authentication success");

  status = mfrc522.MIFARE_Read(blockNum, readBlockData, &bufferLen);
  if (status != MFRC522::STATUS_OK)
  {
    Serial.print("Reading failed: ");
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  Serial.println("Block read successfully");
}

void sendRFID(byte *rfid, int length) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;  // Create WiFi client instance
    HTTPClient http;
    http.begin(client, serverURL);
    http.addHeader("Content-Type", "application/json");

    // Convert byte array to hex string
    String rfidString = "";
    for (int i = 0; i < length; i++) {
      if (rfid[i] < 0x10) {
        rfidString += "0"; // Add leading zero for single digit
      }
      rfidString += String(rfid[i], HEX);
    }

    String payload = "{\"rfid\":\"" + rfidString + "\"}";
    int httpResponseCode = http.POST(payload);

    Serial.print("Response Code: ");
    Serial.println(httpResponseCode);
    String response = http.getString();
    http.end();
    Serial.print("Server Response: ");
    Serial.println(response);
  } else {
    Serial.println("WiFi not connected, cannot send data.");
  }
}