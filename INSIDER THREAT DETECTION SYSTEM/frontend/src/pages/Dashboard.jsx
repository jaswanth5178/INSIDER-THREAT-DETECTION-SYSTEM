import { useNavigate, useLocation } from "react-router-dom"; 
import { useEffect, useState } from "react";
import api from "../utils/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [employees, setEmployees] = useState([]);
  const [blockedList, setBlockedList] = useState([]); // ✅ NEW
  const [liveIndex, setLiveIndex] = useState(() => {
  const saved = localStorage.getItem("liveIndex");
  return saved ? parseInt(saved) : 0;
});
  const [search, setSearch] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "light" ? false : true;
});
 useEffect(() => {
    localStorage.setItem("liveIndex", liveIndex);
  }, [liveIndex]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

useEffect(() => {
  let mounted = true;

  const load = async () => {
    try {
      const [res1, res2] = await Promise.all([
        api.get("/api/anomalies"),
        api.get("/api/blocked"),
      ]);

      if (mounted) {
        setEmployees(res1.data);
        setBlockedList(res2.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  load();

  return () => {
    mounted = false;
  };
}, []);
  // ✅ Merge anomaly + blocked employees
const priority = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const allEmployeesMap = new Map();

employees.forEach((u) => {
  if (!allEmployeesMap.has(u.employee)) {
    allEmployeesMap.set(u.employee, u);
  } else {
    const existing = allEmployeesMap.get(u.employee);

    // 🔥 Keep highest risk record
    if (priority[u.risk_level] > priority[existing.risk_level]) {
      allEmployeesMap.set(u.employee, u);
    }
  }
});
// Add blocked employees (if not already present)
blockedList.forEach((b) => {
  if (!allEmployeesMap.has(b.employee)) {
    allEmployeesMap.set(b.employee, {
      employee: b.employee,
      risk_level: "LOW",
      anomaly_score: 0,
    });
  }
});

const uniqueEmployees = Array.from(allEmployeesMap.values());

  // Search employees
const searchedEmployees = uniqueEmployees.filter((u) =>
  u.employee.toLowerCase().includes(search.toLowerCase())
);

// Filter employees by selected risk level
const filteredEmployees = searchedEmployees.filter((u) => {
  if (selectedRisk === "ALL") {
    return true;
  }

  return u.risk_level?.trim().toUpperCase() === selectedRisk;
});

useEffect(() => {
  // Stop automatic rotation while searching or filtering risk
  if (search || selectedRisk !== "ALL") {
    setLiveIndex(0);
    return;
  }

  const interval = setInterval(() => {
    setLiveIndex((prev) => {
      return uniqueEmployees.length
        ? (prev + 1) % uniqueEmployees.length
        : 0;
    });
  }, 2000);

  return () => clearInterval(interval);
}, [search, selectedRisk, uniqueEmployees.length]);

const liveEmployees =
  search || selectedRisk !== "ALL"
    ? filteredEmployees
    : filteredEmployees.slice(liveIndex, liveIndex + 20);

  const high = uniqueEmployees.filter((u) => u.risk_level === "HIGH").length;
  const medium = uniqueEmployees.filter((u) => u.risk_level === "MEDIUM").length;
  const low = uniqueEmployees.filter((u) => u.risk_level === "LOW").length;

  const chartData = [
    { name: "LOW", value: low },
    { name: "MEDIUM", value: medium },
    { name: "HIGH", value: high },
  ];

  const colors = ["#22c55e", "#facc15", "#ef4444"];
  // 🔥 ADD HERE
const getIndicator = (u) => {
  const level = u.risk_level?.trim().toUpperCase();

  if (level === "HIGH") return "High-Risk Behavior";
  if (level === "MEDIUM") return "Suspicious Activity";
  return "Normal Activity";
};
  if (!uniqueEmployees.length) return null;

  return (
    <div
      className={`flex flex-col h-screen overflow-hidden ${
        darkMode
          ? "bg-gradient-to-br from-[#020617] via-[#0b1220] to-[#020617] text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      {/* HEADER */}
      <div
        className={`px-6 py-4 flex justify-between items-center border-b
      backdrop-blur-xl ${
        darkMode
          ? "bg-gradient-to-r from-[#0f172a]/80 via-[#1e293b]/70 to-[#0f172a]/80 border-white/10 shadow-lg"
          : "bg-white shadow"
      }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <img src="/logo.png" className="w-8 h-8" />
          </div>

          <h1 className="text-lg font-semibold tracking-wide">
            Insider Threat Detection System - Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
              darkMode
                ? "bg-[#0f172a]/60 border-white/10 focus-within:border-blue-400"
                : "bg-gray-100"
            }`}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Employee"
              className="bg-transparent outline-none text-sm"
            />
          </div>

          <img
            src="/admin.png"
            className="w-10 h-10 rounded-full border border-white/20"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <div
          className={`w-20 flex flex-col justify-between items-center py-6 border-r
        ${darkMode ? "bg-[#020617] border-white/10" : "bg-white shadow-lg"}`}
        >
          <div className="flex flex-col gap-6 items-center">
            <SidebarIcon
              src="/home.svg"
              active={location.pathname === "/dashboard"}
              onClick={() => navigate("/dashboard")}
              darkMode={darkMode}
            />

            <SidebarIcon
              src="/blocked.svg"
              active={location.pathname === "/BlockedEmployees"} // ✅ FIX
              onClick={() => navigate("/BlockedEmployees")}
              darkMode={darkMode}
            />

            <SidebarIcon
              src="/moon.svg"
              onClick={() => setDarkMode(!darkMode)}
              darkMode={darkMode}
            />
          </div>

          <SidebarIcon
            src="/logout.svg"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            danger
            darkMode={darkMode}
          />
        </div>

        {/* MAIN */}
        <div className="flex-1 p-6 flex flex-col h-full overflow-hidden">
          {/* CARDS */}
          <div className="grid grid-cols-4 gap-4 mb-6">
          <Card
            title="Total Employees"
            value={uniqueEmployees.length}
            darkMode={darkMode}
            active={selectedRisk === "ALL"}
            onClick={() => setSelectedRisk("ALL")}
          />

          <Card
            title="High Risk Employees"
            value={high}
            darkMode={darkMode}
            active={selectedRisk === "HIGH"}
            onClick={() => setSelectedRisk("HIGH")}
          />

          <Card
            title="Medium Risk Employees"
            value={medium}
            darkMode={darkMode}
            active={selectedRisk === "MEDIUM"}
            onClick={() => setSelectedRisk("MEDIUM")}
          />

          <Card
            title="Low Risk Employees"
            value={low}
            darkMode={darkMode}
            active={selectedRisk === "LOW"}
            onClick={() => setSelectedRisk("LOW")}
          />
        </div>

          {/* CONTENT */}
          <div className="grid grid-cols-3 gap-6 flex-1 overflow-hidden">
            <div
              className={`col-span-2 p-4 rounded-xl ${
                darkMode ? "bg-[#1c2333]/70" : "bg-white shadow"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedRisk === "ALL"
                      ? "All Employees"
                      : `${selectedRisk} Risk Employees`}
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    Showing {filteredEmployees.length} employee(s)
                  </p>
                </div>

                {selectedRisk !== "ALL" && (
                  <button
                    onClick={() => setSelectedRisk("ALL")}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    Show All Employees
                  </button>
                )}
              </div>

              <div className="grid grid-cols-4 text-gray-400 mb-2">
                <span>Employee</span>
                <span>Risk Score</span>
                <span>Indicator</span>
                <span>Status</span>
              </div>

              <div className="h-[500px] overflow-y-auto pr-2">
                {liveEmployees.length === 0 && (
                  <div className="py-12 text-center text-gray-400">
                    No {selectedRisk === "ALL" ? "" : selectedRisk.toLowerCase()} risk employees found.
                  </div>
                )}
               {liveEmployees.map((u, i) => {
  const riskScore = Math.abs(Math.round(u.risk_score || 0));

  const level = u.risk_level?.trim().toUpperCase();

  const color =
    level === "HIGH"
      ? "bg-red-500"
      : level === "MEDIUM"
      ? "bg-yellow-400"
      : "bg-green-500";

  const isBlocked = blockedList.some(
    (b) => b.employee === u.employee
  );

                  return (
                    <div
                      key={i}
                      onClick={() => navigate(`/employee/${u.employee}`)}
                      className={`grid grid-cols-4 py-3 border-b cursor-pointer
                        ${
                          darkMode
                            ? "border-gray-600 hover:bg-[#2a344a]"
                            : "border-gray-200 hover:bg-gray-100"
                        }`}
                    >
                      <span className="flex gap-2 items-center">
                       

<span className={`w-3 h-3 rounded-full ${color}`} />
                        {u.employee}
                      </span>

                <div className="flex items-center gap-3">
  {/* SCORE */}
  <span className="w-10 text-sm">{riskScore}</span>

  {/* BAR (LIMITED WIDTH) */}
  <div className="w-40 bg-gray-600 h-2 rounded">
    <div
      className={`h-2 rounded ${color}`}
      style={{ width: `${riskScore}%` }}
    />
  </div>
</div>

                      <span>{getIndicator(u)}</span>

                      {/* ✅ STATUS FIX */}
                      {isBlocked ? (
                        <span className="text-red-500 font-semibold">
                          BLOCKED
                        </span>
                      ) : (
                        <span className="text-green-400">ACTIVE</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className={`p-4 rounded-xl ${
                darkMode ? "bg-[#1c2333]/70" : "bg-white shadow"
              }`}
            >
              <h2 className="mb-4">Risk Distribution</h2>

              <ResponsiveContainer width="100%" height={550}>
                <BarChart data={chartData}>
                  <XAxis stroke={darkMode ? "#aaa" : "#333"} dataKey="name" />
                  <YAxis stroke={darkMode ? "#aaa" : "#333"} />
                  <Tooltip />
                  <Bar dataKey="value">
                    {chartData.map((item, i) => (
                      <Cell
                        key={item.name}
                        fill={colors[i]}
                        cursor="pointer"
                        onClick={() => {
                          setSelectedRisk(item.name);
                          setLiveIndex(0);
                        }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* SIDEBAR ICON */
function SidebarIcon({ src, active, onClick, darkMode, danger }) {
  return (
    <div
      onClick={onClick}
      className={`w-14 h-14 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300
      ${
        active
          ? darkMode
            ? "bg-blue-500 shadow-lg shadow-blue-500/30 scale-110 "
            : "bg-gray-200 shadow-md scale-110"
          : darkMode
          ? "hover:bg-white/10"
          : "hover:bg-gray-200"
      }
      ${danger ? "hover:bg-red-500/20" : ""}
      `}
    >
      <img
        src={src}
        className={`w-6 h-6 ${
          darkMode ? "invert opacity-80 hover:opacity-100" : ""
        }`}
      />
    </div>
  );
}

/* CARD */
function Card({ title, value, darkMode, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-xl text-left cursor-pointer transition-all duration-200
        ${
          active
            ? "ring-2 ring-blue-500 scale-[1.02] bg-blue-500/20"
            : darkMode
            ? "bg-[#1c2333]/70 hover:bg-[#293246]"
            : "bg-white shadow hover:bg-gray-100"
        }
      `}
    >
      <p className="text-gray-400">{title}</p>

      <h2 className="text-4xl font-bold mt-1">
        {value}
      </h2>

      <p className="text-xs text-gray-400 mt-2">
        Click to view employees
      </p>
    </button>
  );
}