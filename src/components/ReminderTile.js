import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReminderAPI } from "../redux/actions";
import "./stylesheets/reminderTile.css";

function ReminderTile(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const deleteReminder = () => {
    if (user.userData && user.userData.deletionPassword) {
      let input = prompt("Enter the deletion password :)");
      if (input !== null) {
        if (input === user.userData.deletionPassword) {
          console.log("in the process to delete");
          console.log(props.reminderId);

          deleteReminderAPI(dispatch, props.reminderId)
            .then((message) => console.log(message))
            .catch((e) => console.log(e));
        } else {
          console.log("Wrong password!!");
          alert("Wrong Password!!");
        }
      } else {
        console.log("DeletionTerminated");
      }
    } else {
      if (window.confirm("Are u sure ? ")) {
        console.log("in the process to delete");

        deleteReminderAPI(dispatch, props.reminderId)
          .then((message) => console.log(message))
          .catch((e) => console.log(e));
      }
    }
  };

  return (
    <div className="ReminderTile__container">
      {/* <div className="ReminderTile__edit">
        <button>Edit</button>
      </div> */}
      <div className="Reminder__details">
        <h1>{props.recepientName} </h1>
        <h2>{props.body} </h2>
        <h3>{props.date}</h3>
      </div>
      <div className="Reminder__delete">
        <button onClick={() => deleteReminder()}>Delete</button>
      </div>
    </div>
  );
}
export default ReminderTile;
