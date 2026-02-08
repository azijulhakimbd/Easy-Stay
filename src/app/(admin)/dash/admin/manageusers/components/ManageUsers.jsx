'use client';

import { useState, useEffect } from 'react';
import { Search, Users, Filter, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function ManageUsers() {
 
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');



  const {data:users,isError,error,isLoading:loading}=useQuery({
    queryKey:['users',"list"],
    queryFn:async()=>{
      const response=await axios.get("/api/users")
      return response.data

    }
  })
  // Delete User
  const handleUserDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete user?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`/api/user/${id}`, { method: 'DELETE' });
      const result = await response.json();

      if (result.status === 'success') {
        setUsers(users.filter((u) => u._id !== id));
        Swal.fire('Deleted!', 'User removed successfully.', 'success');
      } else {
        throw new Error(result.error || 'Failed to delete user');
      }
    } catch (err) {
      Swal.fire('Error!', err.message, 'error');
    }
  };

  // Change Role
  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await fetch(`/api/user/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const result = await response.json();

      if (result.status === 'success') {
        setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
        Swal.fire('Updated!', `Role changed to ${newRole}`, 'success');
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      Swal.fire('Error!', err.message, 'error');
    }
  };

  // Filtered Users
  const filteredUsers = users && users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
        <p className="text-lg font-semibold mb-3">Error: {error}</p>
        <button
          onClick={fetchUsers}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-3">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Users /> User Management
          </h1>
          <p className="text-gray-500">Manage and control platform users</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="relative w-full sm:w-1/4">
            <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="host">Host</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-x-auto overflow-y-auto max-h-[75vh]">
          <table className="min-w-full text-sm text-gray-700">

            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Joined</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <img
                        src={user.profilePhoto || '/default-avatar.png'}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{user.fullName || 'No Name'}</p>
                        <p className="text-gray-500 text-xs">@{user.username}</p>
                      </div>
                    </td>

                    <td className="py-3 px-4">{user.email}</td>

                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`text-sm font-medium rounded-lg px-2 py-1 border ${user.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : user.role === 'host'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        <option value="user">User</option>
                        <option value="host">Host</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      {user.isVerified ? (
                        <span className="flex items-center text-green-600 font-medium">
                          <CheckCircle2 size={16} className="mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center text-yellow-600 font-medium">
                          <XCircle size={16} className="mr-1" /> Unverified
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleUserDelete(user._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500 italic">
                    No users found.
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
