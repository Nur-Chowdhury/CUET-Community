import React from 'react'
import profile from "../assets/userprofile.png"
import {Link} from 'react-router-dom';
import {CiLocationOn} from 'react-icons/ci'
import {BsBriefcase} from 'react-icons/bs'
import { useSelector } from 'react-redux';
import { Button } from 'flowbite-react';
  
export default function ProfileCard({user}) {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <div className='w-full flex flex-col items-center shadow-sm rounded-xl px-6 py-4 bg-gray-300 dark:bg-[rgb(11,11,11)]'>
        <div className="w-full flex items-center justify-between border-b pb-5 border-[#66666645]">
            <div className="flex gap-2">
                <img
                    src={user?.profile ?? profile}
                    alt={user?.userName}
                    className='w-14 h14 object-cover rounded-full'
                />

                <div className="flex flex-col justify-center">
                    <p className='text-lg font-medium dark:text-white'>
                        {user?.firstName} {user?.lastName}
                    </p>
                    <span className=''>
                        @{user?.userName}
                    </span>
                </div>
            </div>
        </div> 
        <Link to={"/profile/"+ user?.studentID} className="w-full flex gap-2">
            <div className=' my-2 p-2 w-full bg-blue-600 rounded-lg flex justify-center text-white text-lg font-semibold'>
                My Profile
            </div>
        </Link>
    </div>
  )
}
