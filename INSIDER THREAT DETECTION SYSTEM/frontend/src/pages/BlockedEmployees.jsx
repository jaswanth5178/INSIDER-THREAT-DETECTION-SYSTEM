import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

export default function BlockedEmployees() {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);
const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "light" ? false : true;
});

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // 📡 Fetch blocked employees
  const fetchData = async () => {
    try {
      const res = await api.get("/api/blocked");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

useEffect(() => {
  let mounted = true;

  const load = async () => {
    try {
      const res = await api.get("/api/blocked");
      if (mounted) setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  load();

  return () => {
    mounted = false;
  };
}, []);

  // 🔓 Unblock
  const handleUnblock = async (employee) => {
    await api.delete(`/api/unblock/${employee}`);
    fetchData();
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
            Insider Threat Detection System - Blocked Employees
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
              onClick={() => navigate("/dashboard")}
              darkMode={darkMode}
            />

            <SidebarIcon
              src="/blocked.svg"
              active={location.pathname === "/BlockedEmployees"}
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

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6">
          <h2 className="text-xl mb-6">Blocked Employees 🚫</h2>

          {data.length === 0 ? (
            <p className="text-gray-400">No blocked employees</p>
          ) : (
            <div className="grid gap-4">
              {data.map((emp, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center p-4 rounded-xl ${
                    darkMode
                      ? "bg-[#1c2333]"
                      : "bg-white shadow border border-gray-200"
                  }`}
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      🚫
                    </div>

                    <div>
                      <h3 className="font-semibold">{emp.employee}</h3>
                      <p className="text-sm text-gray-400">
                        Blocked Employee
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <button
                    onClick={() => handleUnblock(emp.employee)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* SIDEBAR ICON */
function SidebarIcon({ src, active, onClick, danger, darkMode }) {
  return (
    <div
      onClick={onClick}
      className={`w-14 h-14 flex items-center justify-center rounded-xl cursor-pointer transition-all ${
        active
          ? darkMode
            ? "bg-blue-500 scale-110"
            : "bg-gray-200 shadow-md scale-110"   // ✅ FIX HERE
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