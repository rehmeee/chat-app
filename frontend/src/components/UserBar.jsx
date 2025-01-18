/* eslint-disable react/prop-types */
import {useState} from "react"
import EditModel from "./EditModel";

function UserBar({ user,onEditInfo }) {
    const [isEdit, setIsEdit] = useState(false);
    const handleEdit = ()=>{
    setIsEdit(true)
    }
    const handleEditOnClose = ()=>{
        setIsEdit(false)
    }
  return (
    <div className="flex items-center mb-6 p-4 gap-3 rounded-lg bg-white shadow-md relative">
  <img
    src={user.profilePic}
    alt="User image"
    className="w-12 h-12 rounded-full border-2 border-indigo-500"
  />
  <div className="flex-1">
    <h2 className="font-semibold text-gray-800 text-lg">
      {user.fullName || "Loading..."}
    </h2>
  </div>
  <button
    onClick={handleEdit}
    className="absolute top-6 right-3 px-4 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
  >
    Edit
  </button>
  {isEdit && (
    <EditModel
      user={user}
      onclose={handleEditOnClose}
      onEditInfo={onEditInfo}
    />
  )}
</div>

  );
}

export default UserBar;
