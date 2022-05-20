import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendSMSAPI } from "../redux/actions";
import "./stylesheets/sendSMS.css";

function SendSMS() {

  const [selectedRecepientId, setSelectedRecepientId] = useState("");
  const [message, setMessage] = useState("");
  const recepientData = useSelector((state) => state.data.recepientData);
  const [receiver, setReceiver] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSelect = (e) => {
    console.log(e.target.value);
    setSelectedRecepientId(e.target.value);
    setReceiver(
      recepientData.filter((recepient) => {
        return recepient.recepientId === e.target.value;
      })[0]
    );
  };

  const sendSMS = () => {
    console.log(
      "This will handle sending SMS /n also it will make a call to sendSMSAPI."
    );
    console.log(receiver);
    if (receiver.recepientPhone && receiver.recepientPhone.length === 10) {
      const details = {
        receiver,
        message: message,
      };
      console.log(details);

      axios
        .post("/sendsms", {
          to: details.receiver.recepientPhone,
          message: details.message,
        })
        .then((message) => {
          console.log(`message sent : ${message}`);
          navigate(-1);
        })
        .catch((e) => console.log("message sent failed"));
    } else {
      alert(
        "Either the phone number is invalid or not provided for this recepient"
      );
      console.log(
        "Either the phone number is invalid or not provided for this recepient"
      );
    }
  
  };

  useEffect(() => {
    if (!localStorage.getItem("userId")) navigate("/");
  }, [])
  

  return (
    <div id="SendSMS__container">
      <h1>Send a Short Message (SMS)</h1>
      <div id="inputForm">
        <label htmlFor="Message">
          Message
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>

        <select
          name="recepientsList"
          id="recepientsList"
          value={selectedRecepientId}
          onChange={(e) => handleSelect(e)}
        >
          {recepientData.map((recepient) => (
            <option value={recepient.recepientId} key={recepient.recepientId}>
              {recepient.recepientName}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" onClick={() => sendSMS()}>
        Submit
      </button>
      
      {/* <button type="submit" onClick={() => sendSMS()}>
        Submit
      </button> */}
    </div>
  );
}

export default SendSMS;

// twilio
// $url = "https://api.twilio.com/2010-04-01/Accounts/ACf2660b472188c2117b94b10fc3b45f78/Messages.json"
// $params = @{ To = "+919621421976"; From = "+15076462167"; Body = "Hello from Twilio" }
// $secret = "48686219c5493c8ecca6f50351f12365" | ConvertTo-SecureString -asPlainText -Force
// $credential = New-Object System.Management.Automation.PSCredential(ACf2660b472188c2117b94b10fc3b45f78, $secret)
// Invoke-WebRequest $url -Method Post -Credential $credential -Body $params -UseBasicParsing | ConvertFrom-Json | Select sid, body
