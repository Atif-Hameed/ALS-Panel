"use client";
import React, { useEffect, useState } from "react";
import CustomInput from "../../Components/common/custom-input";
import Button from "../../Components/common/custom-button";
import { inviteAgent } from "../../actions/agent.action";
import toast from "react-hot-toast";
import { useUserDetails } from "../../hooks/useUser";
import CustomSelector from "../../Components/common/custom-selector";

const AddReferal = ({ handleAddReferal, fetchReferalData }) => {
  const [userId, setUserId] = useState(null);
  const { data: user } = useUserDetails(userId);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    customTitle: "",
    referBy: "",
    status: "INVITED",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      setFormData((prev) => ({
        ...prev,
        referBy: user._id,
      }));
    }
  }, [user?._id]);

  const [showCustomTitleInput, setShowCustomTitleInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e, name) => {
    // Handle select input changes
    if (e && name) {
      if (name === "title" && e === "--Write My Own--") {
        setShowCustomTitleInput(true);
        setFormData((prev) => ({ ...prev, [name]: "", customTitle: "" }));
      } else if (name === "title") {
        setShowCustomTitleInput(false);
        setFormData((prev) => ({ ...prev, [name]: e, customTitle: "" }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: e }));
      }
      return;
    }

    // Handle regular input changes
    if (e) {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(formData)

    // Determine the final title to use
    const finalTitle = showCustomTitleInput
      ? formData.customTitle
      : formData.title;

    // Form validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (formData.email === user.email) {
      toast.error("You cannot invite yourself");
      return;
    }
    // Simple email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }
    if (!finalTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await inviteAgent({
        ...formData,
        title: finalTitle,
      });

      if (data) {
        toast.success("Invitation sent successfully!");
        setFormData({
          name: "",
          email: "",
          title: "",
          customTitle: "",
          referBy: user?._id,
        });
        setShowCustomTitleInput(false);
        handleAddReferal();
        fetchReferalData();
      }
      if (error) {
        toast.error(error || "Unable to send invite, please try again!");
        console.log(error);
      }
    } catch (error) {
      toast.error(error.message || "Unknown Error, please try again!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const titleOptions = [
    { label: "Agent", value: "Agent" },
    { label: "Broker", value: "Broker" },
    { label: "Realtor", value: "Realtor" },
    { label: "Landlord", value: "Landlord" },
    { label: "Property Owner", value: "Property Owner" },
    { label: "Property Manager", value: "Property Manager" },
    { label: "Listing Agent", value: "Listing Agent" },
    { label: "Seller's Agent", value: "Seller's Agent" },
    { label: "Building Manager", value: "Building Manager" },
    { label: "Commercial Broker", value: "Commercial Broker" },
    { label: "Commercial Agent", value: "Commercial Agent" },
    { label: "Developer", value: "Developer" },
    { label: "Builder", value: "Builder" },
    { label: "Architect", value: "Architect" },
    // { label: "--Write My Own--", value: "--Write My Own--" },
  ];

  return (
    <div className="w-full">
      <div className="py-2 font-semibold text-xl text-center">Add Referral</div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full my-4">
        <CustomInput
          placeholder={"Name"}
          name={"name"}
          inputType={"text"}
          onChange={handleChange}
          value={formData.name}
        />
        <CustomInput
          placeholder={"Email"}
          name={"email"}
          inputType={"email"}
          value={formData.email}
          onChange={handleChange}
        />

        <CustomSelector
          name="title"
          options={titleOptions}
          placeholder="Select Title"
          value={formData.title}
          onChange={(value) => handleChange(value, "title")}
        />

        {showCustomTitleInput && (
          <CustomInput
            placeholder={"Enter your custom title"}
            name={"customTitle"}
            inputType={"text"}
            value={formData.customTitle}
            onChange={handleChange}
            autoFocus
          />
        )}

        <div>
          <Button
            type="submit"
            label="Send Invite"
            className="bg-dark text-white !px-4 py-2 rounded-xl"
            loading={loading}
            loadingLabel="Sending..."
          />
        </div>
      </form>
    </div>
  );
};

export default AddReferal;
