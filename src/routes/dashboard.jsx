import React from "react";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Sidebar from "../components/common/sidebar";
import { Link, Outlet } from "react-router-dom";




const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      
      <div className="flex flex-1">
        <Sidebar />

        
        <main className="flex-1 p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
