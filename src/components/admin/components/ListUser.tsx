import React from "react";
import User from "../../../constant/User";

interface ListUserProps {
  users: User[]; 
  onEditUser: (user: User) => void; 
  onDeleteUser: (id: number) => void; 
}

const ListUser: React.FC<ListUserProps> = ({
  users,
  onEditUser,
  onDeleteUser,
}) => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">User List</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left text-gray-600">Name</th>
            <th className="px-4 py-2 text-left text-gray-600">Email</th>
            <th className="px-4 py-2 text-left text-gray-600">Role</th>
            <th className="px-4 py-2 text-left text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-100">
              <td className="px-4 py-2 text-gray-800">{user.name}</td>
              <td className="px-4 py-2 text-gray-800">{user.email}</td>
              <td className="px-4 py-2 text-gray-800">{user.role}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onEditUser(user)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteUser(user.id)}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListUser;
