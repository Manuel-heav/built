"use client";
import React from "react";
import Container from "./container";
import { ArrowUpTrayIcon, LightBulbIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { GithubIcon } from "./icons/icons";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { Spinner } from "./ui/spinner";

const Header = () => {
  const { data: session, isPending } = authClient.useSession();
  console.log("Session", session);

  const handleSignOut = async () => {
    await authClient.signOut();
  };
  return (
    <div className="sticky top-0 z-50 md:py-4 py-5 backdrop-filter backdrop-blur-lg">
      <Container>
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1">
            <LightBulbIcon className="md:h-6 h-8" />
            <h1 className="hidden md:block text-2xl font-bold">Built</h1>
          </Link>

          <div className="flex items-center gap-5">
            {!session ? (
              <Link href="/auth/sign-in">
                <button className="btn-primary">Sign In</button>
              </Link>
            ) : (
              <div>
                <Link href="/project-form" className="hidden md:block">
                  <button className="btn-primary">Post Your Project</button>
                </Link>
                <Link href="/project-form" className="md:hidden">
                  <button className="btn-primary">
                    <ArrowUpTrayIcon className="h-5" />
                  </button>
                </Link>
              </div>
            )}

            <Link
              className="flex gap-2 items-center border px-4 py-2 rounded-full cursor-pointer transition duration-1000 hover:shadow-[0_0_50px_15px_rgba(255,255,255,0.1),0_0_100px_40px_rgba(255,255,255,0.1)]"
              href="https://github.com/Manuel-heav/built"
              target="_blank"
            >
              <GithubIcon />
              <p>Star</p>
            </Link>
            {session && (
              <div
                onClick={handleSignOut}
                className="cursor-pointer hover:scale-105 duration-200 ease-in-out"
              >
                {isPending ? <Spinner size="small" /> : <LogOutIcon />}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
