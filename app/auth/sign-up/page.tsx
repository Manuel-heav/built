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
import { GithubIcon } from "@/components/icons/icons";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password cannot be longer than 20 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const signUp = async (data: SignUpFormData) => {
    setLoading(true);
    const { name, email, password } = data;

    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          toast.success("Sign Up Successful");
          router.push("/");
          setLoading(false);
        },
        onError: (ctx) => {
          toast.error(`Sign Up Failed: ${ctx.error.message}`);
          setLoading(false);
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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-5">
        <LightBulbIcon className="h-12" />
        <h1 className="text-2xl font-bold">Sign Up into Built</h1>
      </div>
      <div className="p-6 rounded-lg shadow-md w-96">
        <form onSubmit={handleSubmit(signUp)}>
          <div className="mb-4">
            <input
              type="text"
              {...register("name")}
              className="input-primary"
              placeholder="Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
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
            {loading ? <Spinner size="small" /> : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-600">or</span>
        </div>
        <button
          onClick={signInWithGithub}
          className="flex justify-center w-full mt-4 bg-gray-600 text-white font-bold py-2 rounded-md hover:bg-gray-700 transition duration-200"
        >
          <GithubIcon />
        </button>
      </div>
    </div>
  );
}
