import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="py-6 text-center text-white">
      <p className="text-lg">
        Made with <span className="text-pink-500">💖</span> by{" "}
        <Link href="https://t.me/the_blogrammer" target="_blank">
          <span className="font-bold underline hover:opacity-80 duration-200">
            The Blogrammer
          </span>
        </Link>
      </p>
    </div>
  );
};

export default Footer;
