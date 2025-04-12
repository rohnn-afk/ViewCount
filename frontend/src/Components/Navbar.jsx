import React from 'react';
import ThemeToggle from '../assets/ThemeToggle';

const Navbar = () => {

  return (
    <div className="fixed w-full bg-[#FAF9F6] border-b-2 pt-1 flex justify-center items-center z-50">
      <div className="w-full pl-4 pr-6 flex flex-row justify-between items-center">
        <div>
          <img
            src="/ChatGPT Image Apr 6, 2025, 10_17_12 PM.png"
            className="w-48"
            alt="Logo"
          />
        </div>

        <div className="flex flex-row items-center font-semibold justify-center">
            <ThemeToggle/>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
