import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { useEffect } from "react";
import { fetchAllData } from "./redux/actions";
import { useDispatch, useSelector } from "react-redux";

// components
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AllTransactions from "./components/AllTransactions";
import AddTransaction from "./components/AddTransaction";
import AddRecepient from "./components/AddRecepient";
import EditUserDetails from "./components/EditUserDetails";
import EditRecepientDetails from "./components/EditRecepientDetails";
import AllReminders from "./components/AllReminders";
import AddReminder from "./components/AddReminder";
import SendSMS from "./components/SendSMS";
import SetDeletionPassword from "./components/SetDeletionPassword";
import SetInterestRate from "./components/SetInterestRate";
import LandingPage from "./components/LandingPage";

function App() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    console.log("<App />");
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchAllData(dispatch, userId)
        .then((message) => console.log(message))
        .catch((e) => console.log(e));
    } else console.log("user isn't logged in yet.");
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/addRecepient" element={<AddRecepient />} />
          <Route path="/addTransaction" element={<AddTransaction />} />
          <Route path="/allTransactions" element={<AllTransactions />} />
          <Route path="/allReminders" element={<AllReminders />} />
          <Route path="/addReminder" element={<AddReminder />} />
          <Route path="/sendSMS" element={<SendSMS />} />
          <Route
            path="/setDeletionPassword"
            element={<SetDeletionPassword userData={user.userData} />}
          />
          <Route path="/setInterestRate" element={<SetInterestRate />} />
          <Route
            path="/editUserInfo"
            element={<EditUserDetails userData={user.userData} />}
          />
          <Route
            path="/editRecepientInfo"
            element={
              <EditRecepientDetails activeRecepient={user.activeRecepient} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
