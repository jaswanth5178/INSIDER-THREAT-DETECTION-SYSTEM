import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");

    } catch  {
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700">
      <div className="bg-white p-8 rounded-2xl w-96 shadow-2xl text-center">

        <img
          src="https://i.pravatar.cc/100"
          className="w-20 h-20 mx-auto rounded-full border-4 border-blue-500 mb-4"
        />

        <h2 className="text-xl font-semibold mb-6">
          Insider Threat Dashboard
        </h2>

        <input
          placeholder="Username"
          className="w-full p-3 mb-4 border rounded-full"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full p-3 mb-2 border rounded-full"
          onChange={(e) => setPassword(e.target.value)}
        />

        
        {/* ✅ SHOW PASSWORD */}
<div className="flex items-center justify-center gap-2 text-sm mb-4">
  <input
    type="checkbox"
    onChange={() => setShowPassword(!showPassword)}
  />
  <label>Show password</label>
</div>

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-3 rounded-full"
        >
          Login
        </button>
      </div>
    </div>
  );
}