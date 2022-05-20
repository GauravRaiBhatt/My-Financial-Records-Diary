import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import noImage from "../images/no-image.png";
import { removeRecepientAPI, updateUserAmountAPI } from "../redux/actions";
import "./stylesheets/allTransactions_Left.css";

function AllTransactions_Left() {
  const activeRecepient = useSelector((state) => state.user.activeRecepient);
  const update = useSelector((state) => state.data.update);
  const userData = useSelector((state) => state.user.userData);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const removeRecepient = () => {
    if (user.userData && user.userData.deletionPassword) {
      let input = prompt("Enter the deletion password :)");
      if (input !== null) {
        if (input === user.userData.deletionPassword) {
          console.log("in the process to delete");

          // for updating amount
          const newUserAmount = {
            total:
              parseInt(userData.amount.total) -
              parseInt(activeRecepient.recepientData.amount.total),

            lent:
              parseInt(userData.amount.lent) -
              parseInt(activeRecepient.recepientData.amount.lent),

            borrowed:
              parseInt(userData.amount.borrowed) -
              parseInt(activeRecepient.recepientData.amount.borrowed),
          };
          updateUserAmountAPI(dispatch, userData.userId, newUserAmount)
            .then((message) => {
              console.log(message);

              const allRecepientIds = userData ? userData.recepients : [];
              removeRecepientAPI(
                dispatch,
                userData.userId,
                activeRecepient.recepientId,
                allRecepientIds
              ).then((message) => {
                console.log(message);
                navigate(-1);
              });
            })
            .catch((e) => {
              console.log(e);
            });
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
            parseInt(userData.amount.total) -
            parseInt(activeRecepient.recepientData.amount.total),

          lent:
            parseInt(userData.amount.lent) -
            parseInt(activeRecepient.recepientData.amount.lent),

          borrowed:
            parseInt(userData.amount.borrowed) -
            parseInt(activeRecepient.recepientData.amount.borrowed),
        };
        updateUserAmountAPI(dispatch, userData.userId, newUserAmount)
          .then((message) => {
            console.log(message);

            const allRecepientIds = userData ? userData.recepients : [];
            removeRecepientAPI(
              dispatch,
              userData.userId,
              activeRecepient.recepientId,
              allRecepientIds
            ).then((message) => {
              console.log(message);
              navigate(-1);
            });
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        console.log("not deleted");
      }
    }
  };
  return (
    <div id="AllTransactionsLeft__container">
      <div id="AllTransactionsLeft__controls">
        <div id="AllTransactionsLeft__controls__addTransaction">
          <Link to="/addTransaction">
            <button id="addTransaction">Add Transaction</button>
          </Link>
          {/* <button id="addTransaction" onClick={()=> <Redirect to='/addTransaction'/>}>Add Transaction</button> */}
        </div>
      </div>
      <div id="AllTransactionsLeft__body">
        {activeRecepient ? (
          <React.Fragment>
            <img
              src={
                activeRecepient.recepientData.recepientImageURL
                  ? activeRecepient.recepientData.recepientImageURL
                  : noImage
              }
              alt=""
            />

            <span id="name">
              <strong>
                {activeRecepient
                  ? activeRecepient.recepientData.recepientName
                  : null}
              </strong>
            </span>

            <span id="total">
              Total :{" "}
              {activeRecepient ? activeRecepient.recepientData.amount.total : 0}
            </span>

            <span id="gain">
              Lent :{" "}
              {activeRecepient ? activeRecepient.recepientData.amount.lent : 0}
            </span>
            <span id="loss">
              Borrowed{" "}
              {activeRecepient
                ? activeRecepient.recepientData.amount.borrowed
                : 0}
            </span>

            <Link to="/editRecepientInfo">
              <button id="edit">Edit</button>
            </Link>
            <button id="delete" onClick={(e) => removeRecepient(e)}>
              Delete
            </button>
            <span id="noOfTransactions">
              {activeRecepient
                ? activeRecepient.recepientData.transactions.length
                : 0}{" "}
              Transactions
            </span>
          </React.Fragment>
        ) : (
          "Loading......"
        )}
      </div>
    </div>
  );
}

export default AllTransactions_Left;
