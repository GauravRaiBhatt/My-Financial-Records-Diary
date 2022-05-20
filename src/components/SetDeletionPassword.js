import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDeletionPasswordAPI } from "../redux/actions";
import "./stylesheets/setDeletionPassword.css";

function SetDeletionPassword({ userData }) {
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addDeletionPassword = () => {
    console.log("This will set the deletion password");
    setDeletionPasswordAPI(
      {
        userId: userData.userId,
        deletionPassword: password,
      },
      dispatch
    )
      .then((message) => {
        console.log("Deletion password successfully set");
        navigate(-1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div id="SetDeletionPassword__container">
      <h1>Set The Deletion Password</h1>
      <div id="inputForm">
        <label htmlFor="Message">
          Deletion Password
          <input
            type="Password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button type="add" onClick={() => addDeletionPassword()}>
        Submit
      </button>
    </div>
  );
}

export default SetDeletionPassword;
