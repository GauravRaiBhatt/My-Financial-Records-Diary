import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOutAPI } from "../redux/actions";

import noImage from "../images/no-image.png";
import "./stylesheets/home_Left.css";

function Home_Left() {
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div id="HomeLeft__mainContainer">
      <div id="HomeLeftControls">
        <div id="HomeLeftControls__logout">
          <button
            id="logout"
            onClick={() => {
              signOutAPI(dispatch)
                .then((message) => {
                  console.log(message);
                  navigate("/");
                })
                .catch((e) => console.log(e));
            }}
          >
            Logout
          </button>
        </div>
        <div id="HomeLeftControls__addRecepient">
          <Link to="/addRecepient">
            <button id="addRecepient">Add Recepient</button>
          </Link>
        </div>
      </div>
      <div id="HomeLeft__body">
        <img
          src={
            userData
              ? userData.userImageURL
                ? userData.userImageURL
                : noImage
              : noImage
          }
          alt=""
        />

        <span id="name">
          Welcome <strong>{userData ? userData.userName : null}</strong>
        </span>

        <span id="total">Total : {userData ? userData.amount.total : 0}</span>

        <span id="gain">Lent : {userData ? userData.amount.lent : 0}</span>
        <span id="loss">
          Borrowed : {userData ? userData.amount.borrowed : 0}
        </span>

        {/* add functionality to edit (use a new route => /editProfile) */}
        <Link to="/editUserInfo">
          <button id="edit">Edit</button>
        </Link>
        <Link to="/allReminders">
          <button id="reminders">Reminders</button>
        </Link>
        <Link to="/setDeletionPassword">
          <button id="deletionPassword">Set Deletion Password</button>
        </Link>
        <Link to="/setInterestRate">
          <button id="interestRate">Set Interest Rate</button>
        </Link>
        <Link to="/sendSMS">
          <button id="sendSMS">Send SMS</button>
        </Link>
        <span id="noOfRecepients">
          {userData
            ? userData.recepients
              ? userData.recepients.length
              : 0
            : null}{" "}
          recipients
        </span>
      </div>
    </div>
  );
}

export default Home_Left;
