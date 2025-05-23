import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile, fetchUserTrades} from "../redux/authSlice.js";
import Dashboard from "../components/Dashboard.jsx";
import SideBar from "../components/SideBar.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Loader from "../components/Loader.jsx";


const Profile = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { authLoading , error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserTrades()); 
    
  }, [dispatch ]);

  if (authLoading) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoad(false);
  //   }, 2000);
  //   return () => clearTimeout(timer);
  // }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }


  return (
    <motion.div className="flex min-h-screen md:flex-row flex-col " initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <button
        className="md:hidden p-2 bg-gray-800 text-white mt-24 rounded-lg px-4 cursor-pointer py-2 ml-6 md:ml-0 w-88"
        onClick={toggleSidebar}> 
        Menu
      </button>
      <div className="md:block hidden min-h-screen">
          <SideBar/>
      </div>
      <div className="">
        <Dashboard/>
      </div>

      {/* Mobile Menu */}
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="fixed right-0 w-full sm:w-full h-screen bg-[#11224097] p-6 flex flex-col items-center text-xl gap-6 shadow-lg z-50 top-20">
                <button className="absolute top-4 right-4 text-[#4ECCA3]" onClick={() => setSidebarOpen(false)}><X size={28} /></button>
                {['newtrade', 'tradehistory', 'tradesummary', 'equitychart', 'logout'].map(item => (
                  <Link key={item} to={`/${item}`} className="text-[#E2E8F0] tracking-wider hover:underline transition duration-300" onClick={() => setSidebarOpen(false)}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Link>
                ))}
              </motion.div>
            )}
    </motion.div>
  );
};

export default Profile;
