import React from "react";
import Container from "./container";
import { LightBulbIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";

const Header = () => {
  return (
    <div className="border-b-[#1b1b1d] border-b-2 py-4">
      {/* Logo */}
      <Container>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <LightBulbIcon className="h-6" />
            <h1 className="text-2xl font-bold">Built</h1>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 border-2 border-[#1b1b1d] rounded-md px-2 py-1 mt-2 focus-within:border-white transition-colors duration-200">
            <MagnifyingGlassIcon className="h-5" />
            <input
              type="text"
              placeholder="Search for projects"
              className="bg-transparent text-[#f0f0f0] focus:outline-none text-sm"
            />
          </div>

          {/* Sign In */}
          <button className="bg-white px-4 py-2 text-black rounded-full text-sm hover:scale-105 duration-200 ease-in-out">
            Post Your Project
          </button>
        </div>
      </Container>
    </div>
  );
};

export default Header;
