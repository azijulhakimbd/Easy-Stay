'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ManageReviewsTable() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      setReviews(data.reviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleVerificationUpdate = async (reviewId, verified) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified }),
      });
      if (!res.ok) throw new Error('Failed to update review');
      const updated = await res.json();
      setReviews(reviews.map(r => r._id === reviewId ? updated : r));
      Swal.fire('Success', `Review marked as ${verified ? 'verified' : 'unverified'}`, 'success');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleDelete = async (reviewId) => {
    const result = await Swal.fire({
      title: 'Delete Review?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete review');
      setReviews(reviews.filter(r => r._id !== reviewId));
      Swal.fire('Deleted', 'Review has been deleted', 'success');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleView = (review) => {
    let adminReplyHtml = '';
    if (review.adminReply) {
      adminReplyHtml = `<p><strong>Admin Reply:</strong> ${review.adminReply}</p>`;
    }

    Swal.fire({
  title: `<strong>${review.userName || 'Anonymous'}'s Review</strong>`,
  html: `
    <p><strong>Property:</strong> ${review.property?.title || '-'}</p>
    <p><strong>Email:</strong> ${review.email || '-'}</p>
    <p><strong>Rating:</strong> ${review.rating} / 5</p>
    <p><strong>Comment:</strong> ${review.comment || '-'}</p>
    <p><strong>Status:</strong> ${review.verified ? 'Verified' : 'Pending'}</p>
    ${review.adminReply ? `<p><strong>Admin Reply:</strong> ${review.adminReply}</p>` : ''}
  `,
  showCloseButton: true,
  focusConfirm: false,
  confirmButtonText: 'Close',
  showDenyButton: true,
  denyButtonText: review.adminReply ? 'Already Replied' : 'Reply',
  denyButtonColor: review.adminReply ? '#9CA3AF' : '#2563EB', // gray if disabled
  denyButtonDisabled: !!review.adminReply, // disable if reply exists
  customClass: { popup: 'p-6 text-left' },
}).then(async (result) => {
  if (result.isDenied && !review.adminReply) {
    const { value: reply } = await Swal.fire({
      title: 'Send Reply',
      input: 'textarea',
      inputLabel: 'Type your reply here',
      inputValue: review.adminReply || '',
      showCancelButton: true,
      confirmButtonText: 'Send',
      cancelButtonText: 'Cancel',
      inputAttributes: { 'aria-label': 'Type your reply here' },
      preConfirm: (value) => value.trim() || Swal.showValidationMessage('Reply cannot be empty')
    });

    if (reply) {
      try {
        const res = await fetch(`/api/reviews/${review._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminReply: reply }),
        });
        if (!res.ok) throw new Error('Failed to send reply');
        const updated = await res.json();
        setReviews(reviews.map(r => r._id === review._id ? updated : r));
        Swal.fire('Sent!', 'Your reply has been sent.', 'success');
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  }
});

  };


  const filteredReviews = reviews.filter(r => {
    const matchesSearch =
      r.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.property?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVerification =
      verificationFilter === 'all' ||
      (verificationFilter === 'verified' && r.verified) ||
      (verificationFilter === 'unverified' && !r.verified);

    return matchesSearch && matchesVerification;
  });


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Manage Property Reviews</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-1/2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-1/4 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
          >
            <option value="all">All Reviews</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[70vh] border rounded-lg shadow-sm">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Property</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((r) => (
                  <tr key={r._id}>
                    <td className="px-4 py-3 whitespace-nowrap">{r.userName || 'Anonymous'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.email || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleView(r)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        View / Reply
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.rating} / 5</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {r.verified ? (
                        <span className="text-green-600 font-semibold">Verified</span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex flex-wrap justify-center gap-2">
                      {!r.verified && (
                        <button
                          onClick={() => handleVerificationUpdate(r._id, true)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Verify
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(r._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
