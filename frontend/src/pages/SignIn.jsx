import { Link , useNavigate} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/signin',
        formData
      );

      const token = response.data.token;
      if (!token) {
        throw new Error("Token not received");
      }

      localStorage.setItem("token", token);
      toast.success("Sign In Successful");
      navigate("/profile");
    } catch (error) {
      console.error("Signin Error:", error);
      toast.error(error.response?.data?.message || "Signin Failed. Try Again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border border-black p-8 w-96 rounded-md shadow-2xl flex flex-col items-center justify-center">
        <div className="text-center flex items-center justify-center flex-col">
          <img src="/images/logo-removebg-preview.png" alt="Logo" className="h-40" />
          <h1 className="text-2xl font-bold text-[#0A192F] tracking-wide">
            Welcome to MarketMinds
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-4 p-4 w-full"
        >
          <input
            type="email"
            name="email"
            className="border border-gray-300 rounded-lg p-2 outline-none w-72"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            className="border border-gray-300 rounded-lg p-2 outline-none w-72"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="bg-[#0A192F] text-[#E2E8F0] py-2 px-4 rounded-md hover:bg-[#233554] transition-all duration-700 hover:scale-105 mt-4 w-72"
          >
            Sign In
          </button>
        </form>

        <p className="mt-2">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-700 hover:underline font-semibold">
            Sign Up
          </Link>
        </p>

        <div className="flex flex-col items-center justify-center gap-2 mt-4">
          <p className="tracking-wider">OR</p>
          <div className="flex flex-row gap-3 items-center justify-center border border-black px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition duration-700 cursor-pointer">
            <img src="/images/google.png" alt="Google Logo" className="h-6" />
            <p className="text-md tracking-wider font-semibold">Continue with Google</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
