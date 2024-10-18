import React from "react";
import Container from "./container";
import { LightBulbIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { GithubIcon } from "./icons/icons";

const Header = () => {
  return (
    <div className="sticky top-0 z-50 py-4 backdrop-filter backdrop-blur-lg">
      <Container>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <LightBulbIcon className="h-6" />
            <h1 className="text-2xl font-bold">Built</h1>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/auth/sign-up">
              <button className="btn-primary">Post Your Project</button>
            </Link>
            <Link
              className="flex gap-2 items-center border px-4 py-2 rounded-full cursor-pointer"
              href="https://github.com/Manuel-heav/built"
              target="_blank"
            >
              <GithubIcon />
              <p>Star</p>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
