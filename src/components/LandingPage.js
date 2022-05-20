import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./stylesheets/landingPage.css";
import actionTypes from "../redux/actionTypes";

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("<Landing Page />");
    if (localStorage.getItem("userId")) {
        navigate("/home");
      }
  }, []);

  return (
    <div id="LandingPage__container">
      {/* {userData && <Redirect to='/home'/> } */}

      <nav id="LandingPage__header">
        <h1>My Financial Records Diary</h1>
      </nav>
      <div id="LandingPage__body">
        <div id="LandingPage__div__left">
          <span>
            <Link to="/login"> Join with Email</Link>
          </span>
        </div>
        <div id="LandingPage__div__right">
          <span>
            <h2>About the Application</h2>
          </span>
          <p>
            This Application is meant for anyone who wants to have keep track of
            his/her expenditure .
          </p>
          <p>
            It is also beneficial to those who lend and borrow money . It helps
            you keep all your transaction records in a well organized manner by
            letting you create a profile of the person/body involved in the
            transaction.
          </p>

          <h2>User Guide</h2>
          <ul>
            <li>
              Create the recipient's profile with all the necessary details.
            </li>
            <li>Under his/her page add the transaction details</li>
          </ul>
          <p> To get started clik the button </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
