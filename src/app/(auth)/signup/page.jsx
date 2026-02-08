"use client";

import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userData } from "@/zodSchema/userSchema";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

export default function SignupForm() {
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(userData),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setIsSignupLoading(true);
      const response = await axios.post("/api/user/signup", data);
        toast('User created successfully', {
            title: 'Success',
        description: response?.data?.message,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
        console.log(data)
      router.replace(`/verify/${data.email}`);
    } catch (error) {
      console.error("Error during sign-up:", error);
       toast('User registration fail', {
          title: 'Success',
         description:'User registration fail',
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <div className="flex justify-center dark:bg-[#0d1117] items-center min-h-screen md:pt-16 px-4">
     <div className="w-full max-w-md bg-white dark:bg-black shadow-lg rounded-xl p-6 md:p-8">
       <h2 className="text-3xl font-heading sm:text-4xl text-center font-bold text-neutral-800 dark:text-neutral-200">
        Signup Now
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 sm:space-y-8 mt-6"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base dark:text-white font-body">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="jhon"
                    {...field}
                    className="h-10 sm:h-12 text-sm sm:text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm dark:text-white sm:text-base font-body">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="jhon@gmail.com"
                    {...field}
                    className="h-10 sm:h-12 text-sm sm:text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm dark:text-white sm:text-base font-body">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="*****"
                    type="password"
                    {...field}
                    className="h-10 sm:h-12 text-sm sm:text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            className="group/btn relative block h-10 sm:h-12 w-full font-heading rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] text-sm sm:text-base"
            type="submit"
          >
            {isSignupLoading ? <span>Loading</span> : <span>Signup</span>}
            <BottomGradient />
          </button>
        </form>
      </Form>

      {/* Login Link */}
         <div className="my-4  md:flex md:justify-center md:items-center md:gap-4 ">
<button onClick={()=>signIn('google', { callbackUrl: "/" })}
            className="my-4 md:my-0 group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Google
            </span>
            <BottomGradient />
          </button>
          <button onClick={()=>signIn('github', { callbackUrl: "/" })}
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Github
            </span>
            <BottomGradient />
          </button>
         </div>
      <p className="text-center text-sm text-neutral-600 font-body dark:text-neutral-400 mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-600 font-heading dark:text-indigo-400 hover:underline"
        >
          Login
        </Link>
      </p>
      
     </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};
