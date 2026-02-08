"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function ApproveHosts() {
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("/api/host-applications");
      setApplications(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load host applications");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await axios.patch(`/api/host-applications/${id}`, { status });
      toast.success(res.data.message);
      fetchApplications();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const openModal = (message) => {
    setModalMessage(message || "No additional message provided.");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Host Application Approvals
      </h1>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Property Type</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr
                  key={app._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">{app.fullName}</td>
                  <td className="px-4 py-3">{app.email}</td>
                  <td className="px-4 py-3">{app.phone}</td>
                  <td className="px-4 py-3">{app.propertyType}</td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => openModal(app.message)}
                    >
                      View Message
                    </Button>
                  </td>
                  <td className="px-4 py-3 capitalize font-medium">
                    {app.status === "approved" && (
                      <span className="text-green-600 font-semibold">Approved</span>
                    )}
                    {app.status === "rejected" && (
                      <span className="text-red-600 font-semibold">Rejected</span>
                    )}
                    {app.status === "pending" && (
                      <span className="text-blue-600 font-semibold">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
  {app.status === "pending" && (
    <div className="flex gap-2 justify-end">
      <Button
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={() => handleStatusChange(app._id, "approved")}
      >
        Approve
      </Button>
      <Button
        size="sm"
        className="bg-red-600 hover:bg-red-700 text-white"
        onClick={() => handleStatusChange(app._id, "rejected")}
      >
        Reject
      </Button>
    </div>
  )}
</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500 italic">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <h3 className="text-xl font-bold mb-4">Host Message</h3>
            <p className="text-gray-700 mb-4">{modalMessage}</p>
            <Button
              onClick={closeModal}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
