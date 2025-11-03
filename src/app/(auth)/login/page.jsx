"use client";

import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { loginSchema } from "@/zodSchema/userSchema";

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
import Link from "next/link";
import { toast } from "sonner";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

export default function SignupForm() {
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const router = useRouter();
  const searchParams=useSearchParams()

  const callBackUrl= searchParams.get("callbackUrl") || "/"

  
 
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
      try {
      setIsSignupLoading(true)
      const response=await signIn("credentials",{
    redirect:false,
    email:data?.email,
    password:data?.password,
    callbackUrl:callBackUrl
    
   })
   toast("Welcome to our family",{
         title:'Success',
         description: 'Thanks for use our marketplace',
          variant: 'destructive',
    })
   if (response?.error){
    toast("verification fail",{
         title:response?.error,
         description: 'Incorrect username or password',
          variant: 'destructive',
    })
   }
   if (response?.url){
 router.replace(`/`);
}
   } catch (error) {
     console.error('Error during sign-up:', error);
     toast('User registration fail', {
          title: 'Success',
         description:'User registration fail',
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
    
   }finally{
    setIsSignupLoading(false)
   }
  };

  return (
    <div className="flex justify-center dark:bg-[#0d1117] items-center min-h-screen  md:pt-16  px-4">
        <div className="w-full max-w-md bg-white dark:bg-black/90 shadow-lg rounded-xl p-6 md:p-8">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">

  
          Login
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 md:space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="my-1 font-body dark:text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="jhon@gmail.com"
                      {...field}
                      className="w-full"
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
                  <FormLabel className="mt-4 dark:text-white font-body">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="*****"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              className="group/btn relative block h-10 w-full font-heading rounded-md bg-gradient-to-br from-black to-neutral-600 text-white font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] transition-all duration-300 hover:scale-[1.02]"
              type="submit"
            >
              {isSignupLoading ? <span>Loading...</span> : <span>Login</span>}
              <BottomGradient />
            </button>
          </form>
        </Form>

        {/* Signup Link */}
        <p className="text-center text-sm font-body text-neutral-600 dark:text-neutral-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium font-heading text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
         <div className="my-4 space-y-4 sm:space-y-0 md:flex md:justify-center md:items-center md:gap-4 ">
        <button onClick={()=>signIn('google', { callbackUrl: callBackUrl })}
                    className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                    type="submit"
                  >
                    <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      Google
                    </span>
                    <BottomGradient />
                  </button>
                    <button onClick={()=>signIn('github', { callbackUrl: callBackUrl })}
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
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
