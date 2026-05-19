// import React from "react";
// import Sidebar from "./components/Sidebar";

// const DoctorHome = () => {
//   return (
//     <>
//       <div className="bg-[#f6f5f2]">
//         <Sidebar />
//       </div>
//     </>
//   );
// };

// export default DoctorHome;

import React from "react";
import Sidebar from "./components/Sidebar";

const DoctorHome = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans overflow-hidden">
      {/* Sidebar Section */}
      <Sidebar />

      {/* Main Content Area with Smooth Fade-in Animation */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto animate-[fadeIn_0.5s_ease-in-out]">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Animated Welcome Banner */}
          <div className="bg-[#0f4c5c] rounded-[2rem] p-8 md:p-10 text-white shadow-xl relative overflow-hidden transition-transform hover:scale-[1.01] duration-300">
            {/* Text Content */}
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
                Welcome to MidLink Workspace
              </h1>
              <p className="text-teal-100 text-lg max-w-2xl">
                Select an option from the sidebar to manage your schedule, view
                patient records, and update your profile seamlessly.
              </p>
            </div>

            {/* Decorative Animations */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#2dd4bf] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-32 -mb-10 w-40 h-40 bg-teal-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 delay-75"></div>
          </div>

          {/* هون بتقدر تعمل Render لباقي محتوى الصفحة أو الـ Outlet 
            إذا كنت بتستخدم Nested Routes
          */}
        </div>
      </main>

      {/* Custom Keyframes for Fade-in (Added directly to handle missing tailwind config if any) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default DoctorHome;
