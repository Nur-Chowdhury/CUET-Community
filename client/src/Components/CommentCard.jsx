import React, {useState, useEffect} from 'react'
import {BiLike, BiSolidLike} from 'react-icons/bi'
import {Link} from 'react-router-dom'
import profile from "../assets/userprofile.png"
import moment from "moment"
import { commentRoute, findUserByIdRoute } from '../utils/ApiRoutes'

export default function CommentCard({comment}) {
    const [user, setUser] = useState(null);

    const [cmnt, setCmnt] = useState(comment);

    const [likes, setLikes] = useState(cmnt.likes.length);

    const handleLike = async () => {
        try {
            const response = await fetch(`${commentRoute}/${cmnt._id}/like`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if(response.ok){
                const cmt = await response.json();
                setCmnt(cmt);
                setLikes(cmt.likes.length);
            }
            // setLiked(post.likes.includes(currentUser.studentID));
            // setLikesCount(post.likes.length);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    }

    useEffect(() => {
        if(!user){
            const fetchUser = async (id) => {
                const res = await fetch(`${findUserByIdRoute}/${id}`);
                const data = await res.json();
                setUser(data);
            };
            fetchUser(comment.userId);
        }
    }, [comment]); 

  return (
    <div className='w-full py-2'>
        <div className='flex gap-3 items-center mb-1'>
            <Link to={"/profile/" + cmnt?.userId}>
                <img
                    src={user?.profile ?? profile}
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
                    {moment(cmnt?.createdAt ?? "2023-05-25").fromNow()}
                </span>
            </div>
        </div>
        <div className='ml-12'>
            <p className='text-ascent-2'>{cmnt?.comment}</p>
            <div className='mt-2 flex gap-6'>
                <p className='flex gap-2 items-center text-base text-ascent-2 cursor-pointer' onClick={handleLike}>
                    {cmnt?.likes?.includes(user?.studentID) ? (
                        <BiSolidLike size={20} color='blue' />
                    ) : (
                        <BiLike size={20} />
                    )}
                        {likes} Like{likes > 1 && 's'}
                </p>    
            </div>
        </div>
    </div>
  )
}
