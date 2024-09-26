import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../AdminPages/sidebar';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    gender: '',
    dob: '',
    profile_image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/patients', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Swal.fire({
        title: 'Success!',
        text: 'Patient added successfully',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        setFormData({
          username: '',
          email: '',
          password: '',
          gender: '',
          dob: '',
          profile_image: null,
        });
        navigate('/AdminDashboard/add-patient');
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add patient',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 bg-gradient-to-b from-[#f6f5f2] to-white">
        <div className="max-w-md ml-[36rem] bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#04333a]">Add New Patient</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#04333a] focus:border-[#04333a]" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#04333a] focus:border-[#04333a]" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#04333a] focus:border-[#04333a]" required />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#04333a] focus:border-[#04333a]" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#04333a] focus:border-[#04333a]" required />
            </div>
            <div>
              <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700">Profile Image</label>
              <input type="file" id="profile_image" name="profile_image" onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#04333a] focus:border-[#04333a]" accept="image/*" />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#04333a] hover:bg-[#2c565c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#04333a]">
              Add Patient
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;
