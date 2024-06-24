import React, {useState, useEffect} from 'react'
import {BiLike, BiSolidLike} from 'react-icons/bi'
import {Link} from 'react-router-dom'
import profile from "../assets/userprofile.png"
import moment from "moment"

export default function CommentCard({comment}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if(!user){
            const fetchUser = async (id) => {
                const res = await fetch(`/api/user/findUserById/${id}`);
                const data = await res.json();
                setUser(data);
            };
            fetchUser(comment.userId);
        }
    }, [comment]);

  return (
    <div className='w-full py-2'>
        <div className='flex gap-3 items-center mb-1'>
            <Link to={"/profile/" + comment?.userId}>
                <img
                    src={profile}
                    alt={user?.firstName}
                    className='w-10 h-10 rounded-full object-cover'
                />
            </Link>
            <div>
                <Link to={"/profile/" + user?.studentID}>
                    <p className='font-medium text-base'>
                        {user?.firstName} {user?.lastName}
                    </p>
                </Link>
                <span className='text-ascent-2 text-sm'>
                    {moment(comment?.createdAt ?? "2023-05-25").fromNow()}
                </span>
            </div>
        </div>
        <div className='ml-12'>
            <p className='text-ascent-2'>{comment?.comment}</p>
            <div className='mt-2 flex gap-6'>
                <p className='flex gap-2 items-center text-base text-ascent-2 cursor-pointer'>
                    {comment?.likes?.includes(user?._id) ? (
                        <BiSolidLike size={20} color='blue' />
                    ) : (
                        <BiLike size={20} />
                    )}
                        {comment?.likes ? comment.likes.length: 0} Likes
                </p>    
            </div>
        </div>
    </div>
  )
}
