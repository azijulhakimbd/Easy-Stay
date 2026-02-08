"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ReviewsList({ propertyId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?propertyId=${propertyId}`);
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [propertyId]);

  if (loading) return <p>Loading reviews...</p>;
  if (reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-2xl">Reviews</h3>
      {reviews.map((r) => (
        <div key={r._id} className="border p-4 rounded shadow-sm bg-white">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">{r.userName || "Anonymous"}</p>
            <span className="text-yellow-500 font-bold">{r.rating}★</span>
          </div>
          <p className="mb-2">{r.comment}</p>
          {r.photos && r.photos.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {r.photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`review photo ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          )}
          {r.adminReply && (
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <p className="text-gray-700 font-medium">Admin Reply:</p>
              <p className="text-gray-800">{r.adminReply}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
