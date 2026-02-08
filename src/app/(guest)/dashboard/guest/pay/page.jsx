"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

export default function PaymentPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?._id) return;

      try {
        // 1️⃣ Fetch user bookings
        const resBookings = await fetch(`/api/bookings?id=${session.user._id}`);
        const dataBookings = await resBookings.json();
        const allBookings = dataBookings.data || [];
        allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBookings(allBookings);

        // 2️⃣ Fetch all properties once
        const resProps = await axios.get("/api/property/all");
        const allProps = resProps.data.data;

        // 3️⃣ Map propertyId → property object for quick lookup
        const propMap = {};
        allProps.forEach((p) => {
          propMap[p._id] = p;
        });
        setProperties(propMap);

      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch bookings or properties");
      }
    };

    fetchData();
  }, [session]);

  const handlePayNow = (booking) => {
  // Redirect to your payment page with query params
  router.push(`/dashboard/guest/payment/?bookingId=${booking._id}&amount=${booking.totalPrice}`);
};

  const today = new Date();
  const payableStays = bookings.filter(
    (b) => b.payment_status === "unpaid" && new Date(b.checkOutDate) >= today
  );
  const paidStays = bookings.filter((b) => b.payment_status === "paid");
  const expiredStays = bookings.filter(
    (b) => b.payment_status === "unpaid" && new Date(b.checkOutDate) < today
  );

  const renderSection = (title, stays, type, color) => (
    <div className="mb-10">
      <h2 className={`text-2xl font-semibold mb-4 ${color}`}>{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stays.length > 0 ? (
          stays.map((b) => {
            const prop = properties[b.propertyId];

            return (
              <Card
                key={b._id}
                className="border border-gray-200 pt-0 shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {prop?.images?.[0] && (
                  <img
                    src={prop.images[0].url}
                    alt={prop.title || "Property"}
                    className="w-full h-40 object-cover"
                  />
                )}
{
  console.log(prop?.images)
}
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {prop?.title || "Property Name"}
                  </CardTitle>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    📍 {prop?.city || "Unknown location"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(b.checkInDate).toLocaleDateString()} →{" "}
                    {new Date(b.checkOutDate).toLocaleDateString()}
                  </p>
                </CardHeader>

                <Separator />

                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {prop?.description || "No description available."}
                  </p>

                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Guests: {b.guests}</p>
                      <p className="text-base font-semibold mt-1 text-gray-800">
                        ${b.totalPrice}
                      </p>
                    </div>

                    {type === "payable" && (
                      <Button
                        onClick={() => handlePayNow(b)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Pay Now
                      </Button>
                    )}
                    {type === "paid" && (
                      <span className="text-green-600 font-semibold">Paid</span>
                    )}
                    {type === "expired" && (
                      <span className="text-red-600 font-semibold text-sm">
                        Payment Overdue
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="text-gray-500 col-span-full text-sm">
            No {title.toLowerCase()} available.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Your Payment Overview</h1>
      {renderSection("Payable Stays", payableStays, "payable", "text-blue-600")}
      {renderSection("Paid Stays", paidStays, "paid", "text-green-600")}
      {renderSection("Expired Stays", expiredStays, "expired", "text-red-600")}
    </div>
  );
}
