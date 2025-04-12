import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBox from "../assets/AnimatedBox";
import { motion } from "framer-motion";
import { axiosInstance } from "../lib/Axios";
import { AuthStore } from "../Store/AuthStore";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { fetchUser } = AuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        "/user/login",
        { email, password },
        { withCredentials: true }
      );
      fetchUser();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-montserrat bg-white dark:bg-black">
      
      {/* Left Side */}
      <div
        className="w-1/2 hide-on-mobile text-white dark:text-black flex flex-col justify-center items-center px-12 py-10"
        style={{
          backgroundImage: `url('/walltree.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <AnimatedBox className="sm:max-w-lg max-w-sm text-lg text-gray-800">
          <div className="bg-black p-10 rounded-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#FAF9F6] rounded-full p-4 flex items-center justify-center">
                <img src="/logo1.png" className="w-16" />
              </div>
              <h1 className="text-3xl font-bold tracking-wide text-white">
                ViewCOUNT.
              </h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 1.2 }}
              viewport={{ once: true }}
              className="text-lg max-w-md text-left ml-10 font-semibold leading-relaxed text-white"
            >
              . One-stop solution for user traffic analytics for Your modern web
              apps.
            </motion.p>
          </div>
        </AnimatedBox>
      </div>

      {/* Right Side - Login */}
      <div className="w-full sm:w-1/2 flex flex-col justify-center items-center p-10 bg-gray-50 dark:bg-zinc-900">
        <div className="text-4xl text-center text-black dark:text-white mb-10">
          WELCOME BACK 👋
        </div>
        <div className="bg-white dark:bg-black p-10 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center dark:text-white text-gray-800 mb-6">
            Log In to Your Dashboard
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm dark:text-gray-300 text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm dark:text-gray-300 text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className={`w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl transition-all duration-300 ease-in-out transform ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="w-5 h-5 animate-spin mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-white"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 12a8 8 0 1116 0A8 8 0 014 12z"
                  />
                </svg>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
