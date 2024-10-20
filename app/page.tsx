"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";
import ProjectsContainer from "@/components/projects-container";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import React from "react";

const Home = () => {
  const { data: session, isPending } = authClient.useSession();
  console.log("Session", session);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex">
          <Spinner />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      {!session && <Hero />}
      <ProjectsContainer />
      <Footer />
    </div>
  );
};

export default Home;
