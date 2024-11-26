import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import User from "../../../constant/User";

const backend = import.meta.env.VITE_BACKEND_URL;

interface AddUserComponentProps {
  onAddUser: (newUser: User) => void;
}

const AddUserComponent: React.FC<AddUserComponentProps> = ({ onAddUser }) => {
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });
  // thêm 1 user mới từ việc fetch api từ server backend
  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        const response = await axios.post(`${backend}/admin/add-user`, newUser);
        const addedUser = response.data;

        // truyền user vào
        onAddUser(addedUser);

        setNewUser({ name: "", email: "", role: "user" });
        toast.success("User added successfully");
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New User</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleAddUser}
          className="col-span-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add User
        </button>
      </div>
    </div>
  );
};

export default AddUserComponent;
