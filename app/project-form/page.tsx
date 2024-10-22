"use client";
import React, { useEffect, useState } from "react";
import ProjectSubmissionForm from "./_components/Form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import BulbLoading from "@/components/BulbLoading";

const ProjectForm = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isPending && !session) {
      router.push("/auth/sign-in");
    }
  }, [session, isPending, router, isMounted]);

  if (!isMounted) {
    return null;
  }

  if (isPending) {
    return <BulbLoading />;
  }

  if (session) {
    return (
      <div>
        <ProjectSubmissionForm />
      </div>
    );
  }

  return null;
};

export default ProjectForm;
