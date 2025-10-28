import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore"
import { useUser } from "../hooks/useUser";

const ProfilePage = () => {
    const { user } = useAuthStore();
    const { changePassMutation, updateProfileMutation } = useUser();
    const [editMode, _setEditMode] = useState(false)
    const [changePassword, setChangePassword] = useState(false)
    const [passwordVerification, setPasswordVerification] = useState({oldPassword: "", newPassword: ""});

    const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        changePassMutation.mutate(passwordVerification, {
            onSuccess: () => {
                setChangePassword(false);
                setPasswordVerification({oldPassword: "", newPassword: ""});
                // TODO: Show a success notification
            },
            onError: (_error) => {
                setPasswordVerification(prev => ({...prev, oldPassword: ''}));
                // TODO: Show an error notification
            }
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if(!file) return;

        const reader = new FileReader;
        reader.readAsDataURL(file);

        reader.onload = async() => {
            const profilePicture = reader.result;
            updateProfileMutation.mutate({profilePicture});
        };

    };


    return (
            <div className="h-full w-full max-w-xl mx-auto flex flex-col gap-5">
                <div className="w-full h-fit p-4 flex bg-base-200 rounded-sm">
                    <img 
                        src={user?.avatar ?? ''}
                        className="h-30 w-30 object-cover rounded-xs border-2 border-base-content/50"
                    />
                </div>

                <div className="grid grid-cols-2 space-y-5">
                    {/* Username */}
                    <div className="w-full">
                        <p className="text-sm font-medium">Username</p>
                        <p className="text-xs text-base-content/50">A unique name for your profile</p>
                    </div>
                    <input 
                            type="text" 
                            placeholder="Username"
                            value={user?.username} 
                            readOnly={!editMode}
                            className={`text-xs input w-full rounded-xs font-medium border-1 border-base-content/20 ${editMode ? 'bg-base-200 cursor-text' : 'base-base-200 cursor-pointer'}`}
                            // onChange={(e) => setTaskData({...taskData, task_name:e.currentTarget.value})}
                            // onClick={() => {handleEditMode(), dropDownRef.current?.removeAttribute("open")}}
                        />
                    
                    {/* Email */}
                    <div className="w-full">
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-xs text-base-content/50">Lorem ipsum dolor sit amet consectetur</p>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Username"
                        value={user?.email} 
                        readOnly={!editMode}
                        className={`text-xs input w-full rounded-xs font-medium border-1 border-base-content/20 ${editMode ? 'bg-base-200 cursor-text' : 'base-base-200 cursor-pointer'}`}
                        // onChange={(e) => setTaskData({...taskData, task_name:e.currentTarget.value})}
                        // onClick={() => {handleEditMode(), dropDownRef.current?.removeAttribute("open")}}
                    />

                    {/* Profile Change */}
                    <div className="w-full">
                        <p className="text-sm font-medium">Profile Picture</p>
                        <p className="text-xs text-base-content/50">Lorem ipsum dolor sit amet consectetur</p>
                    </div>
                    <div className="flex gap-2">
                        <img 
                            src={user?.avatar ?? ''}
                            className="h-20 w-20 object-cover rounded-xs border-2 border-base-content/50"
                        />

                        <label 
                            htmlFor="profile-upload"
                            className="btn btn-sm border-1 border-base-content/20 bg-base-100 hover:bg-base-200 w-30"
                            >
                                {updateProfileMutation.isPending 
                                    ? (<span className="loading loading-dots loading-xs"></span>) 
                                    : 'Change Profile'
                                }
                                <input 
                                    type="file"
                                    id="profile-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={updateProfileMutation.isPending}
                                />
                        </label>
                    </div>

                    {/* Password */}
                    <div className="w-full">
                        <p className="text-sm font-medium">Password</p>
                        <p className="text-xs text-base-content/50">Lorem ipsum dolor sit amet consectetur</p>
                    </div>
                    <div className="flex flex-col">
                        <button
                            type="button"
                            onClick={() => setChangePassword(s => !s)} 
                            className={`btn border-1 border-base-content/20 text-xs bg-base-100 text-left hover:bg-base-200 ${changePassword && 'bg-primary hover:!bg-primary/70'}`}
                            >
                                Change Password
                        </button>
                        
                        {/* Change Password */}
                        {changePassword && (
                            <form onSubmit={handleChangePassword} className="flex flex-col mt-2 gap-2 border-1 p-1 border-base-content/10">
                                <div className="grid grid-cols-3 items-center gap-2">
                                    <label className="text-xs col-span-full md:col-span-1">Old Password</label>
                                    <input 
                                        type="text" 
                                        className="input input-sm col-span-full md:col-span-2"
                                        value={passwordVerification.oldPassword}
                                        onChange={(e) => setPasswordVerification({...passwordVerification, oldPassword: e.currentTarget.value})}
                                        required={true}
                                        />
                                </div>

                                <div className="grid grid-cols-3 items-center gap-2">
                                    <label className="text-xs col-span-full md:col-span-1">New Password</label>
                                     <input 
                                        type="text" 
                                        className="input input-sm col-span-full md:col-span-2"
                                        value={passwordVerification.newPassword}
                                        onChange={(e) => setPasswordVerification({...passwordVerification, newPassword: e.currentTarget.value})}
                                        required={true}
                                        />
                                </div>
                                
                                <p className="text-xs ml-auto text-error h-3">{changePassMutation.isError ? changePassMutation.error.message : ''}</p>
                                
                                <div className="flex text-xs gap-2 mt-1 ml-auto">
                                    <button type="button" onClick={() => {setChangePassword(false), setPasswordVerification({oldPassword: "", newPassword: ""})}} className="p-1 w-15 border-1 border-base-content/30 text-base-content/50 cursor-pointer hover:bg-base-100 hover:text-base-content active:bg-base-content/10">Cancel</button>
                                    <button 
                                        type="submit" 
                                        className="text-xs btn h-fit bg-base-100 p-1 w-20 font-medium rounded-xs border-1 border-base-content/30 cursor-pointer hover:bg-primary hover:text-primary-content active:bg-base-content/10 active:text-base-content"
                                        > {changePassMutation?.isPending 
                                            ? (<span className="loading loading-dots loading-xs"></span>) 
                                            : 'Change'
                                        }
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
    )
}
export default ProfilePage
