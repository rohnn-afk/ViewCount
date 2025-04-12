import React, { useEffect, useState } from "react";
import ThemeToggle from "../assets/ThemeToggle";
import {
  Eye,
  Users,
  Star,
  TrendingDown,
  BarChart as BarChartIcon,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { axiosInstance } from "../lib/Axios";
import AddProjectModal from "../Components/NewProjectModal";

const chartTypes = {
  views: { label: "Total Views", icon: <Eye size={20} />, key: "views" },
  visitors: {
    label: "Unique Visitors",
    icon: <Users size={20} />,
    key: "visitors",
  },
  bounceRates: {
    label: "Bounce Rate",
    icon: <TrendingDown size={20} />,
    key: "bounceRates",
  },
  topPages: { label: "Top Page", icon: <Star size={20} />, key: "topPages" },
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7");
  const [activeChart, setActiveChart] = useState("views");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/analytics/overview?range=${timeRange}`
        );
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching overview", err);
      }
    };

    fetchOverview();
  }, [timeRange]);

  if (loading || !data) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black">
        <div className="sm:ml-56 ml-44 text-black dark:text-white animate-spin">
          <Loader2 size={20} />
        </div>
      </div>
    );
  }

  const getChartDataKey = () => {
    switch (activeChart) {
      case "views":
      case "visitors":
        return "count";
      case "bounceRates":
        return "rate";
      case "topPages":
        return "count";
      default:
        return "count";
    }
  };

  const tickStyle = {
    fill: "#999999", // light-gray for dark mode, dark-gray for light mode
    fontSize: 12,
  };

  return (
    <div className="h-screen w-full flex bg-gray-50 dark:bg-[#0b1120]  sm:pl-56 pl-44 justify-end overflow-y-auto hide-scrollbar">
    <div className="flex-1 px-4 sm:px-6 lg:px-10 pb-6 min-h-screen relative w-full space-y-6">
      {/* Floating Theme Toggle */}
      <div className="fixed right-4 bottom-4 z-50">
        <div className="bg-white dark:bg-zinc-800 p-2 rounded-full shadow-xl">
          <ThemeToggle />
        </div>
      </div>
  
      {/* Header */}
      <div className="flex items-center justify-between pt-6 px-2 sm:px-0">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-gray-800">Overview</h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">
            Here's how your websites are performing.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg text-sm font-medium transition"
        >
          + New Project
        </button>
      </div>
  
      {/* Modal */}
      <AddProjectModal isOpen={showModal} setIsOpen={setShowModal} />
  
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Object.entries(chartTypes).map(([key, { icon, label }]) => (
          <MetricCard
            key={key}
            icon={icon}
            label={label}
            value={
              key === "views"
                ? data.totalViews
                : key === "visitors"
                ? data.uniqueVisitors
                : key === "topPages"
                ? data.topPage || "N/A"
                : data.bounceRate
            }
            active={activeChart === key}
            onClick={() => setActiveChart(key)}
          />
        ))}
      </div>
  
      {/* Chart Section */}
      <div className="bg-white dark:bg-zinc-950 shadow-xl rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-800">
              Event Analytics
            </h2>
            <TimeRangeDropdown value={timeRange} setValue={setTimeRange} />
          </div>
          <BarChartIcon size={20} className="text-gray-400 dark:text-gray-500" />
        </div>
  
        <div className="h-64 w-full">
          {data.charts[activeChart]?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts[activeChart]} barGap={4}>
                <XAxis
                  dataKey="date"
                  tick={tickStyle}
                  axisLine
                  tickLine={false}
                />
                <YAxis
                  tick={tickStyle}
                  axisLine
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(37, 99, 235, 0.1)" }}
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <div className="bg-black text-white p-3 rounded-lg shadow-lg text-sm">
                        <p className="font-semibold">{label}</p>
                        <p>{payload[0].value} events</p>
                      </div>
                    ) : null
                  }
                />
                <Bar
                  dataKey={getChartDataKey()}
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                  isAnimationActive
                  animationDuration={800}
                  shape={(props) => {
                    const { x, y, width, height, state } = props;
                    const isHovered = state?.isTooltipActive;
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        rx={8}
                        ry={8}
                        fill={isHovered ? "#1d4ed8" : "#2563eb"}
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-400 text-sm flex items-center justify-center h-full">
              No chart data yet.
            </div>
          )}
        </div>
      </div>
  
      {/* Recent Events */}
      <div className="bg-white dark:bg-zinc-950 shadow-xl rounded-2xl p-6">
        <h2 className="text-lg font-semibold dark:text-gray-300 text-gray-800 mb-4">
          Recent Events
        </h2>
        <ul className="space-y-4 text-sm text-gray-800 dark:text-gray-300 pr-1">
          {data.recentEvents.map((event, index) => (
            <li
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 bg-gray-50 dark:bg-zinc-900">
                {/* Left Side */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {event.eventType}
                  </h3>
                  <div className="flex flex-wrap text-sm text-blue-600 dark:text-blue-400 break-all max-w-full">
                    <span className="font-medium mr-1">URL:</span>
                    <span className="underline">{event.url}</span>
                  </div>
                </div>
                {/* Timestamp */}
                <div className="text-sm text-gray-500 dark:text-gray-400 text-right sm:text-left">
                  {formatTimeAgo(event.timestamp)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  
  );
};

function MetricCard({ icon, label, value, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white dark:bg-black rounded-2xl hover:scale-105 shadow-xl p-6 flex items-center gap-4 transition border ${
        active ? "border-blue-500" : "border-transparent"
      }`}
    >
      <div className="bg-blue-100 text-blue-600 rounded-full p-3">{icon}</div>
      <div>
        <p className="text-sm dark:text-gray-100 text-gray-500">{label}</p>
        <p className="text-lg font-bold dark:text-gray-300 text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function formatTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date.getTime()) / 60000); // in minutes
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff} min ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} hr ago`;
  return date.toLocaleDateString();
}

const TimeRangeDropdown = ({ value, setValue }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = React.useRef();

  const options = [
    { label: "Last 7 Days", value: "7" },
    { label: "Last 30 Days", value: "30" },
    { label: "Last 90 Days", value: "90" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-44 text-sm" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center dark:bg-zinc-800 bg-white dark:text-white border border-gray-300 rounded-xl px-4 py-1 shadow-sm hover:border-gray-400 transition"
      >
        {options.find((o) => o.value === value)?.label}
        <svg
          className="w-4 h-4 ml-2 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                setValue(opt.value);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition ${
                value === opt.value
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : ""
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
