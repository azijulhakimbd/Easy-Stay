"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
} from "@/components/ui/form";
import { Loader2, UserPen, Mail, Phone, MapPin, Globe, Camera } from "lucide-react";

// Languages list
const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "zh", label: "Chinese" },
    { code: "hi", label: "Hindi" },
    { code: "ar", label: "Arabic" },
    { code: "pt", label: "Portuguese" },
    { code: "ru", label: "Russian" },
    { code: "ja", label: "Japanese" },
    { code: "bn", label: "Bengali" },
    { code: "pa", label: "Punjabi" },
    { code: "ko", label: "Korean" },
    { code: "it", label: "Italian" },
    { code: "tr", label: "Turkish" },
];

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const form = useForm({
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            gender: "",
            preferredLanguages: [],
            currentCity: "",
            address: "",
            profilePhoto: "",
        },
        mode: "onChange", // to enable button disable on change
    });

    const { watch, formState, handleSubmit, reset, setValue } = form;
    const allFields = watch();

    useEffect(() => {
        if (!session?.user?._id) return;

        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/user/${session.user._id}`);
                const data = await res.json();
                if (data.status === "success") {
                    setUser(data.data);
                    reset({
                        fullName: data.data.fullName || "",
                        phoneNumber: data.data.phoneNumber || "",
                        gender: data.data.gender || "",
                        preferredLanguages: data.data.preferredLanguages || [],
                        currentCity: data.data.currentCity || "",
                        address: data.data.address || "",
                        profilePhoto: data.data.profilePhoto || "",
                    });
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load user details");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [session?.user?._id, reset]);

    const handleUpdate = async (formData) => {
        try {
            const payload = { ...formData };
            delete payload.username;
            delete payload.email;
            console.log(payload);

            const res = await fetch(`/api/user/${user._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const responseData = await res.json();
            if (!res.ok || responseData.status !== "success") {
                throw new Error(responseData.message || "Failed to update profile");
            }

            setUser(responseData.data);
            console.log(responseData);
            setEditing(false);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error("Update error:", err);
            toast.error(err.message || "Update failed");
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin w-12 h-12 text-rose-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <p className="text-gray-500 text-lg">No user found.</p>
            </div>
        );
    }

    const isFormComplete = Object.values(allFields).every(
        (v) => (Array.isArray(v) ? v.length > 0 : v && v.trim() !== "")
    );

    return (
        <div className="min-h-screen">
            <div className="max-w-full mx-auto min-w-sm">
                {/* Header */}
                <div className="text-center mb-4">
                    {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1> */}
                    <p className="text-gray-600">Manage {user?.username}'s personal information and preferences</p>
                </div>

                <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/80 to-primary p-6 text-white flex flex-col sm:flex-row items-center gap-6">
                        {/* <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                                {watch("profilePhoto") ? (
                                    <img
                                        src={watch("profilePhoto")}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <UserPen className="w-10 h-10 text-white/80" />
                                )}
                            </div>
                            {editing && (
                                <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg">
                                    <Camera className="w-4 h-4 text-gray-700" />
                                </div>
                            )}
                        </div> */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                                {watch("profilePhoto") ? (
                                    <img
                                        src={watch("profilePhoto")}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <UserPen className="w-10 h-10 text-white/80" />
                                )}
                            </div>

                            {/* Role Badge overlay */}
                            <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                {user.role}
                            </span>

                            {editing && (
                                <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg">
                                    <Camera className="w-4 h-4 text-gray-700" />
                                </div>
                            )}
                        </div>


                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-2xl font-bold mb-1">
                                {user.fullName || "Add your name"}
                            </h2>
                            <p className="text-white/80">@{user.username}</p>
                            <p className="text-white/80 flex items-center justify-center sm:justify-start gap-2 mt-1">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </p>
                            
                        </div>

                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setEditing(!editing)}
                            className="bg-white/20 text-white font-semibold backdrop-blur-md  border border-white/30 
  rounded-xl px-6 py-3 flex items-center gap-2 shadow-lg
  transform transition-all duration-200 ease-out
  hover:scale-105 hover:bg-white/30 hover:shadow-2xl
"
                        >
                            <UserPen className="w-4 h-4 mr-2" />
                            {editing ? "Cancel" : "Edit Profile"}
                        </Button>

                    </div>

                    <CardContent className="p-8">
                        {!editing ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* View Mode */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <UserPen className="w-5 h-5 text-rose-500" /> Personal Information
                                        </h3>
                                        <p>Full Name: {user.fullName || "-"}</p>
                                        <p>Username: {user.username}</p>
                                        <p>Gender: {user.gender || "-"}</p>
                                    </div>

                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Phone className="w-5 h-5 text-rose-500" /> Contact Details
                                        </h3>
                                        <p>Phone Number: {user.phoneNumber || "-"}</p>
                                        <p>Email: {user.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-rose-500" /> Location Information
                                        </h3>
                                        <p>Current City: {user.currentCity || "-"}</p>
                                        <p>Address: {user.address || "-"}</p>
                                    </div>

                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Globe className="w-5 h-5 text-rose-500" /> Preferences
                                        </h3>
                                        <p>
                                            Preferred Languages:{" "}
                                            {user.preferredLanguages
                                                ?.map((code) => LANGUAGES.find((l) => l.code === code)?.label)
                                                .join(", ") || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form
                                    onSubmit={handleSubmit(handleUpdate)}
                                    className="space-y-8"
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            {/* Personal Info */}
                                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                    Personal Information
                                                </h3>
                                                <FormField
                                                    control={form.control}
                                                    name="fullName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Full Name</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Enter your full name"
                                                                    required
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="gender"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Gender</FormLabel>
                                                            <FormControl>
                                                                <select
                                                                    {...field}
                                                                    required
                                                                    className="border-gray-300 p-2 rounded-md w-full"
                                                                >
                                                                    <option value="">Select gender</option>
                                                                    <option value="male">Male</option>
                                                                    <option value="female">Female</option>
                                                                    <option value="other">Other</option>
                                                                </select>
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <p>Username: {user.username} (cannot change)</p>
                                            </div>

                                            {/* Contact Details */}
                                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                    Contact Details
                                                </h3>
                                                <FormField
                                                    control={form.control}
                                                    name="phoneNumber"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Phone Number</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Enter your phone number"
                                                                    required
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <p>Email: {user.email} (cannot change)</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Location */}
                                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                    Location Information
                                                </h3>
                                                <FormField
                                                    control={form.control}
                                                    name="currentCity"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Current City</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Enter your city"
                                                                    required
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="address"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Address</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    {...field}
                                                                    placeholder="Enter your full address"
                                                                    rows={3}
                                                                    required
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Preferences */}
                                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                    Preferences
                                                </h3>

                                                <FormField
                                                    control={form.control}
                                                    name="preferredLanguages"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Preferred Languages</FormLabel>
                                                            <FormControl>
                                                                <div className="flex flex-wrap gap-2 border p-2 rounded-md items-center">
                                                                    {field.value?.map((code) => {
                                                                        const lang = LANGUAGES.find(
                                                                            (l) => l.code === code
                                                                        );
                                                                        return (
                                                                            <div
                                                                                key={code}
                                                                                className="bg-rose-100 text-rose-800 px-2 py-1 rounded-full flex items-center gap-1"
                                                                            >
                                                                                {lang?.label}
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        field.onChange(
                                                                                            field.value.filter(
                                                                                                (v) => v !== code
                                                                                            )
                                                                                        )
                                                                                    }
                                                                                    className="text-red-500 font-bold ml-1"
                                                                                >
                                                                                    &times;
                                                                                </button>
                                                                            </div>
                                                                        );
                                                                    })}

                                                                    <select
                                                                        value=""
                                                                        onChange={(e) => {
                                                                            const selected = e.target.value;
                                                                            if (
                                                                                selected &&
                                                                                !field.value.includes(selected)
                                                                            ) {
                                                                                field.onChange([
                                                                                    ...field.value,
                                                                                    selected,
                                                                                ]);
                                                                            }
                                                                        }}
                                                                        className="border-none outline-none"
                                                                    >
                                                                        <option value="" disabled>
                                                                            Add language
                                                                        </option>
                                                                        {LANGUAGES.filter(
                                                                            (l) => !field.value.includes(l.code)
                                                                        ).map((lang) => (
                                                                            <option
                                                                                key={lang.code}
                                                                                value={lang.code}
                                                                            >
                                                                                {lang.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="profilePhoto"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Profile Photo URL</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="https://example.com/photo.jpg"
                                                                    required
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center pt-4">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!isFormComplete || formState.isSubmitting}
                                        >
                                            {formState.isSubmitting ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
