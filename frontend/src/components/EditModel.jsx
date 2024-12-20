/* eslint-disable react/prop-types */
import {useState} from "react"

function EditModel({user,onclose, onEditInfo }) {
    const [formData, setFormData] = useState({
        username: user.username || "", 
        profilePic: user.profilePic || "",
        fullName: user.fullName || ""
    })
    const handleChange  =(e)=>{
            const{name, value} = e.target;
            setFormData({...formData, [name]:value})
    }
    const handleSave = ()=>{
        onEditInfo(formData)
        onclose()
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-bold mb-4">Edit User Info</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
             select Profile Pic
            </label>
            <input
              type="file"
              name="profilePicture"
              value={formData.profilePic}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={onclose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>       
    )
}

export default EditModel
