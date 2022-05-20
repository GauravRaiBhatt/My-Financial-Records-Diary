import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TransactionTile from "./TransactionTile";
import "./stylesheets/allTransactions_Right.css";

function AllTransactions_Right() {
  const toglleUpdate = useSelector((state) => state.data.update);
  const user = useSelector((state) => state.user);
  const [transactions, setTransactions] = useState([]);
  const [recepientId, setRecepientId] = useState("");

  useEffect(() => {
    user.activeRecepient
      ? setTransactions(user.activeRecepient.recepientData.transactions)
      : console.log("no transaction till time");
  }, []);
  useEffect(() => {
    user.activeRecepient
      ? setRecepientId(user.activeRecepient.recepientId)
      : console.log("no recepientId till time");
  }, []);

  useEffect(() => {
    console.log("when transactions changes");
    user.activeRecepient
      ? setTransactions(user.activeRecepient.recepientData.transactions)
      : console.log("no data till time");
  }, [transactions]);

  useEffect(() => {
    console.log("changed TOGLLE_UPDATE");
    user.activeRecepient
      ? setTransactions(user.activeRecepient.recepientData.transactions)
      : console.log("no data till time");
  }, [toglleUpdate]);

  return (
    <div id="AllTransactionsRight__container">
      {transactions.map((transaction) => {
        if (transaction)
          return (
            <TransactionTile
              key={transaction.transactionId}
              transactionDetails={transaction}
              recepientId={recepientId}
            />
          );
      })}
    </div>
  );
}

export default AllTransactions_Right;
