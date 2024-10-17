"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // Function to handle user sign-up
  const signUp = async () => {
    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: (ctx) => {
          // Show loading
        },
        onSuccess: (ctx) => {
          // Redirect to the dashboard
          alert("Sign up successful");
          window.location.href = "/dashboard"; // Redirect to dashboard
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      }
    );
  };
  const signInWithGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/auth/sign-up",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your password"
          />
        </div>
        <button
          onClick={signUp}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Sign Up
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-600">or</span>
        </div>
        <button
          onClick={signInWithGithub}
          className="w-full mt-4 bg-gray-600 text-white font-bold py-2 rounded-md hover:bg-gray-700 transition duration-200"
        >
          Sign In with GitHub
        </button>
      </div>
    </div>
  );
}
