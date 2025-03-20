Required after opening this folder in terminal, do install:

npm init -y
npm install express cors


while dealing with this folder add this below code accordingly for receiving rfid either by serial cable or http req.

You can refer this file code for handling the incoming data 

```javascript
import React, {useEffect, useState} from "react";
import { useSearchParams } from "react-router-dom";


const CheckIn = () => {

  const [rfid, setrfid] = useState('');
  const [searchparams] = useSearchParams();



  useEffect(() => {
    const rfidval = searchparams.get("rfid");
    if (rfidval){
      setrfid(rfidval);
    }
    const receiveRFID = async () => {
      const response = await fetch("/rfid");
      const data = await response.json();
      if (data.rfid) setrfid(data.rfid);
    };
    receiveRFID();
  }, [searchparams, rfid]);

  //via serially

  const connectSerial = async () => {
    try {
      const port = await navigator.serial.requestPort(); // Request user to select serial port
      await port.open({ baudRate: 115200 });

      const reader = port.readable.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const decoded = new TextDecoder().decode(value);
        setrfid((prev) => prev + decoded); // Update RFID in input
      }

      reader.releaseLock();
      await port.close();
    } catch (error) {
      console.error("Error connecting to serial port:", error);
    }
  };

  //via http

  const fetchRFID = async () => {
    try {
      const response = await fetch("http://192.168.163.19:5000/api/rfid");
      const data = await response.json();
      setrfid(data.rfid);
    } catch (error) {
      console.error("Error fetching RFID:", error);
    }
  };

  useEffect(() => {
    // Poll every 2 seconds
    const interval = setInterval(fetchRFID, 2000);
    return () => clearInterval(interval);
  }, []);



  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-black">Check In</h2>
      <p className="text-gray-800">This is the Check-In page. Use this section to check in returned books.</p>


      <button
        onClick={fetchRFID}
        className="p-2 mb-4 bg-blue-500 text-white rounded-lg"
      >
        Connect RFID Reader
      </button>

      <div className="mb-4">
        <label htmlFor="rfid" className="text-lg font-semibold text-black">Enter RFID:</label>
        <input
          id="rfid"
          type="text"
          value={rfid}
          onChange={(e) => setrfid(e.target.value)}
          className="border p-2 mt-2 block w-full rounded-lg text-black bg-white"
          placeholder="Scan or enter RFID here"
        />
      </div>

      <p className= "text-black">Scanned RFID: {rfid || "No RFID scanned yet."}</p>
    </div>
  );
};

export default CheckIn;
