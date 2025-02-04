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

// import "./CropCategoryForm.css";
// import React, { useState } from 'react';

// const CropCategoryForm = () => {
//   const [languageData, setLanguageData] = useState({
//     language: 0,
//     title: '',
//     description: ''
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Create FormData to send in the request
//     const formData = new FormData();

//     // Log to debug the formData content
//     console.log("FormData content before append:", languageData);

//     // Append LanguageData as separate fields
//     formData.append('LanguageData[0].language', languageData.language);
//     formData.append('LanguageData[0].title', languageData.title);
//     formData.append('LanguageData[0].description', languageData.description);

//     // Ensure image file is attached if selected
//     const imageFile = document.querySelector('#imageInput').files[0];
//     if (imageFile) {
//       formData.append('ImageUrl', imageFile);
//     }

//     // Append Status
//     formData.append('Status', true);

//     // Log FormData to confirm everything is appended correctly
//     for (let pair of formData.entries()) {
//       console.log(pair[0], pair[1]); // Log each formData entry
//     }

//     try {
//       // Send the POST request with the formData
//       const response = await fetch('https://localhost:7282/api/CropCategory/CreateCropCategory', {
//         method: 'POST',
//         body: formData,
//       });

//       // Handle response
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Request failed: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log('Success:', data);
//       alert('Crop Category Created Successfully!');
//     } catch (error) {
//       console.error('There was an error!', error);
//       alert(`Error occurred: ${error.message}`);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>Language</label>
//         <select
//           value={languageData.language}
//           onChange={(e) => setLanguageData({ ...languageData, language: parseInt(e.target.value) })}
//         >
//           <option value={0}>English</option>
//           <option value={1}>Marathi</option>
//           <option value={2}>Hindi</option>
//           <option value={3}>Spanish</option>
//           <option value={4}>Kannada</option>
//         </select>
//       </div>
//       <div>
//         <label>Title</label>
//         <input
//           type="text"
//           value={languageData.title}
//           onChange={(e) => setLanguageData({ ...languageData, title: e.target.value })}
//         />
//       </div>
//       <div>
//         <label>Description</label>
//         <input
//           type="text"
//           value={languageData.description}
//           onChange={(e) => setLanguageData({ ...languageData, description: e.target.value })}
//         />
//       </div>
//       <div>
//         <label>Image</label>
//         <input type="file" id="imageInput" />
//       </div>
//       <div>
//         <label>Status</label>
//         <input
//           type="checkbox"
//           checked={true}
//           onChange={() => {}}
//         />
//       </div>
//       <button type="submit">Create Crop Category</button>
//     </form>
//   );
// };

// export default CropCategoryForm;

// Working code 
// import "./CropCategoryForm.css";
// import React, { useState } from 'react';

// const CropCategoryForm = () => {
//   const [languageData, setLanguageData] = useState([]);
//   const [selectedLanguage, setSelectedLanguage] = useState("EN"); // Default to English
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [status, setStatus] = useState(true); // Default to true
//   const [imageFile, setImageFile] = useState(null);

//   // Handle adding new language entry
//   const handleAddLanguage = () => {
//     if (!title || !description) {
//       alert("Please enter title and description before adding another language.");
//       return;
//     }

//     setLanguageData([...languageData, { language: selectedLanguage, title, description }]);
//     setTitle("");
//     setDescription("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Ensure at least one language is added
//     if (languageData.length === 0) {
//       alert("Please add at least one language.");
//       return;
//     }

//     // Create FormData for request
//     const formData = new FormData();

//     // Append all languages dynamically
//     languageData.forEach((lang, index) => {
//       formData.append(`LanguageData[${index}].language`, lang.language);
//       formData.append(`LanguageData[${index}].title`, lang.title);
//       formData.append(`LanguageData[${index}].description`, lang.description);
//     });

//     // Append image file if selected
//     if (imageFile) {
//       formData.append("ImageUrl", imageFile);
//     }

    // Append Status
//     formData.append("Status", status);

//     console.log("Submitting FormData:", [...formData.entries()]); // Debug log

//     try {
//       const response = await fetch('https://localhost:7282/api/CropCategory/CreateCropCategory', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Request failed: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("Success:", data);
//       alert("Crop Category Created Successfully!");

//       // Reset form
//       setLanguageData([]);
//       setTitle("");
//       setDescription("");
//       setSelectedLanguage("EN");
//       setStatus(true);
//       setImageFile(null);
//     } catch (error) {
//       console.error("There was an error!", error);
//       alert(`Error occurred: ${error.message}`);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>Language</label>
//         <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
//           <option value="EN">English</option>
//           <option value="MR">Marathi</option>
//           <option value="HI">Hindi</option>
//         </select>
//       </div>
//       <div>
//         <label>Title</label>
//         <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
//       </div>
//       <div>
//         <label>Description</label>
//         <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
//       </div>
//       <button type="button" onClick={handleAddLanguage}>Add Language</button>

//       <h3>Added Languages</h3>
//       <ul>
//         {languageData.map((lang, index) => (
//           <li key={index}>{lang.language}: {lang.title} - {lang.description}</li>
//         ))}
//       </ul>

//       <div>
//         <label>Image</label>
//         <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
//       </div>
//       <div>
//         <label>Status</label>
//         <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} />
//       </div>
//       <button type="submit">Create Crop Category</button>
//     </form>
//   );
// };

// export default CropCategoryForm;
