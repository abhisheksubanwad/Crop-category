import "./CropCategoryList.css";
import React, { useState, useEffect } from "react";

const CropCategoryList = () => {
  const [cropCategories, setCropCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [language, setLanguage] = useState(""); // Default empty, meaning no language filter
  const [selectedCropCategory, setSelectedCropCategory] = useState(null); // For selected crop category to update
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [newImage, setNewImage] = useState(null); // For new image file
 
const BASE_URL ='https://localhost:7282'

  useEffect(() => {
    fetchCropCategories();
  }, [pageNumber, pageSize, language]);

  const fetchCropCategories = async () => {
    try {
      const url = `https://localhost:7282/api/CropCategory/GetCropCategoryLanguage?language=${language}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
  
      // Check if the response body is empty or not
      const data = await response.text(); // Get the response as plain text first
  
      // If the response is not empty, parse it as JSON
      const parsedData = data ? JSON.parse(data) : { result: [] }; 
  
      setCropCategories(parsedData.result || []);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  

  const handleNextPage = () => setPageNumber((prev) => prev + 1);
  const handlePrevPage = () => setPageNumber((prev) => (prev > 1 ? prev - 1 : 1));

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value); // Update language state based on user input
  };

  const openModal = (crop) => {
    setSelectedCropCategory(crop);
    setNewImage(null); // Reset image state when opening modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCropCategory(null);
  };
  
  const handleUpdate = async (updatedData) => {
    try {
      const formData = new FormData();
      formData.append("Title", selectedCropCategory.title);
      formData.append("Description", selectedCropCategory.description);
      formData.append("Status", selectedCropCategory.status);
      
      if (newImage) {
        formData.append("ImageUrl", newImage);
      }
      console.log("ID", selectedCropCategory.cropCategoryLanguageID)
      const response = await fetch(`https://localhost:7282/api/CropCategory/${selectedCropCategory.cropCategoryLanguageID}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP error!", response.status, errorText);
        setError(`HTTP error! Status: ${response.status} - ${errorText}`);
          return;
       }

        console.log('response', response)
      const data = await response.json();
      console.log('data', data)
      if (data.isSuccess) {
        alert("Update successful!");
        closeModal();
        fetchCropCategories(); // Reload the data after update
      } else {
        alert(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Delete function
  const deleteCropCategory = async (cropCategoryId, cropCategoryLanguageId) => {
    try {
      // Construct query parameters dynamically based on available ID
      const params = new URLSearchParams();
      if (cropCategoryId) params.append("cropCategoryId", cropCategoryId);
      if (cropCategoryLanguageId) params.append("cropCategoryLanguageId", cropCategoryLanguageId);

      const response = await fetch(
        `https://localhost:7282/api/CropCategory?${params.toString()}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.isSuccess) {
        alert("Deletion successful!");
        // Remove deleted category from state
        setCropCategories(
          cropCategories.filter(
            (crop) => crop.cropCategoryLanguageID !== cropCategoryLanguageId
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading crop categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="crop-list-container">
      <h2>All Crop Categories</h2>

      {/* Language filter input */}
      <div>
        <label htmlFor="languageFilter">Filter by Language: </label>
        <input
          type="text"
          id="languageFilter"
          value={language}
          onChange={handleLanguageChange}
          placeholder="Enter language code (e.g., EN, MR, HI)"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Actions</th> {/* Add Actions header */}
          </tr>
        </thead>
        <tbody>
          {cropCategories.map((crop) => (
            <tr key={crop.cropCategoryLanguageID}>
              <td>{crop.title}</td>
              <td>{crop.description}</td>
              <td>
                {crop.imageUrl ? (
                  <img                 src={
                  crop.imageUrl
                    ? `${BASE_URL}${crop.imageUrl}`
                    : "placeholder-image-url"
                } alt={crop.title} width="50" />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td>{crop.status !== undefined ? (crop.status ? "Active" : "Inactive") : "Unknown"}</td>
              <td>{crop.createdDate ? new Date(crop.createdDate).toLocaleDateString() : "Invalid Date"}</td>
              <td>
                <button
                  onClick={() => openModal(crop)} // Open modal on button click
                  className="update-button"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteCropCategory(crop.cropCategoryID, crop.cropCategoryLanguageID)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={pageNumber === 1}>
          Previous
        </button>
        <button onClick={handleNextPage}>Next</button>
      </div>

      {/* Modal for updating Crop Category */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Crop Category</h3>
            <label>
              Title:
              <input
                type="text"
                defaultValue={selectedCropCategory.title}
                onChange={(e) => setSelectedCropCategory({ ...selectedCropCategory, title: e.target.value })}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                defaultValue={selectedCropCategory.description}
                onChange={(e) => setSelectedCropCategory({ ...selectedCropCategory, description: e.target.value })}
              />
            </label>
            <label>
              Status:
              <select
                defaultValue={selectedCropCategory.status ? "Active" : "Inactive"}
                onChange={(e) => setSelectedCropCategory({ ...selectedCropCategory, status: e.target.value === "Active" })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            <label>
              Image:
              <input
                type="file"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
              <span>{selectedCropCategory.imageUrl ? `Current Image: ${selectedCropCategory.imageUrl}` : "No image uploaded"}</span>
            </label>
            <button onClick={() => handleUpdate(new FormData())}>Save</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropCategoryList;
