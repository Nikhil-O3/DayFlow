import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { serverUrl } from "../App";

function Home() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(""); //  store name
  const navigate = useNavigate();

  // Fetch logged-in user (name) on page load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          serverUrl + "/api/auth/me",
          { withCredentials: true }
        );
        setName(res.data.user.name);
      } catch (error) {
        // not logged in → redirect
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.post(
        serverUrl + "/api/auth/logout",
        {},
        { withCredentials: true }
      );
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
      <div className="w-[90%] max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
        
        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome{ name && `, ${name}` } 🎉
        </h1>

        <p className="text-gray-500 text-center">
          You are successfully logged in
        </p>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-200" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full h-[45px] bg-black text-white rounded-lg font-medium 
                     hover:bg-gray-800 transition duration-200
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Logging out..." : "Log Out"}
        </button>
      </div>
    </div>
  );
}

export default Home;
