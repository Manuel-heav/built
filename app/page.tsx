"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const Home = () => {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      router.push("/projects");
    }
  }, [isPending, router]);

  return null;
};

export default Home;
