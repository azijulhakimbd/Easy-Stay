"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { RippleButton } from "@/components/ui/ripple-button";

import { useTheme } from "next-themes";
import { MagicCard } from "@/components/ui/magic-card"
import { toast } from "sonner";

export default function HostApplicationModal() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const { register, handleSubmit, setValue, reset } = useForm();

  // ✅ React Query mutation
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post("/api/host-applications", formData);
      return res.data;
    },
    onSuccess: (data) => {
      toast("✅ Application Submitted", {
        description: "We’ll review your host request shortly.",
        action: {
          label: "Okay",
          onClick: () => console.log("Confirmed"),
        },
      });
      reset();
      queryClient.invalidateQueries(["hostApplications"]);
    },
    onError: (error) => {
      toast("❌ Submission Failed", {
        description:
          error.response?.data?.message || "Something went wrong. Try again.",
      });
    },
  });

  const onSubmit = (data) => {
    if (!session?.user) {
      toast("⚠️ Login Required", {
        description: "Please log in to apply as a host.",
      });
      return;
    }

    mutation.mutate({
      ...data,
      userId: session?.user?._id,
      email: session?.user?.email,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <RippleButton rippleColor="">Apply</RippleButton>
      </DialogTrigger>

      <DialogContent className="max-w-md border-none p-0 shadow-none bg-transparent">
        <Card className="w-full border-none p-0 shadow-none bg-transparent">
          <MagicCard
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
            className="p-0"
          >
            <CardHeader className="border-border border-b p-4">
              <CardTitle className="text-xl font-semibold">
                Become a Host
              </CardTitle>
              <CardDescription>
                Fill out the form below to apply as a property host.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    {...register("fullName", { required: true })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+8801XXXXXXXXX"
                    {...register("phone", { required: true })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Property Type</Label>
                  <Select
                    onValueChange={(value) => setValue("propertyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Resort">Resort</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">Message (optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your property..."
                    {...register("message")}
                  />
                </div>

                <CardFooter className="p-0 pt-2">
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full"
                  >
                    {mutation.isPending
                      ? "Submitting..."
                      : "Submit Application"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </MagicCard>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
