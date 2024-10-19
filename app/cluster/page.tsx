"use client";

import React, { useState, useEffect } from "react";
import { Unit, Cluster } from "@/types/Cluster";
import { NEXT_PUBLIC_API_URL, getClusters } from "@/lib/api";
import Cookies from "js-cookie";

type CreateClusterForm = {
  id: number | null;
  name?: string;
  units?: Unit[];
};

const ClusterPage: React.FC = () => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newCluster, setNewCluster] = useState<CreateClusterForm>({
    id: null,
    name: "",
    units: [{ id: 0, name: "", address: "" }],
  });
  const [originalCluster, setOriginalCluster] = useState<Cluster | null>(null);

  useEffect(() => {
    const token = Cookies.get("token") || "";
    getClusters(token).then((data) => setClusters(data));
  }, []);

  const handleOpenModal = (cluster?: Cluster) => {
    if (cluster) {
      setEditMode(true);
      setNewCluster({
        id: cluster.id,
        name: cluster.name,
        units: cluster.units,
      });
      setOriginalCluster(cluster);
    } else {
      setEditMode(false);
      setNewCluster({ id: null, name: "", units: [{ id: 0, name: "", address: "" }] });
      setOriginalCluster(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCluster({ id: null, name: "", units: [{ id: 0, name: "", address: "" }] });
    setOriginalCluster(null);
  };

  const handleSaveCluster = async () => {
    try {
      if (!newCluster) {
        throw new Error("Thiếu dữ liệu cụm");
      }
      const partialUpdate: CreateClusterForm = {};

      // Check for changes in name
      if (originalCluster?.name !== newCluster.name) {
        partialUpdate.name = newCluster.name;
      }

      // Check for changes in units
      if (originalCluster?.units !== newCluster.units) {
        partialUpdate.units = newCluster.units;
      }

      // Send partial update if in edit mode
      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/clusters${editMode ? `/${newCluster.id}` : ""}`,
        {
          method: editMode ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editMode ? partialUpdate : newCluster),
        }
      );
      if (!response.ok) {
        throw new Error("Lỗi khi lưu cụm");
      }
      const data = await response.json();
      if (editMode) {
        setClusters(
          clusters.map((cluster) => (cluster.id === data.id ? data : cluster))
        );
      } else {
        setClusters([...clusters, data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi lưu cụm:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý cụm</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Tên cụm</th>
            <th className="py-2 px-4 border-b">Đơn vị</th>
            <th className="py-2 px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {clusters.map((cluster) => (
            <tr key={cluster.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{cluster.name}</td>
              <td className="py-2 px-4 border-b">
                <ul className="list-disc pl-5">
                  {cluster.units.map((unit) => (
                    <li key={unit.id} className="text-sm">
                      <strong>{unit.name}</strong>: {unit.address}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleOpenModal(cluster)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                >
                  Sửa
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
        onClick={() => handleOpenModal()}
      >
        + Thêm cụm mới
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded w-[600px]">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? "Sửa cụm" : "Tạo cụm mới"}
            </h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Tên cụm</label>
              <input
                type="text"
                value={newCluster.name}
                onChange={(e) =>
                  setNewCluster({ ...newCluster, name: e.target.value })
                }
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">
                Đơn vị (ít nhất một)
              </label>
              {newCluster.units?.map((unit, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="Tên đơn vị"
                    value={unit.name}
                    onChange={(e) => {
                      const updatedUnits = [...newCluster.units!];
                      updatedUnits[index].name = e.target.value;
                      setNewCluster({ ...newCluster, units: updatedUnits });
                    }}
                    className="border rounded p-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Địa chỉ đơn vị"
                    value={unit.address}
                    onChange={(e) => {
                      const updatedUnits = [...newCluster.units!];
                      updatedUnits[index].address = e.target.value;
                      setNewCluster({ ...newCluster, units: updatedUnits });
                    }}
                    className="border rounded p-2 w-full"
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  setNewCluster({
                    ...newCluster,
                    units: [
                      ...newCluster.units!,
                      { id: 0, name: "", address: "" },
                    ],
                  })
                }
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
              >
                + Thêm đơn vị
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveCluster}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {editMode ? "Lưu thay đổi" : "Tạo cụm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClusterPage;
