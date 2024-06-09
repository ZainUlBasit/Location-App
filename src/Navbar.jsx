import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[15vh] flex justify-between items-center bg-[#132B47] text-white">
      <div className="flex items-center gap-x-3 px-3">
        <img
          src="https://c.wallhere.com/photos/90/cf/newyorkcity_yellowcab_timesquare_trafficjam_tiltshift_miniaturefake_toyeffect_danielk_lblinger-896115.jpg!d"
          alt="not found"
          className="w-[100px] h-[100px] rounded-full"
        />
        <div className="font-bold text-2xl text-[#8DBFDB]">
          Traffic Jam Alert and Congestion Control
        </div>
      </div>
      <div className="flex gap-x-3 px-3">
        <div
          className="font-bold text-xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          Home
        </div>
        <div
          className="font-bold text-xl cursor-pointer"
          onClick={() => navigate("/routes")}
        >
          Routes
        </div>
        <div
          className="font-bold text-xl cursor-pointer"
          onClick={() => navigate("/places")}
        >
          Places
        </div>
        <div
          className="font-bold text-xl cursor-pointer"
          onClick={() => navigate("/directions")}
        >
          Direction
        </div>
        {/* <div
          className="font-bold text-xl cursor-pointer"
          onClick={() => navigate("/contacts")}
        >
          Contacts
        </div>
        <div
          className="font-bold text-xl cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
        </div> */}
      </div>
    </div>
  );
};

export default Navbar;
