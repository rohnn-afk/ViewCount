import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBox from "../assets/AnimatedBox";
import { motion } from "framer-motion";
import { axiosInstance } from "../lib/Axios";
import { AuthStore } from "../Store/AuthStore";


export default function Register() {


      const {fetchUser} = AuthStore()
  

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
        "/user/register",
        {name, email, password },
        { withCredentials: true } 
      );

      console.log("✅ User Created:", res.data.message);
      fetchUser()
      navigate("/");

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong.");
    }

  };

  return (
    <div className="min-h-screen flex dark:bg-black font-montserrat bg-white">


     <div
  className="w-1/2 text-white dark:text-black flex flex-col justify-center items-center px-12 py-10"
  style={{
    backgroundImage: `url('/download (2).jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  {/* Overlay */}
  <AnimatedBox className="max-w-lg text-lg  text-gray-800">

  <div className="bg-black  p-10 rounded-2xl">
    {/* Logo */}
    <div className="flex items-center  gap-4 mb-6">
      <div className="bg-[#FAF9F6] rounded-full p-4 flex items-center justify-center">
        <img src="/logo1.png" className="w-16"/>
      </div>
      <h1 className="text-3xl font-bold tracking-wide  text-white">ViewCOUNT.</h1>
    </div>

    {/* Tagline */}
    <motion.p
     initial={{ opacity: 0, y: 50 }}
     whileInView={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.4, ease: "easeOut", delay: 1.2 }}
     viewport={{ once: true }}
    className="text-lg max-w-md text-left ml-10 font-semibold leading-relaxed  text-white">
     . One-stop solution for user traffic analytics for Your modern web apps.
    </motion.p>
  </div>
  </AnimatedBox>

</div>


      {/* Right side - Login */}
      <div className="w-1/2 flex items-center pt-[7rem] dark:bg-zinc-900  bg-gray-50 flex-col gap-28">
      <div className="w-full text-4xl text-center text-black dark:text-white ">
       HELLO NEW USER 👋

      </div>
        <div className="bg-white dark:bg-black p-10 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center dark:text-white text-gray-800 mb-6">Make an Account</h2>

          <form onSubmit={handleLogin} className="space-y-5">

          <div>
              <label className="block text-sm dark:text-gray-300 text-gray-600 mb-1">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm dark:text-gray-300 text-gray-600 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm dark:text-gray-300 text-gray-600 mb-1">Password</label>
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl transition"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
