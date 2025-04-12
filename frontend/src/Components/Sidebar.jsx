import { NavLink } from "react-router-dom";
import { LogOut, LayoutDashboard, Settings, BarChart2, Activity } from "lucide-react";
import { AuthStore } from "../Store/AuthStore";
import AnimatedBox from "../assets/AnimatedBox";

export default function Sidebar() {

  const {user, logout } = AuthStore();

  return (
    <div className="h-screen z-[999] fixed w-40 sm:w-52 bg-white dark:bg-[#0a101d] shadow-lg flex flex-col justify-between">
      {/* Top section - Logo */}
      <div>
        <div className="p-6 flex items-center border-b bg-[#FAF9F6]">
            <AnimatedBox className="max-w-lg text-lg  text-gray-800">
        <img
            src="/ChatGPT Image Apr 6, 2025, 10_17_12 PM.png"
            className="w-36"
            alt="Logo"
            />
            </AnimatedBox>
        </div>

        {/* Navigation */}

        <nav className="mt-6 flex flex-col gap-2 px-4">
          <NavItem to="/" icon={<BarChart2 size={18} />} label="Dashboard" />
          <NavItem to="/projects" icon={<LayoutDashboard size={18} />} label="Projects" />
          <NavItem to="/sdk" icon={<Activity size={18} />} label="SDK" />
          <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>
      

      </div>

      {/* Bottom - User info */}
      <div className="p-4 border-t">
    
        <NavLink to='/settings'  className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium dark:text-white text-gray-800">{user.name}</p>
            <p className="text-xs hidden sm:block dark:text-gray-400 text-gray-500">{user.email}</p>
          </div>
        </NavLink>
        <button onClick={()=>{logout()}} className="mt-4 flex items-center gap-2 text-sm dark:text-gray-300 text-gray-500 hover:text-red-500">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm ${
          isActive
            ? "bg-blue-100 text-blue-600"
            : "text-gray-700 dark:text-white hover:bg-gray-900 hover:text-gray-500"
        }`
      }
    >
      {icon} {label}
    </NavLink>
  );
}
