import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import noImage from "../images/no-image.png";
import { addRecepientAPI } from "../redux/actions";
import "./stylesheets/addRecepient.css";

function AddRecepient() {
  const userData = useSelector((state) => state.user.userData);
  const recepientData = useSelector((state) => state.data.recepientData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [recepientName, setRecepientName] = useState("");
  const [recepientPhone, setRecepientPhone] = useState("");
  const [recepientNickname, setRecepientNickname] = useState("");
  const [addRecepient__Image, setAddRecepient__Image] = useState("");
  const [addRecepient__selectedImageURL, setAddRecepient__SelectedImageURL] =
    useState("");

  const addRecepient = () => {
    if (userData) {
      console.log("in addrecepient");
      const numberOfRecepientsSoFar = userData.recepients.length;
      const additionalData = {
        image: addRecepient__Image,
        imageName:
          addRecepient__Image !== ""
            ? `${v4()}.${addRecepient__Image.name.split(".")[1]}`
            : "",
      };
      const recepientData = {
        createdAt: new Date().toISOString(),
        recepientName,
        recepientPhone,
        recepientNickname,
        recepientImageURL:
          additionalData.imageName === ""
            ? "https://firebasestorage.googleapis.com/v0/b/myfrdiary.appspot.com/o/images%2Fno-image.png?alt=media&token=ca319164-23a0-4c9e-94e3-73714496b25b"
            : "",
        userId: userData.userId,
        transactions: [],
        amount: {
          total: 0,
          lent: 0,
          borrowed: 0,
        },
      };
      
      addRecepientAPI(dispatch, userData.userId, recepientData, additionalData)
        .then((message) => {
          console.log(message);
          navigate("/home");
        })
        .catch((e) => console.log(e));
    } else {
      alert("u need to login first");
    }
  };

  const fileHandler = (e) => {
    setAddRecepient__Image(e.target.files[0]);
    setAddRecepient__SelectedImageURL(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    if (!localStorage.getItem("userId")) navigate("/");
  }, []);

  return (
    <div id="AddRecepient__container">
      <h1>Provide Recepient's Details</h1>
      <div id="inputForm">
        {addRecepient__selectedImageURL.length > 0 ? (
          <img
            src={addRecepient__selectedImageURL}
            id="addRecepient_profileImage"
          />
        ) : (
          <img
            src={noImage}
            id="addRecepient_profileImage"
            alt="image didnt loaded"
          />
        )}

        <label htmlFor="Recepient's Profile pic">
          <input type="file" onChange={(e) => fileHandler(e)} />
        </label>

        <label htmlFor="Recepient's Name">
          Name
          <input
            type="text"
            placeholder="Name"
            value={recepientName}
            onChange={(e) => setRecepientName(e.target.value)}
          />
        </label>
        <label htmlFor="Recepient's Phone No.">
          Phone Number
          <input
            type="number"
            placeholder="Phone no.."
            value={recepientPhone}
            onChange={(e) => setRecepientPhone(e.target.value)}
          />
        </label>
        <label htmlFor="Recepient's Nickname">
          Nickname
          <input
            type="text"
            placeholder="This should be unique."
            value={recepientNickname}
            onChange={(e) => setRecepientNickname(e.target.value)}
          />
        </label>
      </div>
      <button type="submit" onClick={() => addRecepient()}>
        Submit
      </button>
    </div>
  );
}

export default AddRecepient;
