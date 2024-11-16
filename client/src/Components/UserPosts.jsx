import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PostCard from './PostCard';
import { getPostsRoute } from '../utils/ApiRoutes';

export default function UserPosts({ id }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { allComments } = useSelector((state) => state.comment);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch(`${getPostsRoute}`);
            const data = await res.json();
            const dat = data.filter(datum => datum.userId === id);
            setPosts(dat);
            setLoading(false); // Move setLoading here to ensure it sets to false after data is fetched
        };
        fetchPosts();
    }, [id]);

    return (
        <div className=' overflow-y-scroll'>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                posts?.map((post) => (
                    <PostCard 
                        key={post?._id} 
                        post={post} 
                        comments={allComments?.filter(comment => post?._id === comment?.postId).reverse()} 
                    />
                ))
            )}
            <div className='flex w-full items-center justify-center mt-4'>
                <p className='text-lg text-ascent-2'>No More Posts Available</p>
            </div>
        </div>
    );
}
