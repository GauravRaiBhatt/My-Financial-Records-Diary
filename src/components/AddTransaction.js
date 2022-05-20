import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./stylesheets/addTransaction.css";
import { v4 as uid } from "uuid";
import {
  addTransactionAPI,
  updateRecepientAmountAPI,
  updateUserAmountAPI,
} from "../redux/actions";
import "./stylesheets/addTransaction.css";

function AddTransaction() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [transactionDesc, setTransactionDesc] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [lent, setLent] = useState(false);

  const addTransaction = () => {
    // alert(lent);
    if (user.userData) {
      console.log("in add transaction");
      console.log("recepientId");
      const recepientId = user.activeRecepient
        ? user.activeRecepient.recepientId
        : null;

      const transactionData = {
        userId: user.userData.userId,
        transactionId: uid(),
        transactionDesc,
        transactionAmount,
        lent,
        createdAt: new Date().toISOString(),
        // lastModified: firebase.firestore.FieldValue.serverTimestamp(),
      };
      addTransactionAPI(
        dispatch,
        transactionData,
        user.activeRecepient.recepientId
      )
        .then((message) => {
          console.log(message);
          const newRecepientAmount = {
            total: lent
              ? parseInt(user.activeRecepient.recepientData.amount.total) +
                parseInt(transactionAmount)
              : parseInt(user.activeRecepient.recepientData.amount.total) -
                parseInt(transactionAmount),
            lent: lent
              ? parseInt(user.activeRecepient.recepientData.amount.lent) +
                parseInt(transactionAmount)
              : parseInt(user.activeRecepient.recepientData.amount.lent),
            borrowed: lent
              ? parseInt(user.activeRecepient.recepientData.amount.borrowed)
              : parseInt(user.activeRecepient.recepientData.amount.borrowed) +
                parseInt(transactionAmount),
          };
          const newUserAmount = {
            total: lent
              ? parseInt(user.userData.amount.total) +
                parseInt(transactionAmount)
              : parseInt(user.userData.amount.total) -
                parseInt(transactionAmount),
            lent: lent
              ? parseInt(user.userData.amount.lent) +
                parseInt(transactionAmount)
              : parseInt(user.userData.amount.lent),
            borrowed: lent
              ? parseInt(user.userData.amount.borrowed)
              : parseInt(user.userData.amount.borrowed) +
                parseInt(transactionAmount),
          };
          updateRecepientAmountAPI(
            dispatch,
            recepientId,
            newRecepientAmount
          ).then((message) => {
            console.log(message);
            updateUserAmountAPI(
              dispatch,
              user.userData.userId,
              newUserAmount
            ).then((message) => {
              console.log(message);
              // this function is redundant?? bcoz of TOGLLE_UPDATE *check
              setTimeout(() => {
                navigate(-1); // this deletes the current route from history stack
              }, 2000);
            });
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      alert("u need to login first");
    }
  };

  return (
    <div id="AddRecepient__container">
      <h1>Provide Transaction Details</h1>
      <div id="inputForm">
        <label htmlFor="Transaction Description">
          Transaction Description
          <input
            type="text"
            placeholder="Transaction Description"
            value={transactionDesc}
            onChange={(e) => setTransactionDesc(e.target.value)}
          />
        </label>
        <label htmlFor="Trnasaction Amount">
          Amount
          <input
            type="number"
            placeholder="Transaction Amount"
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
          />
        </label>
        <label htmlFor="Trnasaction Amount">
          Lent
          <input
            id="checkbox"
            type="checkbox"
            onClick={(e) => {
              setLent(!lent);
            }}
          />
        </label>
      </div>
      <button type="submit" onClick={() => addTransaction()}>
        Submit
      </button>
    </div>
  );
}

export default AddTransaction;
