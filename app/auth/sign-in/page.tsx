"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { LightBulbIcon } from "@heroicons/react/16/solid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GithubIcon, GoogleIcon } from "@/components/icons/icons";
import Link from "next/link";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password cannot be longer than 20 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const signUp = async (data: SignInFormData) => {
    setLoading(true);
    const { email, password } = data;

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          toast.success("Sign In Successful");
          router.push("/");
          setLoading(false);
        },
        onError: (ctx) => {
          toast.error(`Sign In Failed: ${ctx.error.message}`);
          setLoading(false);
        },
      }
    );
  };

  const signInWithGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };

  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="flex flex-col items-center gap-5">
        <LightBulbIcon className="h-12" />
        <h1 className="text-2xl font-bold">Sign In to Built</h1>
      </div>

      <div className="p-6 rounded-lg shadow-md w-96">
        <div className="flex gap-5">
          <button
            onClick={signInWithGithub}
            className="input-primary flex justify-center w-full mt-4 border-none text-white font-bold py-2 rounded-md transition  hover:opacity-90 duration-1000"
          >
            <GithubIcon />
          </button>

          <button
            onClick={signInWithGoogle}
            className="input-primary flex justify-center w-full mt-4 border-none text-white font-bold py-2 rounded-md transition duration-200 hover:opacity-90"
          >
            <GoogleIcon />
          </button>
        </div>
        <div className="mt-4 mb-4 text-center">
          <span className="text-gray-600">or</span>
        </div>
        <form onSubmit={handleSubmit(signUp)}>
          <div className="mb-4">
            <input
              type="email"
              {...register("email")}
              className="input-primary"
              placeholder="Email Address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              {...register("password")}
              className="input-primary"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded-md transition duration-1000 hover:shadow-[0_0_50px_15px_rgba(255,255,255,0.1),0_0_100px_40px_rgba(255,255,255,0.1)]"
          >
            {loading ? <Spinner size="small" /> : "Sign In"}
          </button>
          <Link href="/auth/sign-up">
            <button className="text-sm mt-8 w-full bg-transparent py-2 rounded-md transition duration-500 border text-gray-400 border-gray-400 hover:border-white hover:text-white">
              Don't have an account? Sign Up
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
