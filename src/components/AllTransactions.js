import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AllTransactions_Left from "./AllTransactions_Left";
import AllTransactions_Right from "./AllTransactions_Right";
import Logo from "../images/logo2.jpg";
import "./stylesheets/allTransactions.css";

function AllTransactions() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    user.activeRecepient
      ? console.log("Ignore this --> userData exists ", user.activeRecepient)
      : navigate("/home");
  }, []);

  const gotoHome = () => {
    //   history.replace("home", history.location);
    navigate("/home");
  };

  return (
    <div id="AllTransactions__container">
      <nav id="AllTransactions__header">
        <img id="logo" onClick={() => gotoHome()} src={Logo} alt="myLogo" />

        <span>
          {user.activeRecepient
            ? user.activeRecepient.recepientData.recepientName
            : ""}
        </span>
      </nav>
      <div id="AllTransactions__body">
        <AllTransactions_Left />
        <AllTransactions_Right />
      </div>
    </div>
  );
}

export default AllTransactions;
