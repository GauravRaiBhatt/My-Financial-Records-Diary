import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import RecepientTile from "./RecepientTile";
import "./stylesheets/home_Right.css";

function Home_Right() {
  const recepientData = useSelector((state) => state.data.recepientData);

  useEffect(() => {
    console.log("in <Home_Right />");
  }, []);
  return (
    <div id="HomeRight__mainContainer">
      {recepientData.map((doc) => (
        <RecepientTile
          recepientData={doc}
          key={doc.recepientId}
          name={doc.recepientName}
          amount={doc.amount}
          lastModified={doc.lastModified}
          userId={doc.userId}
          recepientId={doc.recepientId}
          recepientImageURL={doc.recepientImageURL}
        />
      ))}
    </div>
  );
}

export default Home_Right;
