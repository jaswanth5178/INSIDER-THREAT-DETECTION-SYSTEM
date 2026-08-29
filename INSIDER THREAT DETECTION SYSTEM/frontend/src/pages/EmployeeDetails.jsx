import { useParams, useNavigate, useLocation } from "react-router-dom";
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

export default function EmployeeDetails() {
  const { employee: employeeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [employee, setEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [blockedList, setBlockedList] = useState([]); // ✅ NEW
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "light" ? false : true;
});

  // ✅ MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState("");



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

        // 🔥 SELECT BEST EMPLOYEE HERE
        const priority = { HIGH: 3, MEDIUM: 2, LOW: 1 };

        const employeeRecords = res1.data.filter(
          (u) => u.employee === employeeId
        );

        let selected = employeeRecords[0];

        employeeRecords.forEach((u) => {
          if (priority[u.risk_level] > priority[selected.risk_level]) {
            selected = u;
          }
        });

        setEmployee(selected);
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
}, [employeeId]);
  if (!employee) return null;

  // ✅ CHECK IF BLOCKED
  const isBlocked = blockedList.some(
    (b) => b.employee === employee.employee
  );

  // 📊 GLOBAL STATS
  const priority = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const map = new Map();

employees.forEach((u) => {
  if (!map.has(u.employee)) {
    map.set(u.employee, u);
  } else {
    const existing = map.get(u.employee);

    if (priority[u.risk_level] > priority[existing.risk_level]) {
      map.set(u.employee, u);
    }
  }
});

const uniqueEmployees = Array.from(map.values());

  const total = uniqueEmployees.length;
  const high = uniqueEmployees.filter((u) => u.risk_level === "HIGH").length;
  const medium = uniqueEmployees.filter((u) => u.risk_level === "MEDIUM").length;
  const low = uniqueEmployees.filter((u) => u.risk_level === "LOW").length;

  const chartData = [
    { name: "LOW", value: low },
    { name: "MEDIUM", value: medium },
    { name: "HIGH", value: high },
  ];

  const colors = ["#22c55e", "#facc15", "#ef4444"];
