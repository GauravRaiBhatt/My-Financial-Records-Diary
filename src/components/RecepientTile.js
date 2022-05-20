import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./stylesheets/recepientTile.css";
import noImage from "../images/no-image.png";
import {
  removeRecepientAPI,
  setActiveRecepientAPI,
  updateUserAmountAPI,
} from "../redux/actions";

function RecepientTile(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const allRecepientIds = useSelector(
    (state) => state.user.userData.recepients
  );

  useEffect(() => {
    console.log(`rendering component : ${props.name}`);
  }, []);

  const removeRecepient = () => {
    if (user.userData && user.userData.deletionPassword) {
      let input = prompt("Enter the deletion password :)");
      if (input !== null) {
        if (input === user.userData.deletionPassword) {
          console.log("in the process to delete");

          // for updating amount
          const newUserAmount = {
            total:
              parseInt(user.userData.amount.total) -
              parseInt(props.recepientData.amount.total),

            lent:
              parseInt(user.userData.amount.lent) -
              parseInt(props.recepientData.amount.lent),

            borrowed:
              parseInt(user.userData.amount.borrowed) -
              parseInt(props.recepientData.amount.borrowed),
          };
          updateUserAmountAPI(dispatch, user.userData.userId, newUserAmount)
            .then((message) => {
              console.log(message);
              removeRecepientAPI(
                dispatch,
                props.userId,
                props.recepientId,
                allRecepientIds
              ).then((message) => console.log(message));
            })
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

        // for updating amount
        const newUserAmount = {
          total:
            parseInt(user.userData.amount.total) -
            parseInt(props.recepientData.amount.total),

          lent:
            parseInt(user.userData.amount.lent) -
            parseInt(props.recepientData.amount.lent),

          borrowed:
            parseInt(user.userData.amount.borrowed) -
            parseInt(props.recepientData.amount.borrowed),
        };
        updateUserAmountAPI(dispatch, user.userData.userId, newUserAmount)
          .then((message) => {
            console.log(message);
            removeRecepientAPI(
              dispatch,
              props.userId,
              props.recepientId,
              allRecepientIds
            ).then((message) => console.log(message));
          })
          .catch((e) => console.log(e));
      } else {
        console.log("deletion terminated");
      }
    }
  };

  const goToAllTransactions = (e) => {
    setActiveRecepientAPI(dispatch, props.recepientData);
    navigate("/allTransactions");
  };

  let sign = "+";
  let color = "#82da7d"; //#82da7d
  if (props.gain) {
    sign = "-";
    color = "#e43b3be6"; //#e43b3be6
  }

  return (
    <div className="RecepientTile" style={{ backgroundColor: color }}>
      <div className="RecepientTile__img">
        <img
          src={props.recepientImageURL ? props.recepientImageURL : noImage}
          alt="Profile "
          onClick={(e) => goToAllTransactions(e)}
        />
      </div>

      <div
        className="RecepientTile__details"
        onClick={(e) => goToAllTransactions(e)}
      >
        <span id="name">{props.name}</span>
        <span id="lastModified">{props.lastModified}</span>

        <span id="total">Total : {props.amount.total}</span>
        <span id="gain">Lent : {props.amount.lent}</span>
        <span id="loss">Borrowed : {props.amount.borrowed}</span>
        <span id="noOfTransactions">
          {props.recepientData.transactions.length} Transactons
        </span>
      </div>

      <div className="RecepientTile__delete">
        <button onClick={() => removeRecepient()}>Delete</button>
      </div>
    </div>
  );
}

export default RecepientTile;
