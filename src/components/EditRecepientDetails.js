import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { storage } from "../firebaseFile";
import noImage from "../images/no-image.png";
import { updateRecepientDetailsAPI } from "../redux/actions";
import "./stylesheets/editRecepientDetails.css";

function EditRecepientDetails({ activeRecepient }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allRecepientData = useSelector((state) => state.data.recepientData);
  //   const activeRecepient = useSelector((state) => state.user.activeRecepient);

  //   state variables
  const [recepientName, setRecepientName] = useState("");
  const [recepientNickname, setrecepientNickname] = useState("");
  const [recepientPhone, setRecepientPhone] = useState("");
  const [selectedImageURL, setSelectedImageURL] = useState("");
  const [image, setImage] = useState("");

  // member functions
  const fileHandler = (e) => {
    setImage(e.target.files[0]);
    if (e.target.files[0])
      setSelectedImageURL(URL.createObjectURL(e.target.files[0]));
  };

  const updateRecepientDetails = () => {
    const updatedRecepientDetails = {
      recepientName,
      recepientNickname,
      recepientPhone,
      imageName: image != "" ? `${v4()}.${image.name.split(".")[1]}` : "",
      oldImageName: activeRecepient.recepientData.recepientImageURL
        ? storage.refFromURL(activeRecepient.recepientData.recepientImageURL)
            .name
        : "no-image.png",
      image,
    };
    console.log(updatedRecepientDetails);
    updateRecepientDetailsAPI(
      dispatch,
      activeRecepient.recepientId,
      activeRecepient.recepientData,
      updatedRecepientDetails
    )
      .then((message) => {
        console.log(message);
        navigate(-1);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (activeRecepient) {
      setRecepientName(activeRecepient.recepientData.recepientName);
      setrecepientNickname(activeRecepient.recepientData.recepientNickname);
      setRecepientPhone(activeRecepient.recepientData.recepientPhone);
    }
  }, [activeRecepient]);

  useEffect(() => {
    if (!localStorage.getItem("userId") || !activeRecepient) navigate("/");
  }, []);

  return (
    <div className="erd_container">
      {activeRecepient ? (
        <React.Fragment>
          <h1>This page is meant to edit this recepient's details.</h1>

          {selectedImageURL.length > 0 ? (
            <img src={selectedImageURL} id="erd_profileImage" />
          ) : activeRecepient.recepientData.recepientImageURL ? (
            activeRecepient.recepientData.recepientImageURL.length > 0 ? (
              <img
                src={activeRecepient.recepientData.recepientImageURL}
                id="eud_profileImage"
                alt="image didnt loaded"
              />
            ) : (
              <img
                src={noImage}
                id="eud_profileImage"
                alt="image didnt loaded"
              />
            )
          ) : (
            <img src={noImage} id="eud_profileImage" alt="image didnt loaded" />
          )}

          <input type="file" onChange={(e) => fileHandler(e)} />

          <input
            value={recepientName}
            onChange={(e) => setRecepientName(e.target.value)}
          />
          <input
            value={recepientNickname}
            onChange={(e) => setrecepientNickname(e.target.value)}
          />
          <input
            type="Number"
            value={recepientPhone}
            onChange={(e) => setRecepientPhone(e.target.value)}
          />

          <button
            onClick={() => {
              updateRecepientDetails();
            }}
          >
            update
          </button>
        </React.Fragment>
      ) : (
        ""
      )}
    </div>
  );
}
export default EditRecepientDetails;
