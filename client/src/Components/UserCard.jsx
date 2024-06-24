import React from 'react'
import profile from "../assets/userprofile.png"
import {Link} from 'react-router-dom' 

export default function UserCard({user}) {

  return (
    <div className=' px-4 py-2 bg-blue-600 rounded-md mb-2'>
        <Link to={"/profile/"+ user?.studentID}>
            <div className='flex gap-3 items-center mb-2'>
                <img
                    src={user?.profile ? user.profile: profile}
                    alt='profile'
                    className='w-14 h-14 object-cover rounded-full'
                />
                <div className=''> 
                    <p className=' font-bold text-lg text-black'>
                        {user?.firstName} {user?.lastName}
                    </p>
                </div>
            </div>
        </Link>
    </div>
  )
}
