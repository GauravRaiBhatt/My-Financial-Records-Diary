import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signupAPI } from "../redux/actions";
import "./stylesheets/signup.css";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // redux
  const userData = useSelector((state) => state.user.userData);

  const handleUserName = (e) => setUserName(e.target.value);
  const handleUserEmail = (e) => setUserEmail(e.target.value);
  const handleUserPassword = (e) => setUserPassword(e.target.value);
  const handleUserConfirmPassword = (e) =>
    setUserConfirmPassword(e.target.value);

  const resetToDefault = () => {
    setUserName("");
    setUserEmail("");
    setUserPassword("");
    setUserConfirmPassword("");
  };

  const validateData = (userDetails) => {
    const regex = new RegExp(".+@.+..+");
    let isEmailValid = userDetails.userEmail.trim().length
      ? regex.test(userDetails.userEmail)
      : false;

    if (!userName.trim().length) alert("UserName Vannot be empty !1");
    else if (!isEmailValid) alert("Wrong email address😶");
    else if (!userPassword.trim().length) alert("Password cannot be empty!");
    else if (!userConfirmPassword.trim().length)
      alert("Confirm Password cannot be empty!");
    else if (userConfirmPassword.trim() !== userPassword)
      alert("Confirm Password must be same as the Password");
    else return true;

    return false;
  };

  const handleSignup = () => {
    setIsLoading(true);
    const userDetails = {
      userName,
      userEmail,
      userPassword,
      userConfirmPassword,
    };
    if (validateData(userDetails)) {
      signupAPI(dispatch, userDetails)
        .then((doc) => {
          console.log(doc);
          resetToDefault();
          setTimeout(() => {
            setIsLoading(false);
            navigate("/home");
          }, 1000);
        })
        .catch((e) => {
          setIsLoading(false);
          // resetToDefault();
          console.log(e);
        });
    } else {
      setIsLoading(false);
      resetToDefault();
    }
  };

  useEffect(() => {
    console.log("<Signup />");
    if (localStorage.getItem("userId")) navigate("/home");
  }, []);

  return (
    <div className="signup__mainContainer">
      <h1>Signup</h1>
      <input
        type="text"
        value={userName}
        placeholder="UserName"
        onChange={handleUserName}
      />
      <input
        type="email"
        value={userEmail}
        placeholder="Email"
        onChange={handleUserEmail}
      />
      <input
        type="password"
        value={userPassword}
        placeholder="Password"
        onChange={handleUserPassword}
      />
      <input
        type="password"
        value={userConfirmPassword}
        placeholder="Confirm Password"
        onChange={handleUserConfirmPassword}
      />
      <button onClick={handleSignup} disabled={isLoading ? true : false}>
        Signup
      </button>

      <Link to="/login">Already have an account</Link>
    </div>
  );
}

export default Signup;
