import React from "react";
import Container from "./container";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { Spotlight } from "./ui/Spotlight";

const Hero = () => {

  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects"); 
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" }); 
    }
  };

  return (
    <div>
      <Spotlight
        fill="white"
        className="-top-40 left-0 md:left-60 md:-top-20"

      />
      <Container>
        <div className="flex flex-col items-center justify-center h-[65vh] gap-5">
          <h1 className="text-4xl md:text-5xl lg:text-7xl text-center w-[70%] text-foreground">
            Find And Rate Your Favorite Projects.
          </h1>
          <p className="text-center text-sm md:text-xl mt-2 text-[#85868d] w-[50%]">
            Post your projects, gain likes, and engage with comments from
            developers like you.
          </p>
          {/* <div className="flex items-center gap-2 border-2 border-[#616165] rounded-md px-2 py-1 mt-2 focus-within:border-white transition-colors duration-200">
            <MagnifyingGlassIcon className="h-5" />
            <input
              type="text"
              placeholder="Search for projects"
              className="bg-transparent text-[#f0f0f0] focus:outline-none text-sm border-gray-300"
            />
          </div> */}
          <div>
          <button
              onClick={scrollToProjects} 
              className="flex gap-1 items-center btn-primary text-xl p-5 text-foreground border border-border"
            >
              Explore Projects
              <ChevronRightIcon className="h-5" />
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;