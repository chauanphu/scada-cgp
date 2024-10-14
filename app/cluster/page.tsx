// app/pages/cluster.page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Unit, ClusterFull, UserShortened } from '@/lib/api';

const ClusterPage: React.FC = () => {
  const [clusters, setClusters] = useState<ClusterFull[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<ClusterFull | null>(null);
  const [users, setUsers] = useState<UserShortened[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newCluster, setNewCluster] = useState<{ id?: number; name: string; units: Unit[]; assignedUsers: number[] }>({
    name: '',
    units: [{ id: 0, name: '', address: '', latitude: 0, longitude: 0 }],
    assignedUsers: [],
  });

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const response = await fetch('/api/cluster?full=true');
        if (!response.ok) {
          throw new Error('Error fetching clusters');
        }
        const data = await response.json();
        setClusters(data);
      } catch (error) {
        console.error('Error fetching clusters:', error);
      }
    };
    fetchClusters();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error('Error fetching users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleOpenModal = (cluster?: ClusterFull) => {
    if (cluster) {
      setEditMode(true);
      setNewCluster({
        id: cluster.id,
        name: cluster.name,
        units: cluster.units,
        assignedUsers: cluster.account ? [cluster.account.user_id] : [],
      });
    } else {
      setEditMode(false);
      setNewCluster({ name: '', units: [{ id: 0, name: '', address: '', latitude: 0, longitude: 0 }], assignedUsers: [] });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCluster({ name: '', units: [{ id: 0, name: '', address: '', latitude: 0, longitude: 0 }], assignedUsers: [] });
  };

  const handleSaveCluster = async () => {
    try {
      const response = await fetch(`/api/cluster${editMode ? `/${newCluster.id}` : ''}`, {
        method: editMode ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCluster),
      });
      if (!response.ok) {
        throw new Error('Error saving cluster');
      }
      const data = await response.json();
      if (editMode) {
        setClusters(clusters.map(cluster => (cluster.id === data.id ? data : cluster)));
      } else {
        setClusters([...clusters, data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving cluster:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cluster Management</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Cluster Name</th>
            <th className="py-2 px-4 border-b">Units</th>
            <th className="py-2 px-4 border-b">Assigned User</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clusters.map((cluster) => (
            <tr key={cluster.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{cluster.name}</td>
              <td className="py-2 px-4 border-b">
                {cluster.units.map((unit) => (
                  <div key={unit.id} className="text-sm">
                    {unit.name} - {unit.address}
                  </div>
                ))}
              </td>
              <td className="py-2 px-4 border-b">
                {cluster.account ? cluster.account.username : 'Unassigned'}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleOpenModal(cluster)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
        onClick={() => handleOpenModal()}
      >
        + Add New Cluster
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded w-[600px]">
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Cluster' : 'Create New Cluster'}</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Cluster Name</label>
              <input
                type="text"
                value={newCluster.name}
                onChange={(e) => setNewCluster({ ...newCluster, name: e.target.value })}
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Units (at least one)</label>
              {newCluster.units.map((unit, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="Unit Name"
                    value={unit.name}
                    onChange={(e) => {
                      const updatedUnits = [...newCluster.units];
                      updatedUnits[index].name = e.target.value;
                      setNewCluster({ ...newCluster, units: updatedUnits });
                    }}
                    className="border rounded p-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Unit Address"
                    value={unit.address}
                    onChange={(e) => {
                      const updatedUnits = [...newCluster.units];
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
                    units: [...newCluster.units, { id: 0, name: '', address: '', latitude: 0, longitude: 0 }],
                  })
                }
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
              >
                + Add Unit
              </button>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Assigned Users</label>
              <div className="border rounded p-2 h-[150px] overflow-y-auto">
                {users.map((user) => (
                  <div key={user.user_id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={newCluster.assignedUsers.includes(user.user_id)}
                      onChange={() => {
                        if (newCluster.assignedUsers.includes(user.user_id)) {
                          setNewCluster({
                            ...newCluster,
                            assignedUsers: newCluster.assignedUsers.filter((id) => id !== user.user_id),
                          });
                        } else {
                          setNewCluster({
                            ...newCluster,
                            assignedUsers: [...newCluster.assignedUsers, user.user_id],
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    <label>{user.username}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
              > 
                Cancel
              </button>
              <button
                onClick={handleSaveCluster}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {editMode ? 'Save Changes' : 'Create Cluster'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClusterPage;