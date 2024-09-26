

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Camera,
  Stethoscope,
  Save,
  User,
  Mail,
  Key,
  BookOpen,
  PenTool,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getDoctorProfile,
  updateDoctorProfile,
  updateDoctorProfileImage,
} from "../../store/doctorSlice";

const DoctorProfileEditPage = () => {
  const dispatch = useDispatch();
  const { profile, error, loading } = useSelector((state) => state.doctor);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [localImageUrl, setLocalImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(getDoctorProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.staff_name || "");
      setEmail(profile.email || "");
      setSpecialty(profile.specialty || "");
      setBio(profile.bio || "");
      setProfileImage(profile.profile_image || null);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateDoctorProfile({
          staff_name: name,
          email,
          password,
          specialty,
          bio,
        })
      ).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setPassword("");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again later.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const localUrl = URL.createObjectURL(file);
        setLocalImageUrl(localUrl);

        const result = await dispatch(updateDoctorProfileImage(file)).unwrap();

        setProfileImage(result.profile_image);
        toast.success("Profile image updated successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to update profile image. Please try again later.");
        setLocalImageUrl(null);
      }
    }
  };

  const getCurrentImageUrl = () => {
    if (localImageUrl) {
      return localImageUrl;
    } else if (profileImage) {
      return `http://localhost:5000/${profileImage}`;
    }
    return "https://via.placeholder.com/150";
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-white mt-20 min-h-screen p-6 font-serif">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="bg-[#04333a] p-8 md:w-1/3">
              <Link
                to="/home"
                className="text-white hover:text-[#e6f0f5] mb-8 inline-block transition-colors"
              >
                <ArrowLeft size={24} />
              </Link>
              <div className="relative mb-8">
                <img
                  src={getCurrentImageUrl()}
                  alt="Profile"
                  className="w-48 h-48 mx-auto rounded-full object-cover border-4 border-[#e6f0f5] transition-all duration-300 hover:scale-105"
                />
                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-0 right-1/4 bg-[#e6f0f5] text-[#04333a] p-3 rounded-full hover:bg-white hover:text-[#04333a] transition-colors cursor-pointer"
                >
                  <Camera size={24} />
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-4">
                {name}
              </h2>
              <p className="text-[#e6f0f5] text-center mb-8">{specialty}</p>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full py-2 px-4 bg-[#e6f0f5] text-[#04333a] rounded-full font-bold hover:bg-white transition-colors flex items-center justify-center"
              >
                {isEditing ? (
                  <Save className="mr-2" size={20} />
                ) : (
                  <PenTool className="mr-2" size={20} />
                )}
                {isEditing ? "Save Profile" : "Edit Profile"}
              </button>
            </div>
            <div className="p-8 md:w-2/3">
              <h1 className="text-3xl font-bold text-[#04333a] mb-8">
                Doctor Profile
              </h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-4">
                  <User size={24} className="text-[#04333a]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-grow px-4 py-2 border-b-2 border-[#e6f0f5] focus:border-[#04333a] outline-none transition-colors"
                    placeholder="Full Name"
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Mail size={24} className="text-[#04333a]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-4 py-2 border-b-2 border-[#e6f0f5] focus:border-[#04333a] outline-none transition-colors"
                    placeholder="Email Address"
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Stethoscope size={24} className="text-[#04333a]" />
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="flex-grow px-4 py-2 border-b-2 border-[#e6f0f5] focus:border-[#04333a] outline-none transition-colors"
                    placeholder="Specialty"
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Key size={24} className="text-[#04333a]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-grow px-4 py-2 border-b-2 border-[#e6f0f5] focus:border-[#04333a] outline-none transition-colors"
                    placeholder="New Password"
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-start space-x-4">
                  <BookOpen size={24} className="text-[#04333a] mt-2" />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="flex-grow px-4 py-2 border-2 border-[#e6f0f5] focus:border-[#04333a] outline-none transition-colors rounded-md"
                    placeholder="Bio"
                    rows="4"
                    disabled={!isEditing}
                  ></textarea>
                </div>
                {isEditing && (
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-[#04333a] text-[#04333a] rounded-full hover:bg-[#04333a] hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#04333a] text-white rounded-full hover:bg-[#e6f0f5] hover:text-[#04333a] transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorProfileEditPage;
