import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addReminderAPI } from "../redux/actions";
import "./stylesheets/addReminder.css";
import { v4 } from "uuid";

function AddReminder() {
  const recepientData = useSelector((state) => state.data.recepientData);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // state variavbles
  const [selectedRecepientId, setSelectedRecepientId] = useState("Select");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleSelect = (e) => {
    setSelectedRecepientId(e.target.value);
  };

  const AddReminder = () => {
    let thisRecepient = recepientData.filter((recepient) => {
      return recepient.recepientId === selectedRecepientId;
    })[0];
    const reminderDetails = {
      description,
      date,
      recepientId: selectedRecepientId,
      recepientName: thisRecepient.recepientName,
      to: thisRecepient.recepientPhone,
      userId: user.userData.userId,
    };
    // use below code for testing (avoid sms charges)
    reminderDetails["sid"] = v4();
    addReminderAPI(reminderDetails, dispatch);
    navigate(-1);

    // code for scheduling sms
    // scheduleSms(reminderDetails);
  };

  const scheduleSms = (reminderDetails) => {
    const when2send = new Date(
      new Date().getTime() + (new Date(date) - new Date())
    ).toISOString();

    axios
      .post("/schedulesms", {
        to: reminderDetails.to,
        message: reminderDetails.description,
        when2send,
      })
      .then((data) => {
        reminderDetails["sid"] = data.sid;
        addReminderAPI(reminderDetails, dispatch);
        navigate(-1);
      })
      .catch((e) => {
        alert("Failed");
        console.log(e);
      });
  };

  useEffect(() => {
    if (!localStorage.getItem("userId")) navigate("/");
  }, []);

  return (
    <div className="AddReminder__container">
      <h1>Add a new Reminder</h1>
      <input
        type="text"
        placeholder="description of the reminder"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        placeholder="date for the reminder"
        value={date}
        onChange={(e) => {
          console.log(e.target.value);
          setDate(e.target.value);
        }}
      />

      <select
        name="recepientsList"
        id="recepientsList"
        value={selectedRecepientId}
        onChange={(e) => handleSelect(e)}
      >
        <option key="default" value="default">
          Select Recepient
        </option>
        {recepientData.map((recepient) => (
          <option value={recepient.recepientId} key={recepient.recepientId}>
            {recepient.recepientName}
          </option>
        ))}
      </select>

      <button
        onClick={() => AddReminder()}
        disabled={
          new Date(date) > new Date() ? (description ? false : true) : true
        }
      >
        Add
      </button>
    </div>
  );
}

export default AddReminder;
