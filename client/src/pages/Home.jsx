import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import ProfileCard from '../Components/ProfileCard'
import PostCreate from '../Components/PostCreate';
import Posts from '../Components/Posts';
import {getCommentsStart, getCommentsSuccess, getCommentsFailure} from '../redux/slices/commentSlice'
import MessageBox from '../Components/MessageBox';
import Picker from 'emoji-picker-react'
import profile from "../assets/userprofile.png"
import { setReceiver } from '../redux/slices/userSlice';



export default function Home() {
  const {currentUser} = useSelector((state) => state.user);
  console.log(currentUser);
  const {allComments} = useSelector((state) => state.comment);
  const dispatch = useDispatch();

  const handleClick = async (id) => {
    console.log(id);
    const res = await fetch(`/api/user/findUserById/${id}`);
    const data = await res.json();
    if(data){
      dispatch(setReceiver(data));
    }
  }

  useEffect( () => {
    if(allComments==null){
      const getComments = async () => {
        try {
          dispatch(getCommentsStart());
          const res = await fetch('/api/comment/getAllComments');
          const data = await res.json();
          if(data.success ===false){
            dispatch(getCommentsFailure(data.message));
          }

          if(res.ok){
            dispatch(getCommentsSuccess(data));
          }
        } catch (error) {
          dispatch(getCommentsFailure(error.message));
        }
      }
      getComments();
    }
  }, [allComments]);

  //console.log(currentUser.userId);

  return (  
    <div className='w-full px-0 lg:px-10 2xl:px-40 lg:rounded-lg h-screen overflow-hidden'>
      <div className=' w-full flex gap-2 lg:gap-4 pt-5 h-full'>
        {/*left*/}
        <div className=' hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto rounded-lg'> 
          <ProfileCard user={currentUser} />
        </div> 

        {/*center */}
        <div className="flex-1 h-full px-4 flex flex-col gap-6  rounded-lg">
          {/* <PostCreate /> */}
          <Posts />
        </div>

        {/* right */}

        <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
          <div className=" w-full bg-gray-300 dark:bg-[rgb(11,11,11)] shadow-sm rounded-lg px-6 py-5">
            <div className=' flex flex-col gap-2'>
              <h1 className=' text-3xl font-extrabold mb-4'>Messages:</h1>
              {
                currentUser?.contactList?.length ? (
                  currentUser.contactList.map((contact, index) => (
                    <div onClick={() => handleClick(contact.studentID)} key={index} className=' flex items-center py-2 gap-2 border-y-2 border-y-black dark:border-y-white cursor-pointer'>
                      <img
                        src={contact?.profile ?? profile}
                        alt={contact?.userName}
                        className='w-10 h10 object-cover rounded-full'
                      />
                      <p className=' py-2 text-lg font-bold'>{contact.userName}</p>
                    </div>
                  ))
                ):(
                  <p>No Conacts to show!</p>
                )
              }
            </div>
          </div>
        </div>
      </div>
      <MessageBox />
    </div>
  )
}
