import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CropCategoryForm from "./components/CropCategoryForm";  
import CropCategoryList from "./components/CropCategoryList";
import MainPage from "./components/MainPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Form" element={<CropCategoryForm />} />
          <Route path="/List" element={<CropCategoryList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
