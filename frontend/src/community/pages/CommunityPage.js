import React from "react";
import { Outlet } from "react-router-dom";

const CommunityPage = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CommunityPage;
