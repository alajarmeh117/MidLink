import React from "react";
import Sidebar from "../AdminPages/sidebar";
import Cards from "./Cards";

const AdminHome = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <Cards />
      </div>
    </div>
  );
};

export default AdminHome;
