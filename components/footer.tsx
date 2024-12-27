import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex items-end justify-center py-6 text-center bg-background border-t border-border">
      <div className="container px-4 pb-12">
        <p className="text-muted-foreground text-sm">
          Made with <span className="text-pink-500">💖</span> by{" "}
          <Link 
            href="https://t.me/the_blogrammer" 
            target="_blank"
            className="font-bold text-foreground hover:text-primary underline underline-offset-4 transition-colors"
          >
            The Blogrammer
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Footer;