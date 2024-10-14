// app/user/page.tsx

"use client";

import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

// Type for User as received from the server
type User = {
  user_id: number;
  username: string;
  email: string;
  role: number;
};

// Type for the user creation form, including confirmPassword
type CreateUserForm = {
  username: string;
  email: string;
  role: number;
  password: string;
  confirmPassword: string;
};

// Type for the user creation request sent to the server
type CreateUserRequest = {
  username: string;
  email: string;
  role: number;
  password: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<CreateUserForm>({
    username: "",
    email: "",
    role: 2,
    password: "",
    confirmPassword: "",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures cookies are sent
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch users");
      }

      const data: User[] = await response.json();
      setUsers(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new user
  const handleCreateUser = async () => {
    // Client-side Validation
    if (
      !newUser.username ||
      !newUser.email ||
      !newUser.role ||
      !newUser.password ||
      !newUser.confirmPassword
    ) {
      setError("Please fill out all fields.");
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Optionally, add more validation (e.g., email format, password strength)

    setLoading(true);
    setError("");
    try {
      // Prepare the payload by excluding confirmPassword
      const { username, email, role, password } = newUser;
      const payload: CreateUserRequest = { username, email, role, password };

      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures cookies are sent
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create user");
      }

      const createdUser: User = await response.json();
      setUsers([...users, createdUser]);
      setNewUser({
        username: "",
        email: "",
        role: 2,
        password: "",
        confirmPassword: "",
      });
      setIsModalOpen(false); // Close the modal upon success
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle updating a user
  const handleUpdateUser = async () => {
    if (!editingUser) return;

    if (!editingUser.username || !editingUser.email || !editingUser.role) {
      setError("Please fill out all fields for the user.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/user/${editingUser.user_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures cookies are sent
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update user");
      }

      const updatedUser: User = await response.json();
      setUsers(
        users.map((user) => (user.user_id === updatedUser.user_id ? updatedUser : user))
      );
      setEditingUser(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures cookies are sent
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      setUsers(users.filter((user) => user.user_id !== userId));
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">User Management</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Create New User Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Create New User
      </button>

      {/* User Creation Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Create New User
                  </Dialog.Title>
                  <div className="mt-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateUser();
                      }}
                    >
                      {/* Username */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          value={newUser.username}
                          onChange={(e) =>
                            setNewUser({ ...newUser, username: e.target.value })
                          }
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>

                      {/* Role */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                          Role
                        </label>
                        <select
                          id="role"
                          value={newUser.role}
                          onChange={(e) =>
                            setNewUser({ ...newUser, role: Number(e.target.value) })
                          }
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        >
                          <option value={1}>Admin</option>
                          <option value={2}>User</option>
                        </select>
                      </div>

                      {/* Password */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={newUser.password}
                          onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                          }
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>

                      {/* Confirm Password */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={newUser.confirmPassword}
                          onChange={(e) =>
                            setNewUser({ ...newUser, confirmPassword: e.target.value })
                          }
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          disabled={loading}
                        >
                          {loading ? "Creating..." : "Create"}
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border p-2">Username</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-100">
                {/* Username */}
                <td className="border p-2">
                  {editingUser?.user_id === user.user_id ? (
                    <input
                      type="text"
                      value={editingUser?.username || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser!,
                          username: e.target.value,
                        })
                      }
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  ) : (
                    user.username
                  )}
                </td>

                {/* Email */}
                <td className="border p-2">
                  {editingUser?.user_id === user.user_id ? (
                    <input
                      type="email"
                      value={editingUser?.email || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser!,
                          email: e.target.value,
                        })
                      }
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  ) : (
                    user.email
                  )}
                </td>

                {/* Role */}
                <td className="border p-2">
                  {editingUser?.user_id === user.user_id ? (
                    <select
                      value={editingUser?.role || 2}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser!,
                          role: Number(e.target.value),
                        })
                      }
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value={1}>Admin</option>
                      <option value={2}>User</option>
                    </select>
                  ) : user.role === 1 ? (
                    "Admin"
                  ) : (
                    "User"
                  )}
                </td>

                {/* Actions */}
                <td className="border p-2">
                  {editingUser?.user_id === user.user_id ? (
                    <>
                      <button
                        onClick={handleUpdateUser}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingUser(user)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.user_id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && <div className="mt-4">Loading...</div>}
      </div>
    </div>
  );
}
