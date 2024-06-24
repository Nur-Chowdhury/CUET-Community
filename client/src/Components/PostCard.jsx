import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import profile from "../assets/userprofile.png"
import moment from "moment";
import { useSelector } from 'react-redux';
import {BiLike, BiSolidLike, BiComment} from 'react-icons/bi'
import CommentForm from './CommentForm';
import CommentCard from './CommentCard';

export default function PostCard({post, comments}) {
    const [showAll, setShowAll] = useState(0);
    const [user, setUser] = useState(null);
    const {currentUser} = useSelector((state) => state.user);

    const [showComments, setShowComments] = useState(null);
    const {loading, error} = useSelector((state) => state.comment);
    
    //console.log(comments);
    const id = post.userId;

    const handleLike = () => {
        
    }


    useEffect(() => { 
        if(!user){
            const fetchUser = async (id) => {
                const res = await fetch(`/api/user/findUserById/${id}`);
                const data = await res.json();
                setUser(data);
            };
            fetchUser(id);
        }
    }, [id]);

  return (
    <div className='mb-2 bg-gray-300 dark:bg-[rgb(11,11,11)] p-4 rounded-xl'>
        <div className='flex gap-3 items-center mb-2'>
            <Link to={"/profile/"+ post?.userId}>
                <img
                    src={profile}
                    alt='profile'
                    className='w-14 h-14 object-cover rounded-full'
                /> 
            </Link>
            <div className='w-full flex justify-between'>
                <div className=''>
                    <Link to={"/profile/" + post?.userId}>
                        <p className='font-medium text-lg'>
                            {user?.firstName} {user?.lastName}
                        </p> 
                    </Link>
                </div>

                <span className='text-ascent-2'>
                    {moment(post?.createdAt ?? "2023-05-25").fromNow()}
                </span>
            </div>
        </div>

        {/* post body */}
        <div>
            <p className='text-ascent-2'>
                {showAll === post?._id
                ? post?.content
                : post?.content.slice(0, 300)}

            {post?.content?.length > 301 &&
                (showAll === post?._id ? (
                    <span
                        className='text-blue ml-2 font-medium cursor-pointer'
                        onClick={() => setShowAll(0)}
                    >
                        Show Less
                    </span>
                ) : (
                    <span
                        className='text-blue ml-2 font-medium cursor-pointer'
                        onClick={() => setShowAll(post?._id)}
                    >
                        Show More
                    </span>
                ))}
            </p>

            {post?.image && (
                <a href={post?.image}>
                    <img
                        src={post?.image}
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
                {post?.likes?.includes(user?.studentId) ? (
                    <BiSolidLike size={20} color='blue' />
                ) : (
                    <BiLike size={20} />
                )}
                {post?.likes ? post.likes.length : 0 } Likes
            </p>

            <p
                className='flex gap-2 items-center text-base cursor-pointer'
                onClick={() => {
                    setShowComments(showComments === post._id ? null : post._id);
                    //console.log(showComments);
                }}
            >
                <BiComment size={20} />
                {comments?.length ? comments.length: 0} Comments
            </p>
        </div>

        {/* all comments */}
        {showComments === post?._id && (
            <div className='w-full mt-4 border-t border-[#66666645] pt-4 '>
                <CommentForm id={post._id} userId={currentUser.studentID}/>
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
