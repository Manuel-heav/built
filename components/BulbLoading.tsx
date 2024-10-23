"use client";

import React from "react";
import { motion } from "framer-motion";
import { LightBulbIcon } from "@heroicons/react/16/solid";

const glowVariants = {
  initial: { opacity: 0, scale: 0 },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    scale: [1, 1.2, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const particleVariants = {
  initial: { opacity: 0, y: 0 },
  animate: {
    opacity: [0, 1, 0],
    y: [-20, 20],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeOut",
    },
  },
};

export default function BulbLoading() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#151519]">
      <div className="relative">
        <motion.div
          initial="initial"
          animate="animate"
          variants={glowVariants}
          className="absolute inset-0 bg-white rounded-full opacity-20 blur-2xl"
        />
        <motion.div
          className="relative z-10"
        >
          <motion.div
          >
            <LightBulbIcon className="text-white h-20" />
          </motion.div>
        </motion.div>
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            initial="initial"
            variants={particleVariants}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: "white",
              transform: `rotate(${index * 45}deg) translateY(-40px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
