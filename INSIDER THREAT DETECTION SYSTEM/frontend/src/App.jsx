import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeDetails from "./pages/EmployeeDetails";
import BlockedEmployees from "./pages/BlockedEmployees";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee/:employee" element={<EmployeeDetails />} />
        <Route path="/BlockedEmployees" element={<BlockedEmployees />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;