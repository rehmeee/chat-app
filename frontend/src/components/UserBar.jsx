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
    <div className="flex place-items-center mb-5 gap-1 rounded-xl bg-chatBg relative">
      <img src={user.profilePic} alt="User image" className="w-10 h-10 rounded-full bg-black" />
      <div className="  w-full rounded-xl  px-2">
        <h2 className=" font-bold">
          {user.username || "Loading..."}
          
        </h2>
      </div>
      <button className="absolute top-1 right-2 bg-inherit text-black p-1 rounded" onClick={handleEdit}>Edit</button>
      {isEdit && <EditModel user={user} onclose={handleEditOnClose} onEditInfo={onEditInfo}/>}
    </div>
  );
}

export default UserBar;
