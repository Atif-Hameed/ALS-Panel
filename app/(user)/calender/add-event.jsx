"use client";
import React, { useEffect, useState, useMemo } from "react";
import CustomInput from "../../Components/common/custom-input";
import Button from "../../Components/common/custom-button";
import CustomSelector from "../../Components/common/custom-selector";
import { API_BASE_URL } from "../../api";
import toast from "react-hot-toast";

const AddEvent = ({ userId, onClose, setFetchData, edit }) => {
  const [formData, setFormData] = useState({
    eventName: "",
    referralName: "",
    date: "",
    status: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [toastMessage, setToastMessage] = useState({ message: "", type: "" });

  // Prefill form data if edit data is passed
  useEffect(() => {
    if (edit) {
      setFormData({
        eventName: edit.eventName || "",
        referralName: edit.referralName || "",
        date: edit.date || "",
        status: edit.status || "",
        email: edit.email || "",
      });
    }
  }, [edit]);

  useEffect(() => {
    if (toastMessage.message) {
      if (toastMessage.type === "success") {
        toast.success(toastMessage.message);
      } else if (toastMessage.type === "error") {
        toast.error(toastMessage.message);
      }
    }
  }, [toastMessage]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/agents/get-agents/${userId}`
        );
        const data = await response.json();
        setAgents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setAgents([]); // fallback to empty array
      }
    };

    fetchAgents();
  }, [userId]);

  const handleChange = (e, name) => {
    if (e && name) {
      setFormData((prev) => ({ ...prev, [name]: e }));
    }
    if (e) {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFetchData(true);

    const method = edit ? "PUT" : "POST";
    const url = edit
      ? `${API_BASE_URL}/calender/calendar-event-edit/${edit._id}`
      : `${API_BASE_URL}/calender/create`;

    try {
      const body = {
        userId: userId,
        eventName: formData.eventName,
        referralName: formData.referralName,
        date: formData.date,
        email: formData.email,
      };

      if (formData.status && formData.status !== "") {
        body.status = formData.status;
      }

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      console.log("data:", data); // Log the response data
      console.log("Response data:", response); // Log the response data

      if (response.ok) {
        // ✅ Single toast message (avoids duplicates)
        const message = edit
          ? "Event updated successfully"
          : "Event created successfully";

        setToastMessage({
          message,
          type: "success",
        });
        // Reset form and close modal
        setFormData({
          eventName: "",
          referralName: "",
          date: "",
          status: "",
          email: "",
        });

        onClose(); // Close modal immediately (no delay needed)
      } else {
        setToastMessage({
          message: data.message || "Failed to save event",
          type: "error",
        });
      }
    } catch (error) {
      setToastMessage({
        message: data.message || "Failed to save event",
        type: "error",
      });
    } finally {
      setLoading(false);
      setFetchData(false);
    }
  };

  const statusOptions = [
    { label: "open", value: "open" },
    { label: "close", value: "close" },
  ];

  return (
    <div className="w-full">
      <div className="py-2 font-semibold text-xl text-center">
        {edit ? "Edit Event" : "Add Event"}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full my-4">
        <CustomInput
          placeholder={"Event Name"}
          name={"eventName"}
          inputType={"text"}
          onChange={handleChange}
          value={formData.eventName}
        />
        <CustomInput
          placeholder={"Referral Name"}
          name={"referralName"}
          inputType={"text"}
          value={formData.referralName}
          onChange={handleChange}
        />
        <select
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="py-3 border-b "
        >
          <option value="">Email</option>
          {Array.isArray(agents) &&
            agents.map((agent) => (
              <option key={agent._id} value={agent.email}>
                {agent.email}
              </option>
            ))}
        </select>
        <CustomInput
          placeholder={"Date"}
          name={"date"}
          inputType={"date"}
          value={formData.date}
          onChange={handleChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={(e) => {
            setIsFocused(true);
            e.target.showPicker?.(); // 👉 triggers the date picker on focus
          }}
        />

        <CustomSelector
          name="status"
          options={statusOptions}
          placeholder="Status"
          value={formData.status}
          onChange={(value) => handleChange(value, "status")}
        />

        <div>
          <Button
            type="submit"
            label={edit ? "Update" : "Submit"}
            className="bg-dark text-white !px-4 py-2 rounded-xl"
            loading={loading}
            loadingLabel={edit ? "Updating..." : "Submitting..."}
          />
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
