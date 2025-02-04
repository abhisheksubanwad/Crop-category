import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const MainPage = () => {
  const navigate = useNavigate(); 

  return (
    <div className="main-page">
      <button onClick={() => navigate("/form")}>Form</button>
      <button onClick={() => navigate("/list")}>List</button>
    </div>
  );
};

export default MainPage;
