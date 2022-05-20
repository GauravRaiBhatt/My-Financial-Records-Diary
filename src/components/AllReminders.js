import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./stylesheets/allReminders.css";
import ReminderTile from "./ReminderTile";
import { useSelector } from "react-redux";

function AllReminders() {
  const data = useSelector((state) => state.data);

  // const [selectedAction, setSelectedAction] = useState("Today's Reminders");
  const [selectedAction, setSelectedAction] = useState("All Reminders");
  const [todaysReminders, setTodaysReminders] = useState([]);
  const [allReminders, setAllReminders] = useState([]);
  const navigate = useNavigate();

  const handleSelect = (e) => {
    setSelectedAction(e.target.value);
    console.log(e.target.value);
  };

  useEffect(() => {
    if (!localStorage.getItem("userId")) navigate("/");
  }, []);

  return (
    <div className="AllReminders__container">
      <h1>Here you can create reminders... also paste the transactionId</h1>
      <div className="AllReminders__actions">
        <button onClick={() => navigate(-1)}>👈🏻Back</button>
        <button onClick={() => navigate("/addReminder")}>Add Reminder</button>
        {/*<select
          name="actionsList"
          id="actionsList"
          onChange={(e) => handleSelect(e)}
        >
          <option value="All Reminders">All Reminders</option>
          <option value="Today's Reminders">Today's Reminders</option>
  </select>*/}
      </div>
      <div className="AllReminders__canvas">
        {selectedAction === "Today's Reminders"
          ? todaysReminders.length > 0
            ? todaysReminders.map((reminder) => {
                return (
                  <ReminderTile
                    key={reminder.reminderId}
                    recepientName={reminder.recepientName}
                    body={reminder.description}
                    date={reminder.date}
                    reminderId={reminder.reminderId}
                  />
                );
              })
            : "No reminders for today"
          : data.reminders
          ? data.reminders.map((reminder) => {
              return (
                <ReminderTile
                  key={reminder.reminderId}
                  recepientName={reminder.recepientName}
                  body={reminder.description}
                  date={reminder.date}
                  reminderId={reminder.reminderId}
                />
              );
            })
          : ""}
      </div>
    </div>
  );
}

export default AllReminders;
