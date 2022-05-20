import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchDataAfterRefresh, loginAPI } from "../redux/actions";
import "./stylesheets/login.css";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // redux
  const userData = useSelector((state) => state.user.userData);

  const validateData = (userDetails) => {
    const regex = new RegExp(".+@.+..+");

    let isEmailValid = userDetails.userEmail.trim().length
      ? regex.test(userDetails.userEmail)
      : false;
    let isPasswordValid = userDetails.userPassword.trim().length ? true : false;

    if (isEmailValid && isPasswordValid) return true;

    if (!isEmailValid) {
      alert("Wrong email address😶");
    } else if (!isPasswordValid) {
      alert("Password cannot be empty!");
    }
    return false;
  };

  const handleEmail = (e) => {
    setUserEmail(e.target.value);
    // console.log(e.target.value);
  };
  const handlePassword = (e) => {
    setUserPassword(e.target.value);
    // console.log(e.target.value);
  };

  const handleLogin = () => {
    setIsLoading(true);
    const userDetails = {
      userEmail,
      userPassword,
    };
    if (validateData(userDetails)) {
      loginAPI(dispatch, userDetails)
        .then((doc) => {
          console.log(doc);
          setTimeout(() => {
            setIsLoading(false);
            navigate("/home");
          }, 1000);
        })
        .catch((e) => {
          setIsLoading(false);
          if (e === "Wrong Password !") setUserPassword("");
          console.log(e);
        });
    } else setIsLoading(false);
  };

  useEffect(() => {
    console.log("<Login />");
    if (localStorage.getItem("userId")) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="login__mainContainer">
      {/* <h1>My Financial Records Diary</h1> */}
      <h1>Login</h1>
      <input
        type="text"
        value={userEmail}
        placeholder="Email"
        onChange={handleEmail}
      />
      <input
        type="Password"
        value={userPassword}
        placeholder="Password"
        onChange={handlePassword}
      />
      <button onClick={handleLogin} disabled={isLoading ? true : false}>
        Login
      </button>

      <Link to="/signup">Don't have an account</Link>
    </div>
  );
}

export default Login;

// const loginAPI = (userDetails) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (userDetails.userPassword === "123456") {
//         resolve({ userNmae: "grb", userPassword: "123456" });
//         console.log("server responded with successful login.");
//       } else {
//         reject("Wrong userPassword (- -)");
//       }
//     }, 3000);
//   });
// };
