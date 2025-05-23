import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { signInWithGoogle } from "../redux/authSlice.js";
import logo from '../assets/images/logo.png'
import GoogleLogo from '../assets/images/google.png'
import { VITE_API_BASE_URL } from "../components/index.js";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authLoading, error } = useSelector((state) => state.auth);
  const [loadingLocal, setLoadingLocal] = useState(false);



  const handleGoogleSignIn = () => {
    dispatch(signInWithGoogle());
    navigate('/profile');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingLocal(true);
    try {
      const response = await axios.post(`${VITE_API_BASE_URL}auth/signup`, formData);
      console.log("User Registered -> ",response);
      toast.success("Signup Successful!");
      navigate('/signin')
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Signup Failed! Try again.");
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mt-16">
      <div className="border border-gray-300 p-8 w-96 rounded-md shadow-2xl flex flex-col items-center justify-center">
        <div className="text-center flex items-center justify-center flex-col">
          <img src={logo} alt="" className="h-40"/>
          <h1 className="text-2xl font-bold text-[#0A192F] tracking-wide">Welcome to MarketMinds</h1>
          <p className="text-[#0A192F] tracking-wide py-2 text-sm">📈 Trade Smart, Track Better.</p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4 p-4">
            <input 
              type="text" 
              name="username" 
              autoFocus
              value={formData.username} 
              onChange={handleChange} 
              className="border border-black rounded-lg p-2 outline-none w-68" 
              placeholder="Name"
              required
            />
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="border border-black rounded-lg p-2 outline-none w-68" 
              placeholder="Email"
              required
            />
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="border border-black rounded-lg p-2 outline-none w-68" 
              placeholder="Create Password"
              required
            />
            <button
              type="submit"
              disabled={loadingLocal}
              className={`${
                loadingLocal ? "bg-gray-500 cursor-not-allowed" : "bg-[#0A192F] hover:bg-[#233554] hover:scale-105"
              } text-[#E2E8F0] py-2 px-4 rounded-md transition-all duration-700 mt-4 w-full`}
            >
              {loadingLocal ? "Signing up..." : "Sign Up"}
            </button>

          </form>
        </div>
        <div>
          <p>Already have an account? <span className="text-blue-700 hover:underline transition duration-900 font-semibold"><Link to='/signin'>Sign In</Link></span></p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 mt-4">
          <div>
            <p className="tracking-wider">OR</p>
          </div>
          <button className="flex flex-row gap-3 items-center justify-center border border-black px-4 py-2 rounded-lg shadow-lg hover:scale-95 transition duration-700 cursor-pointer" onClick={handleGoogleSignIn}>
            <img src={GoogleLogo} alt="" className="h-6"/>
            <p className="text-md tracking-wider font-semibold">Continue with Google</p>
          </button>
          {authLoading && <p>Signing in...</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default SignUp;
