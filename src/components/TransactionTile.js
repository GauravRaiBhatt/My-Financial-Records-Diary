import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTransactionAPI,
  updateRecepientAmountAPI,
  updateUserAmountAPI,
} from "../redux/actions";
import "./stylesheets/transactionTile.css";

function TransactionTile(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const deleteTransaction = () => {
    if (user.userData && user.userData.deletionPassword) {
      let input = prompt("Enter the deletion password :)");
      if (input !== null) {
        if (input === user.userData.deletionPassword) {
          console.log("in the process to delete");

          deleteTransactionAPI(
            dispatch,
            props.recepientId,
            props.transactionDetails
          )
            .then((message) => {
              console.log(message);
              // for updating amount
              const newRecepientAmount = {
                total: props.transactionDetails.lent
                  ? parseInt(user.activeRecepient.recepientData.amount.total) -
                    parseInt(props.transactionDetails.transactionAmount)
                  : parseInt(user.activeRecepient.recepientData.amount.total) +
                    parseInt(props.transactionDetails.transactionAmount),
                lent: props.transactionDetails.lent
                  ? parseInt(user.activeRecepient.recepientData.amount.lent) -
                    parseInt(props.transactionDetails.transactionAmount)
                  : parseInt(user.activeRecepient.recepientData.amount.lent),
                borrowed: props.transactionDetails.lent
                  ? parseInt(user.activeRecepient.recepientData.amount.borrowed)
                  : parseInt(
                      user.activeRecepient.recepientData.amount.borrowed
                    ) - parseInt(props.transactionDetails.transactionAmount),
              };
              const newUserAmount = {
                total: props.transactionDetails.lent
                  ? parseInt(user.userData.amount.total) -
                    parseInt(props.transactionDetails.transactionAmount)
                  : parseInt(user.userData.amount.total) +
                    parseInt(props.transactionDetails.transactionAmount),

                lent: props.transactionDetails.lent
                  ? parseInt(user.userData.amount.lent) -
                    parseInt(props.transactionDetails.transactionAmount)
                  : parseInt(user.userData.amount.lent),
                borrowed: props.transactionDetails.lent
                  ? parseInt(user.userData.amount.borrowed)
                  : parseInt(user.userData.amount.borrowed) -
                    parseInt(props.transactionDetails.transactionAmount),
              };
              updateRecepientAmountAPI(
                dispatch,
                props.recepientId,
                newRecepientAmount
              ).then((message) => {
                console.log(message);
                updateUserAmountAPI(
                  dispatch,
                  user.userData.userId,
                  newUserAmount
                ).then((message) => console.log(message));
              });
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
      if (window.confirm("Are u sure??")) {
        deleteTransactionAPI(
          dispatch,
          props.recepientId,
          props.transactionDetails
        )
          .then((message) => {
            console.log(message);
            // for updating amount
            const newRecepientAmount = {
              total: props.transactionDetails.lent
                ? parseInt(user.activeRecepient.recepientData.amount.total) -
                  parseInt(props.transactionDetails.transactionAmount)
                : parseInt(user.activeRecepient.recepientData.amount.total) +
                  parseInt(props.transactionDetails.transactionAmount),
              lent: props.transactionDetails.lent
                ? parseInt(user.activeRecepient.recepientData.amount.lent) -
                  parseInt(props.transactionDetails.transactionAmount)
                : parseInt(user.activeRecepient.recepientData.amount.lent),
              borrowed: props.transactionDetails.lent
                ? parseInt(user.activeRecepient.recepientData.amount.borrowed)
                : parseInt(user.activeRecepient.recepientData.amount.borrowed) -
                  parseInt(props.transactionDetails.transactionAmount),
            };
            const newUserAmount = {
              total: props.transactionDetails.lent
                ? parseInt(user.userData.amount.total) -
                  parseInt(props.transactionDetails.transactionAmount)
                : parseInt(user.userData.amount.total) +
                  parseInt(props.transactionDetails.transactionAmount),

              lent: props.transactionDetails.lent
                ? parseInt(user.userData.amount.lent) -
                  parseInt(props.transactionDetails.transactionAmount)
                : parseInt(user.userData.amount.lent),
              borrowed: props.transactionDetails.lent
                ? parseInt(user.userData.amount.borrowed)
                : parseInt(user.userData.amount.borrowed) -
                  parseInt(props.transactionDetails.transactionAmount),
            };
            updateRecepientAmountAPI(
              dispatch,
              props.recepientId,
              newRecepientAmount
            ).then((message) => {
              console.log(message);
              updateUserAmountAPI(
                dispatch,
                user.userData.userId,
                newUserAmount
              ).then((message) => console.log(message));
            });
          })
          .catch((e) => console.log(e));
      } else {
        console.log("DeletionTerminated");
      }
    }
  };

  return (
    <div className="TransactionTile">
      <div className="TransactionTile__details">
        <p>{props.transactionDetails.transactionDesc}</p>
        <p>Amount : {props.transactionDetails.transactionAmount}</p>
        <p>
          Last modified :{" "}
          {new Date(props.transactionDetails.createdAt).toLocaleString('en-IN')}
        </p>
        <p>{props.transactionDetails.lent ? "Lent" : "Borrowed"}</p>
      </div>

      <div className="TransactionTile__delete">
        <button onClick={() => deleteTransaction()}>Delete</button>
      </div>
    </div>
  );
}
export default TransactionTile;
