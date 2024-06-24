import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserCard from '../Components/UserCard';
import PostCard from '../Components/PostCard';
import { useSelector } from 'react-redux';

export default function Search() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState(1);
  const {allComments} = useSelector((state) => state.comment);

  const location = useLocation();
  const navigate = useNavigate();
 
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('search');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }

    if(searchType==1||searchType==2||searchType==3){
      const fetchUsers = async () => {
        setLoading(true);
        const search = new URLSearchParams({
          searchTerm: searchTermFromUrl || '',
          searchType: searchType.toString(),
        }).toString();
        const res = await fetch(`/api/user/find/users?${search}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setUsers(data);
        setLoading(false);
        if (data?.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      };
      fetchUsers();
    }
    else if(searchType==4){
      const fetchPosts = async () => {
        setLoading(true);
        const search = new URLSearchParams({
          searchTerm: searchTermFromUrl || '',
          searchType: searchType.toString(),
        }).toString();
        const res = await fetch(`/api/user/find/users?${search}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setPosts(data);
        setLoading(false);
        if (data?.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      };
      fetchPosts();
    }
  }, [location.search, searchType]);

  return (
    <div className='flex w-full max-h-[700px] px-20'>
      <div className='justify-between border-r-2 border-r-black w-1/4 h-screen'>
        <div 
          className={searchType === 1 ? 'bg-blue-600 cursor-pointer rounded-l-lg py-4 pl-4' : ' cursor-pointer rounded-l-lg py-4 pl-4'} 
          onClick={() => setSearchType(1)}
        >
          <p className=' font-bold text-lg text-black'>Person</p>
        </div>
        <div 
          className={searchType === 2 ? 'bg-blue-600 cursor-pointer rounded-l-lg py-4 pl-4' : 'cursor-pointer rounded-l-lg py-4 pl-4'} 
          onClick={() => setSearchType(2)}
        >
          <p className=' font-bold text-lg text-black'>Education</p>
        </div>
        <div 
          className={searchType === 3 ? 'bg-blue-600 cursor-pointer rounded-l-lg py-4 pl-4' : 'cursor-pointer rounded-l-lg py-4 pl-4'} 
          onClick={() => setSearchType(3)}
        >
          <p className=' font-bold text-lg text-black'>Work</p>
        </div>
        <div 
          className={searchType === 4 ? 'bg-blue-600 cursor-pointer rounded-l-lg py-4 pl-4' : 'cursor-pointer rounded-l-lg py-4 pl-4'} 
          onClick={() => setSearchType(4)}
        >
          <p className=' font-bold text-lg text-black'>Posts</p>
        </div>
      </div>
      <div className=' w-3/4 mx-6 overflow-y-scroll'>
        <div className=' text-lg font-medium my-4'>Your Search Results:</div>
        {loading ? (
          <h1>Loading</h1>
        ) : (
          searchType === 4 ? (
            posts?.map((post) => (
              <PostCard key={post?._id} post={post} comments={allComments?.filter(comment => post?._id === comment?.postId).reverse()} />
            ))
          ) : (
            users?.map((user) => (
              <UserCard key={user?._id} user={user} />
            ))
          )
        )}
      </div>
    </div>
  );
}
