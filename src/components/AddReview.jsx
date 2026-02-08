"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function AddReview({ propertyId, bookingId, onReviewAdded }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e) => {
    setPhotos([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please log in to submit a review.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("propertyId", propertyId);
      if (bookingId) formData.append("bookingId", bookingId);
      formData.append("userId", session.user._id);
      formData.append("rating", rating);
      formData.append("comment", comment);

      photos.forEach((photo, index) => {
        formData.append("photos", photo);
      });

      const res = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Review submitted successfully!");
        setRating(5);
        setComment("");
        setPhotos([]);
        onReviewAdded && onReviewAdded(data.review);
      } else {
        toast.error(data.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow-sm bg-white">
      <h3 className="text-lg font-semibold">Add Your Review</h3>

      <div>
        <label className="block font-medium mb-1">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          rows={4}
          placeholder="Write your review..."
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Upload Photos (optional):</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoChange}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
