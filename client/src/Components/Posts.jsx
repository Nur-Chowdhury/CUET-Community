import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import PostCard from './PostCard';
import PostCreate from './PostCreate';

export default function Posts() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const {allComments} = useSelector((state) => state.comment);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
    setLoading(false);
  }, []);

  return ( 
    <div className=' h-full overflow-y-auto'>
      {loading ? (
            <h1>Loading</h1>
        ) : (
          <div>
            <div className=' mb-6'><PostCreate/></div>
            {posts?.map((post) => (
                    <PostCard key={post?._id} post={post} comments={allComments?.filter(comment => post?._id==comment?.postId).reverse()}/>
                )
            )} 
          </div>
        )
      }
      <div className='flex w-full items-center justify-center'>
        <p className='text-lg text-ascent-2'>No More Post Available</p>
      </div>
    </div>
  )
}
