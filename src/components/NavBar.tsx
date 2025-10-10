import { useState } from "react";
import appIcon from "../../assets/app_icon.svg";
import avatar from "../../assets/avatar.png";
import HomeIcon from "../icons/HomeIcon";
import ProfileIcon from "../icons/ProfileIcon";
import MessageIcon from "../icons/MessageIcon";
import SettingIcon from "../icons/SettingIcon";
import NotificationIcon from "../icons/NotificationIcon";
import React from "react";

function NavBar() {
  const [active, setActive] = useState("home");

  const navItems = [
    { id: "home", icon: <HomeIcon width={25} height={25} /> },
    { id: "noti", icon: <NotificationIcon width={25} height={25} /> },
    { id: "profile", icon: <ProfileIcon width={25} height={25} /> },
    { id: "msg", icon: <MessageIcon width={25} height={25} /> },
    { id: "setting", icon: <SettingIcon width={25} height={25} /> },
  ];

  return (
    <div className="flex flex-row fixed top-0 left-0 right-0 z-50 p-6 gap-8 ">
      {/* Logo */}
      <img src={appIcon} alt="App Icon" className="h-12 w-12" />

      {/* Search bar */}
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="#Explore"
          className="bg-[#2a2a2a] rounded-xl px-4 py-2 w-64 text-sm focus:outline-none"
        />
      </div>

      {/* Navigation icons */}
      <div className="flex flex-1 items-center gap-8 justify-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className="flex flex-col items-center justify-center group"
          >
            {/* Icon */}
            {React.cloneElement(item.icon, {
              className: `transition-colors duration-200 ${
                active === item.id ? "text-yellow-400" : "text-white"
              }`,
            })}

            {/* Chấm vàng dưới icon */}
            <div
              className={`h-1.5 w-1.5 rounded-full mt-2 transition-all duration-200 ${
                active === item.id
                  ? "bg-yellow-400 opacity-100 scale-100"
                  : "opacity-0 scale-0"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Avatar */}
      <div className="flex items-center justify-center w-12 h-12">
        <img
          src={avatar}
          alt="avatar"
          className="h-12 w-12 rounded-full object-cover"
        />
      </div>
    </div>
  );
}

export default NavBar;
