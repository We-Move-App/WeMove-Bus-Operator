import React, { useState } from "react";
import { Plus } from "lucide-react";
import "./edit-route.css";

const EditRouteDetails = () => {
  const [formData, setFormData] = useState({
    busRegistrationNumber: "DU0978-7898",
    departure: "Hola Road",
    departureTime: "06.00 AM",
    arrival: "Cameroon",
    arrivalTime: "06.00 AM",
  });

  const [pickupPoints] = useState([
    { id: 1, name: "Cameroon" },
    { id: 2, name: "Bangalore" },
    { id: 3, name: "Chennai" },
    { id: 4, name: "Hyderabad" },
    { id: 5, name: "Pondicherry" },
  ]);

  const [dropPoints] = useState([
    { id: 1, name: "Cameroon" },
    { id: 2, name: "Bangalore" },
    { id: 3, name: "Chennai" },
    { id: 4, name: "Hyderabad" },
    { id: 5, name: "Pondicherry" },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPickup = () => {
    console.log("Add pickup point");
  };

  const handleAddDropOff = () => {
    console.log("Add drop off point");
  };

  const handleEdit = (type, id) => {
    console.log(`Edit ${type} with id ${id}`);
  };

  const handleSaveDetails = () => {
    console.log("Save details", formData);
  };

  return (
    <div className="route-management-container">
      <div className="route-management-header">
        <h1>Route Management &gt; Edit</h1>
      </div>

      <div className="form-container">
        <div className="form-section">
          <label className="form-label">Bus Registration Number</label>
          <input
            type="text"
            name="busRegistrationNumber"
            value={formData.busRegistrationNumber}
            onChange={handleInputChange}
            className="form-input full-width"
          />
        </div>

        <div className="form-row">
          <div className="form-section">
            <label className="form-label">Departure</label>
            <input
              type="text"
              name="departure"
              value={formData.departure}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-section">
            <label className="form-label">Departure time</label>
            <input
              type="text"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label className="form-label">Arrival</label>
            <input
              type="text"
              name="arrival"
              value={formData.arrival}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-section">
            <label className="form-label">Arrival time</label>
            <input
              type="text"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="points-row">
          <div className="points-section">
            <div className="points-header">
              <h3>List of Pickup Points</h3>
              <button className="add-button" onClick={handleAddPickup}>
                <Plus size={16} />
                Add Pickup
              </button>
            </div>
            <div className="points-list">
              {pickupPoints.map((point) => (
                <div key={point.id} className="point-item">
                  <span className="point-name">{point.name}</span>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit("pickup", point.id)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="points-section">
            <div className="points-header">
              <h3>Choose Drop Points</h3>
              <button className="add-button" onClick={handleAddDropOff}>
                <Plus size={16} />
                Add DropOff
              </button>
            </div>
            <div className="points-list">
              {dropPoints.map((point) => (
                <div key={point.id} className="point-item">
                  <span className="point-name">{point.name}</span>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit("drop", point.id)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="save-section">
          <button className="save-button" onClick={handleSaveDetails}>
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRouteDetails;
