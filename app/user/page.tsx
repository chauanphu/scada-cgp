"use client";

import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { deleteUser, getRoles, Role, updateUser } from "@/lib/api";
import Cookies from 'js-cookie';

// Kiểu dữ liệu cho User nhận từ máy chủ
type User = {
  user_id: number;
  username: string;
  email: string;
  role: {
    role_id: number;
    role_name: string;
  };
};

// Kiểu dữ liệu cho biểu mẫu tạo người dùng, bao gồm confirmPassword
type CreateUserForm = {
  username: string;
  email: string;
  role: {
    role_id: number;
    role_name: string;
  } | null;
  password: string;
  confirmPassword: string;
};

// Kiểu dữ liệu cho yêu cầu tạo người dùng gửi đến máy chủ
type CreateUserRequest = {
  username: string;
  email: string;
  role: {
    role_id: number;
    role_name: string;
  };
  password: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [newUser, setNewUser] = useState<CreateUserForm>({
    username: "",
    email: "",
    role: null,
    password: "",
    confirmPassword: "",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Lấy tất cả người dùng
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Đảm bảo cookie được gửi đi
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Không lấy được người dùng");
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

  // Lấy tất cả vai trò
  const fetchRoles = async () => {
    setLoading(true);
    setError("");
    try {
      // Lấy token từ cookie
      const token = Cookies.get('token') || '';
      const rolesData = await getRoles(token);
      setRoles(rolesData);
    } catch (err: any) {
      console.error(err);
      setError("Không lấy được vai trò.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tạo người dùng mới
  const handleCreateUser = async () => {
    // Kiểm tra hợp lệ phía khách hàng
    if (
      !newUser.username ||
      !newUser.email ||
      !newUser.role ||
      !newUser.password ||
      !newUser.confirmPassword
    ) {
      console.log(newUser)
      setError("Vui lòng điền đầy đủ các trường.");
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }

    // Tùy chọn, thêm kiểm tra hợp lệ khác (ví dụ: định dạng email, độ mạnh mật khẩu)

    setLoading(true);
    setError("");
    try {
      // Chuẩn bị payload bằng cách loại bỏ confirmPassword
      const { username, email, role, password } = newUser;
      const payload: CreateUserRequest = { username, email, role, password };

      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Đảm bảo cookie được gửi đi
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Không tạo được người dùng");
      }

      const createdUser: User = await response.json();
      setUsers([...users, createdUser]);
      setNewUser({
        username: "",
        email: "",
        role: null,
        password: "",
        confirmPassword: "",
      });
      setIsModalOpen(false); // Đóng modal khi thành công
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý cập nhật người dùng
  const handleUpdateUser = async () => {
    if (!editingUser) return;

    if (!editingUser.username || !editingUser.email || !editingUser.role) {
      setError("Vui lòng điền đầy đủ các trường cho người dùng.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = Cookies.get('token') || '';
      const updatedUser = await updateUser(token, editingUser.user_id, editingUser);
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

  // Xử lý xóa người dùng
  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    setLoading(true);
    setError("");
    try {
      const token = Cookies.get('token') || '';
      await deleteUser(token, userId);
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
      <h1 className="text-2xl mb-4">Quản Lý Người Dùng</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Nút Tạo Người Dùng Mới */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Tạo Người Dùng Mới
      </button>

      {/* Modal Tạo Người Dùng */}
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
                    Tạo Người Dùng Mới
                  </Dialog.Title>
                  <div className="mt-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateUser();
                      }}
                    >
                      {/* Tên Người Dùng */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                          Tên Người Dùng
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

                      {/* Vai Trò */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                          Vai Trò
                        </label>
                        <select
                          id="role"
                          value={newUser.role?.role_id}
                          onChange={(e) =>
                            setNewUser({ ...newUser, role: {
                              role_id: Number(e.target.value),
                              role_name: roles.find((role) => role.role_id === Number(e.target.value))?.role_name || ""
                            } })
                          }
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        >
                          {roles.map((role) => (
                            <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Mật Khẩu */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                          Mật Khẩu
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

                      {/* Xác Nhận Mật Khẩu */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                          Xác Nhận Mật Khẩu
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

                      {/* Nút Gửi */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                          disabled={loading}
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          disabled={loading}
                        >
                          {loading ? "Đang tạo..." : "Tạo"}
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

      {/* Bảng Người Dùng */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border p-2">Tên Người Dùng</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Vai Trò</th>
              <th className="border p-2">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-100">
                {/* Tên Người Dùng */}
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

                {/* Vai Trò */}
                <td className="border p-2">
                  {editingUser?.user_id === user.user_id ? (
                    <select
                      value={editingUser?.role.role_id}
                      onChange={(e) =>
                        setEditingUser({  
                          ...editingUser!,
                          role: {
                            role_id: Number(e.target.value),
                            role_name: roles.find((role) => role.role_id === Number(e.target.value))?.role_name || ""
                          }
                        })
                      }
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      {roles.map((role) => (
                        <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                      ))}
                    </select>
                  ) : user.role.role_name}
                </td>

                {/* Hành Động */}
                <td className="border p-2">
                  {editingUser?.user_id === user.user_id ? (
                    <>
                      <button
                        onClick={handleUpdateUser}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                        disabled={loading}
                      >
                        {loading ? "Đang lưu..." : "Lưu"}
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        disabled={loading}
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingUser(user)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.user_id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && <div className="mt-4">Đang tải...</div>}
      </div>
    </div>
  );
}