const getIndicators = (u) => {
  const level = u.risk_level?.trim().toUpperCase();

  if (level === "LOW") {
    return ["Normal Activity Detected"];
  }

  const indicators = [];

  if ((u.file_count || 0) > 5) {
    indicators.push("Excess File Access Detected");
  }

  if ((u.http_count || 0) > 50) {
    indicators.push("Unusual Web Activity");
  }

  if ((u.email_count || 0) > 20) {
    indicators.push("High Email Activity");
  }

  if ((u.device_count || 0) > 10) {
    indicators.push("Multiple Device Usage");
  }

  if (indicators.length === 0) {
    indicators.push("Moderate Behavior Deviation");
  }

  return indicators; // show only 2
};
  return (
    <div
      className={`flex flex-col h-screen ${
        darkMode
          ? "bg-gradient-to-br from-[#020617] via-[#0b1220] to-[#020617] text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* HEADER */}
      <div
        className={`px-6 py-4 flex justify-between items-center border-b ${
          darkMode
            ? "bg-gradient-to-r from-[#0f172a] to-[#1e293b] border-white/10"
            : "bg-white shadow"
        }`}
      >
        <div className="flex items-center gap-4">
          <img src="/logo.png" className="w-8 h-8" />
          <h1 className="text-lg font-semibold">
            Insider Threat Detection System - Employee Details
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            ← Back
          </button>

          <img
            src="/admin.png"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
        </div>
      </div>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <div
          className={`w-20 flex flex-col justify-between items-center py-6 ${
            darkMode
              ? "bg-[#020617]"
              : "bg-white border-r border-gray-200"
          }`}
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
        <div className="flex-1 p-6 flex flex-col">
          {/* CARDS */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card title="Total Employees" value={total} darkMode={darkMode} />
            <Card title="High Risk Employees" value={high} darkMode={darkMode} />
            <Card title="Medium Risk Employees" value={medium} darkMode={darkMode} />
            <Card title="Low Risk Employees" value={low} darkMode={darkMode} highlight />
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-3 gap-6 flex-1">
            {/* LEFT */}
            <div
              className={`col-span-2 p-6 rounded-xl ${
                darkMode
                  ? "bg-[#1c2333]"
                  : "bg-white shadow border border-gray-200"
              }`}
            >
              <div className="flex gap-6">
                {/* PROFILE */}
                <div
                  className={`w-64 rounded-xl p-4 text-center ${
                    darkMode
                      ? "bg-[#111827]"
                      : "bg-gray-50 border"
                  }`}
                >
                  <img
                    src={`https://i.pravatar.cc/100?u=${employee.employee}`}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />

                  <h2>{employee.employee}</h2>

                  <p className="mt-2">
                    Risk Score:
                    <span className="text-red-500 font-bold ml-2">
                      {Math.abs(Math.round(employee.risk_score || 0))}
                    </span>
                  </p>

                  <div className="mt-2 bg-green-500 text-white px-3 py-1 rounded-full">
                    {employee.risk_level}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="flex-1">
                  <h2 className="mb-4">Critical Indicators</h2>

                  <div className="space-y-3 mb-6">
                    {getIndicators(employee).map((text) => (
  <Indicator
  darkMode={darkMode}
  text={text}
  riskLevel={employee.risk_level}
/>
))}
                  </div>

                  <h2>Actions</h2>

                  <div className="flex gap-4 mt-3">

                    {/* ✅ TOGGLE BUTTON */}
                    {isBlocked ? (
                      <button
                        onClick={async () => {
                          await api.delete(`/api/unblock/${employee.employee}`);

const res = await api.get("/api/blocked");
setBlockedList(res.data);
                          alert("Employee Unblocked ✅");
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        🔓 Unblock Employee
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          await api.post("/api/block", {
                            employee: employee.employee,
                          });
                          const res = await api.get("/api/blocked");
setBlockedList(res.data);
                          alert("Employee Blocked 🚫");
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        🔒 Block Employee
                      </button>
                    )}

                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Assign to Analyst
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div
              className={`p-4 rounded-xl ${
                darkMode
                  ? "bg-[#1c2333]"
                  : "bg-white shadow border border-gray-200"
              }`}
            >
              <h2 className="mb-4">Risk Distribution</h2>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={colors[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-xl w-96 shadow-xl ${
              darkMode
                ? "bg-[#1e293b] text-white border border-white/10"
                : "bg-white text-black"
            }`}
          >
            <h2 className="mb-3 font-semibold text-lg">
              Assign to Analyst
            </h2>

            <textarea
              placeholder="Enter note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`w-full p-2 rounded mb-4 ${
                darkMode
                  ? "bg-[#0f172a] border border-white/10 text-white"
                  : "bg-gray-100 border"
              }`}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await api.post("/api/assign", {
                    employee: employee.employee,
                    note,
                  });
                  setShowModal(false);
                  setNote("");
                  alert("Email Sent ✅");
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* SIDEBAR */
function SidebarIcon({ src, active, onClick, danger, darkMode }) {
  return (
    <div
      onClick={onClick}
      className={`w-14 h-14 flex items-center justify-center rounded-xl cursor-pointer ${
        active
          ? "bg-blue-500 scale-110"
          : darkMode
          ? "hover:bg-white/10"
          : "hover:bg-gray-200"
      } ${danger ? "hover:bg-red-500/20" : ""}`}
    >
      <img
        src={src}
        className={`w-6 h-6 ${darkMode ? "invert" : "opacity-70"}`}
      />
    </div>
  );
}

/* CARD */
function Card({ title, value, darkMode, highlight }) {
  return (
    <div
      className={`p-4 rounded-xl ${
        highlight
          ? "bg-green-100 text-green-800 border border-green-200"
          : darkMode
          ? "bg-[#1c2333]"
          : "bg-white shadow border border-gray-200"
      }`}
    >
      <p className="text-gray-400">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}

/* INDICATOR */
function Indicator({ darkMode, text, riskLevel }) {
  const isLow = riskLevel === "LOW";

  return (
    <div
      className={`p-3 rounded flex items-center gap-2 ${
        darkMode ? "bg-[#111827]" : "bg-gray-100 border border-gray-200"
      }`}
    >
      {/* ✅ Show icon only if NOT LOW */}
      {!isLow && <span>❗</span>}

      {/* Optional: green dot for LOW */}
      {isLow && <span className="text-green-400">●</span>}

      <span>{text}</span>
    </div>
  );
}