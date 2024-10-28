import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex items-end justify-center py-6 text-center text-[#85868d] text-sm h-80 pb-12">
      <p>
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
