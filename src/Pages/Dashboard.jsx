import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Core/Dashboard/Sidebar";

const Dashboard = () => {
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] mt-14">
      <Sidebar />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-7xl py-8 px-4 text-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
