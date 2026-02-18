import React, { useState, useEffect } from "react";
import "./HomePage.css";

const HomePageContent = () => {
  const [student, setStudent] = useState(null);
  const [events, setEvents] = useState([]);
  const [labs, setLabs] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);

  const [formData, setFormData] = useState({
    event_id: "",
    special_lab_id: "",
    items: [{ material_id: "", quantity: "" }],
  });

  // 🔹 Fetch Initial Data
  useEffect(() => {
    const studentId = 2; // later get from JWT

    fetch(`http://localhost:5000/api/form/students/${studentId}`)
      .then((res) => res.json())
      .then((data) => setStudent(data));

    fetch("http://localhost:5000/api/form/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));

    fetch("http://localhost:5000/api/form/labs")
      .then((res) => res.json())
      .then((data) => setLabs(data));

    fetch("http://localhost:5000/api/form/materials")
      .then((res) => res.json())
      .then((data) => setMaterialsList(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { material_id: "", quantity: "" }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.event_id || !formData.special_lab_id) {
      alert("Please select event and lab");
      return;
    }

    for (let item of formData.items) {
      if (!item.material_id || !item.quantity) {
        alert("Please select material and quantity");
        return;
      }
    }

    const payload = {
      student_id: student.student_id,
      special_lab_id: Number(formData.special_lab_id),
      event_id: Number(formData.event_id),
      materials: formData.items.map((item) => ({
        material_id: Number(item.material_id),
        quantity: Number(item.quantity),
      })),
    };
    console.log(payload);

    try {
      const response = await fetch(
        "http://localhost:5000/api/requests/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        alert("Request submitted successfully!");
      } else {
        alert("Error submitting request");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!student) return <h3>Loading...</h3>;

  return (
    <div className="form-page">
      <form className="material-form" onSubmit={handleSubmit}>
        <h2>Materials Request Form</h2>

        {/* Student Info (Read Only) */}
        <div className="grid-form">
          <div className="form-group">
            <label>Name</label>
            <input value={student.name} disabled />
          </div>

          <div className="form-group">
            <label>Register Number</label>
            <input value={student.reg_no} disabled />
          </div>
        </div>

        {/* Event Dropdown */}
        <div className="form-group">
          <label>Event</label>
          <select
            name="event_id"
            value={formData.event_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        {/* Lab Dropdown */}
        <div className="form-group">
          <label>Special Lab</label>
          <select
            name="special_lab_id"
            value={formData.special_lab_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Lab</option>
            {labs.map((lab) => (
              <option key={lab.speciallab_id} value={lab.speciallab_id}>
                {lab.name}
              </option>
            ))}
          </select>
        </div>

        {/* Materials */}
        <h3>Requested Items</h3>

        {formData.items.map((item, index) => (
          <div className="item-row" key={index}>
            <select
              value={item.material_id}
              onChange={(e) =>
                handleItemChange(index, "material_id", e.target.value)
              }
              required
            >
              <option value="">Select Material</option>
              {Array.isArray(materialsList) &&
                materialsList.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
            </select>

            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              required
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

        <button type="submit" className="submit-btn">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default HomePageContent;
