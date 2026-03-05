import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { authFetch } from "../../authFetch";

const HomePageContent = () => {
  const [student, setStudent] = useState(null);
  const [events, setEvents] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    event_id: "",
    items: [{ material_id: "", quantity: "" }],
  });

  /* ================= FETCH INITIAL DATA ================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get logged-in student from JWT
        const studentRes = await authFetch("/form/student");
        if (!studentRes) return;
        const studentData = await studentRes.json();
        setStudent(studentData);

        const eventsRes = await authFetch("/form/events");
        if (!eventsRes) return;
        setEvents(await eventsRes.json());

        const materialsRes = await authFetch("/form/materials");
        if (!materialsRes) return;
        setMaterialsList(await materialsRes.json());
      } catch (error) {
        console.error("Error loading form data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ================= FORM HANDLERS ================= */

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

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.event_id) {
      alert("Please select an event");
      return;
    }

    for (let item of formData.items) {
      if (!item.material_id || !item.quantity) {
        alert("Please select material and quantity");
        return;
      }
    }

    // DO NOT send student_id (JWT handles identity)
    const payload = {
      special_lab_id: student.speciallab_id,
      event_id: Number(formData.event_id),
      materials: formData.items.map((item) => ({
        material_id: Number(item.material_id),
        quantity: Number(item.quantity),
      })),
    };

    try {
      const response = await authFetch("/requests/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response) return;

      if (response.ok) {
        alert("Request submitted successfully!");
        setFormData({
          event_id: "",
          items: [{ material_id: "", quantity: "" }],
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error submitting request");
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  if (loading) return <h3>Loading...</h3>;
  if (!student) return <h3>Student not found</h3>;

  /* ================= UI ================= */

  return (
    <div className="form-page">
      <form className="material-form" onSubmit={handleSubmit}>
        <h2>Materials Request Form</h2>

        {/* Student Info */}
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

        {/* Special Lab */}
        <div className="form-group">
          <label>Special Lab</label>
          <input value={student.special_lab_name} disabled />
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
              {materialsList.map((material) => (
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
