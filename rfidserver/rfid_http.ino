#include <SPI.h>
#include <MFRC522.h>
#include<WiFi.h>
#include<HTTPClient.h>

constexpr uint8_t RST_PIN = T3;  // Configurable, see typical pin layout above
constexpr uint8_t SS_PIN = T4;   // Configurable, see typical pin layout above

MFRC522 mfrc522(SS_PIN, RST_PIN); // Instance of the class
MFRC522::MIFARE_Key key;      

int blockNum = 2;

byte bufferLen = 18;
byte readBlockData[18];

MFRC522::StatusCode status;

const char* ssid = "Realme C3";
const char* pass = "12november";
const char* serverURL = "http://192.168.163.19:5000/api/rfid";

void setup() 
{
  Serial.begin(9600);

  WiFi.begin(ssid, pass);
  SPI.begin();
  mfrc522.PCD_Init();
  Serial.println("Scan a MIFARE 1K Tag to read data...");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println("Connected");

  sendRFID(readBlockData, 18);
}

void loop()
{
  if (!mfrc522.PICC_IsNewCardPresent())
  {
    return;
  }
  
  if (!mfrc522.PICC_ReadCardSerial()) 
  {
    return;
  }
  
  Serial.println("**Card Detected**");
  Serial.print(F("Card UID:"));
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
  }
  Serial.print("\n");
  
  Serial.print(F("PICC type: "));
  MFRC522::PICC_Type piccType = mfrc522.PICC_GetType(mfrc522.uid.sak);
  Serial.println(mfrc522.PICC_GetTypeName(piccType));
         
  Serial.println("Reading from Data Block...");
  ReadDataFromBlock(blockNum, readBlockData);
  
  Serial.print("\n");
  Serial.print("Data in Block:");
  Serial.print(blockNum);
  Serial.print(" --> ");
  for (int j = 0; j < 30; j++)
  {
    Serial.write(readBlockData[j]);
  }
  Serial.print("\n");
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
  else
  {
    Serial.println("Authentication success");
  }

  status = mfrc522.MIFARE_Read(blockNum, readBlockData, &bufferLen);
  if (status != MFRC522::STATUS_OK)
  {
    Serial.print("Reading failed: ");
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }
  else
  {
    Serial.println("Block was read successfully");  
  }
}

void sendRFID(byte *rfid, int length) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
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
    http.end();
  }
}
