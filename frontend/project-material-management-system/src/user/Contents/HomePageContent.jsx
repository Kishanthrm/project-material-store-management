import React, { useState } from "react";
import "./HomePage.css";

const HomePageContent = () => {
  const [formData, setFormData] = useState({
    name: "",
    registerNumber: "",
    department: "",
    year: "",
    eventName: "",
    labName: "",
    labInchargeId: "",
    labInchargeName: "",
    items: [{ itemName: "", quantity: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemName: "", quantity: "" }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="form-page">
      <form className="material-form" onSubmit={handleSubmit}>
        <h2>Materials Request Form</h2>

        {/* Two-column layout */}
        <div className="grid-form">
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Register Number</label>
            <input
              name="registerNumber"
              value={formData.registerNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Year</label>
            <input name="year" value={formData.year} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Event Name</label>
            <input
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Special Lab Name</label>
            <input
              name="labName"
              value={formData.labName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Lab Incharge ID</label>
            <input
              name="labInchargeId"
              value={formData.labInchargeId}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Lab Incharge Name</label>
            <input
              name="labInchargeName"
              value={formData.labInchargeName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Items */}
        <h3 className="section-title">Requested Items</h3>

        {formData.items.map((item, index) => (
          <div className="item-row" key={index}>
            <input
              placeholder="Item Name"
              value={item.itemName}
              onChange={(e) =>
                handleItemChange(index, "itemName", e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
            />

            {formData.items.length > 1 && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeItem(index)}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button type="button" className="add-btn" onClick={addItem}>
          + Add Item
        </button>

        <button className="submit-btn" type="submit">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default HomePageContent;
