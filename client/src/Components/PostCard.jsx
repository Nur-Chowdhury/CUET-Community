import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import profile from "../assets/userprofile.png"
import moment from "moment";
import { useSelector } from 'react-redux';
import {BiLike, BiSolidLike, BiComment} from 'react-icons/bi'
import CommentForm from './CommentForm';
import CommentCard from './CommentCard';
import { findUserByIdRoute, postRoute } from '../utils/ApiRoutes';

export default function PostCard({post, comments}) {
    const [showAll, setShowAll] = useState(0);
    const [user, setUser] = useState(null);
    const {currentUser} = useSelector((state) => state.user);

    const [showComments, setShowComments] = useState(null);
    const {loading, error} = useSelector((state) => state.comment);
    
    //console.log(comments); 
    const id = post.userId;

    const [pst, setPst] = useState(post);

    const [likes, setLikes] = useState(pst.likes.length);

    const handleLike = async () => {
        try {
            const response = await fetch(`${postRoute}/${pst._id}/like`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if(response.ok){
                const ps = await response.json();
                setPst(ps);
                setLikes(ps.likes.length);
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
            fetchUser(id);
        }
    }, [id]);

  return (
    <div className='mb-2 bg-gray-300 dark:bg-[rgb(11,11,11)] p-4 rounded-xl'>
        <div className='flex gap-3 items-center mb-2'>
            <Link to={"/profile/"+ pst?.userId}>
                <img
                    src={user?.profile ?? profile}
                    alt='profile'
                    className='w-14 h-14 object-cover rounded-full'
                /> 
            </Link>
            <div className='w-full flex justify-between'>
                <div className=''>
                    <Link to={"/profile/" + pst?.userId}>
                        <p className='font-medium text-lg'>
                            {user?.firstName} {user?.lastName}
                        </p> 
                    </Link>
                </div>

                <span className='text-ascent-2'>
                    {moment(pst?.createdAt ?? "2023-05-25").fromNow()}
                </span>
            </div>
        </div>

        {/* post body */}
        <div>
            <p className='text-ascent-2'>
                {showAll === pst?._id
                ? pst?.content
                : pst?.content.slice(0, 300)}

            {pst?.content?.length > 301 &&
                (showAll === pst?._id ? (
                    <span
                        className='text-blue ml-2 font-medium cursor-pointer'
                        onClick={() => setShowAll(0)}
                    >
                        Show Less
                    </span>
                ) : (
                    <span
                        className='text-blue ml-2 font-medium cursor-pointer'
                        onClick={() => setShowAll(pst?._id)}
                    >
                        Show More
                    </span>
                ))}
            </p>

            {pst?.image && (
                <a href={pst?.image}>
                    <img
                        src={pst?.image}
                        alt='post image'
                        className='w-full mt-2 rounded-lg'
                    />
                </a>
            )}
        </div>

        {/* like comments */}
        <div className='mt-4 flex justify-between items-center px-3 py-2 text-ascent-2
        text-base border-t border-[#66666645]'>
            <p className='flex gap-2 items-center text-base cursor-pointer' onClick={handleLike}>
                {pst?.likes?.includes(currentUser?.studentID) ? (
                    <BiSolidLike size={30} color='blue' />
                ) : (
                    <BiLike size={30} />
                )}
                {likes} Like{likes > 1 && 's'}
            </p>

            <p
                className='flex gap-2 items-center text-base cursor-pointer'
                onClick={() => {
                    setShowComments(showComments === pst._id ? null : pst._id);
                    //console.log(showComments);
                }}
            >
                <BiComment size={30} />
                {comments?.length ? comments.length: 0} Comment{comments?.length > 1 && 's'}
            </p>
        </div>

        {/* all comments */}
        {showComments === pst?._id && (
            <div className='w-full mt-4 border-t border-[#66666645] pt-4 '>
                <CommentForm id={pst._id} userId={currentUser.studentID}/>
                { loading ? (
                    <h1>Loading...</h1>
                ) : comments?.length > 0 ? (
                    comments?.map((comment) => (
                        <CommentCard key={comment?._id} comment = {comment}/>
                    ))
                ) : (
                    <span className='flex text-sm py-4 text-ascent-2 text-center'>
                        No Comments, be first to comment
                    </span>
                )}
            </div>
        )}
    </div>
  )
}
