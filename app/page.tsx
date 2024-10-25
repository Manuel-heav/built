"use client";
import BulbLoading from "@/components/BulbLoading";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";
import ProjectsContainer from "@/components/projects-container";
import { authClient } from "@/lib/auth-client";
import React from "react";

const Home = () => {
  const { data: session, isPending } = authClient.useSession();
  console.log("Session", session);

  if (isPending) {
    return <BulbLoading />;
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
