import Footer from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";
import ProjectsContainer from "@/components/projects-container";
import React from "react";

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <ProjectsContainer />
      <Footer />
    </div>
  );
};

export default Home;
