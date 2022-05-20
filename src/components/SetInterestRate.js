import React, { useState } from "react";
import './stylesheets/setInterestRate.css';

function SetInterestRate() {
  const [interestRate, setInterestRate] = useState("");

  const addInterestRate = () => [];
  return (
    <div id="SetInterestRate__container">
      <h1>Set The Interest Rate</h1>
      <div id="inputForm">
        <label htmlFor="Message">
         Interest Rate
          <input
            type="Number"
            placeholder="Inerest rate"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </label>
      </div>
      <button type="add" onClick={() => addInterestRate()}>
        Submit
      </button>
    </div>
  );
}

export default SetInterestRate;
