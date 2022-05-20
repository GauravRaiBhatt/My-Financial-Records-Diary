import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { v4 } from "uuid";
import { updateUserDetailsAPI } from "../redux/actions";
import { storage } from "../firebaseFile";
import "./stylesheets/editUserDetails.css";

function EditUserDetails({ userData }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [image, setImage] = useState("");
  const [selectedImageURL, setselectedImageURL] = useState("");

  const fileEvent = (e) => {
    console.log("in file event");
    setImage(e.target.files[0]);
    setselectedImageURL(URL.createObjectURL(e.target.files[0]));
    console.log(image);
  };

  const updateUserDetails = () => {
    console.log("image", image);
    console.log("image.size ", image.size);
    const updatedUserDetails = {
      userName,
      userEmail,
      imageName: image.size > 0 ? `${v4()}.${image.name.split(".")[1]}` : "",
      oldImageName:
        userData.userImageURL.length > 0
          ? storage.refFromURL(userData.userImageURL).name
          : "no-image.png",
      image,
    };

    updateUserDetailsAPI(dispatch, userData, updatedUserDetails)
      .then(() => navigate(-1))
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (userData) {
      setUserName(userData.userName);
      setUserEmail(userData.userEmail);
    }
  }, [userData]);

  useEffect(() => {
    console.log("<EditUserDetails />");
    if (!localStorage.getItem("userId")) navigate("/");
  }, []);

  return (
    <div className="eud_container">
      {userData ? (
        <React.Fragment>
          <h2>This page will allow u edit user Details</h2>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input value={userEmail} onChange={() => console.log()} />

          {selectedImageURL.length > 0 ? (
            <img src={selectedImageURL} id="eud_profileImage" />
          ) : (
            <img
              src={userData.userImageURL}
              id="eud_profileImage"
              alt="image didnt loaded"
            />
          )}

          <input type="file" onChange={(e) => fileEvent(e)} />

          <button type="submit" onClick={() => updateUserDetails()}>
            Update
          </button>
        </React.Fragment>
      ) : (
        ""
      )}
    </div>
  );
}

export default EditUserDetails;
