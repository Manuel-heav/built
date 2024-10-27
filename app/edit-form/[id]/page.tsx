"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import BulbLoading from "@/components/BulbLoading";
import ProjectEditForm from "./_components/Edit";

interface EditFormPageProps {
    params: {
      id: string;
    };
  }

const EditForm = ({ params }: EditFormPageProps) => {
  const { id } = params;
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
        <ProjectEditForm project_id={id}/>
      </div>
    );
  }

  return null;
};

export default EditForm;
