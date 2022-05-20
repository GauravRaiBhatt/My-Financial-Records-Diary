import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Home_Left from "./Home_Left";
import Home_Right from "./Home_Right";
import actionTypes from "../redux/actionTypes";
import "./stylesheets/home.css";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    console.log("<Home />");
    dispatch({ type: actionTypes.REMOVE_ACTIVE_RECEPIENT });
    if (!localStorage.getItem("userId")) navigate("/");
  }, []);

  return (
    <div className="Home__mainContainer">
        <React.Fragment>
          <h1 id="Home__header"> My Financial Record's Diary </h1>
          {/* <h1 id="userName">{userData.userName} </h1> */}
          <div id="Home__body">
            <Home_Left />
            <Home_Right />
          </div>
        </React.Fragment>
      
      {/* {userData ? (
        <React.Fragment>
          <h1 id="Home__header"> My Financial Record's Diary </h1>
          <div id="Home__body">
            <Home_Left />
            <Home_Right />
          </div>
        </React.Fragment>
      ) : (
        <h1>Fetching Data......</h1>
      )} */}
    </div>
  );
}

export default Home;
