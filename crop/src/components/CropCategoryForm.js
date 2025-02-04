import React, { useState } from "react";
import "./styles.css"; // Import the same single CSS file

const CropCategoryForm = () => {
  const [languageData, setLanguageData] = useState([
    { language: 0, title: "", description: "" }
  ]);

  const handleLanguageChange = (index, field, value) => {
    const updatedLanguageData = [...languageData];
    updatedLanguageData[index][field] = value;
    setLanguageData(updatedLanguageData);
  };

  const addLanguageField = () => {
    setLanguageData([
      ...languageData,
      { language: 0, title: "", description: "" }
    ]);
  };

  const removeLanguageField = (index) => {
    const updatedLanguageData = languageData.filter((_, i) => i !== index);
    setLanguageData(updatedLanguageData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    languageData.forEach((data, index) => {
      formData.append(`LanguageData[${index}].language`, data.language);
      formData.append(`LanguageData[${index}].title`, data.title);
      formData.append(`LanguageData[${index}].description`, data.description);
    });

    const imageFile = document.querySelector("#imageInput").files[0];
    if (imageFile) {
      formData.append("ImageUrl", imageFile);
    }

    formData.append("Status", true);

    try {
      const response = await fetch(
        "https://localhost:7282/api/CropCategory/CreateCropCategory",
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${errorText}`);
      }

      const data = await response.json();
      console.log("Success:", data);
      alert("Crop Category Created Successfully!");
    } catch (error) {
      console.error("There was an error!", error);
      alert(`Error occurred: ${error.message}`);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {languageData.map((lang, index) => (
          <div key={index}>
            <label>Language</label>
            <select
              value={lang.language}
              onChange={(e) => handleLanguageChange(index, "language", parseInt(e.target.value))}
            >
              <option value={0}>English</option>
              <option value={1}>Marathi</option>
              <option value={2}>Hindi</option>
              <option value={3}>Spanish</option>
              <option value={4}>Kannada</option>
            </select>

            <label>Title</label>
            <input
              type="text"
              value={lang.title}
              onChange={(e) => handleLanguageChange(index, "title", e.target.value)}
            />

            <label>Description</label>
            <input
              type="text"
              value={lang.description}
              onChange={(e) => handleLanguageChange(index, "description", e.target.value)}
            />

            <button type="button" className="remove-btn" onClick={() => removeLanguageField(index)}>
              Remove Language
            </button>
          </div>
        ))}

        <button type="button" onClick={addLanguageField}>
          Add Language
        </button>

        <div>
          <label>Image</label>
          <input type="file" id="imageInput" />
        </div>

        <div>
          <label>Status</label>
          <input type="checkbox" checked={true} onChange={() => {}} />
        </div>

        <button type="submit">Create Crop Category</button>
      </form>
    </div>
  );
};

export default CropCategoryForm;
