import React from "react";
import Sidebar from "../components/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full flex bg-gray-900">
      <Sidebar />
      {children}
    </div>
  );
};

export default layout;
