import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import profile from "../assets/userprofile.png";
import { FaEdit, FaHome } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { Button } from 'flowbite-react';
import UserPosts from '../Components/UserPosts';
import { Link, useParams } from 'react-router-dom'
import { IoLocation } from "react-icons/io5";
import { setReceiver } from '../redux/slices/userSlice';
import MessageBox from '../Components/MessageBox';
import { findUserByIdRoute } from '../utils/ApiRoutes';


export default function Profile() {
    const { currentUser, receiver } = useSelector((state) => state.user);

    const {id} = useParams();
    //console.log(id);
    const [user, setUser] = useState(null); 
    const dispatch = useDispatch();

    useEffect(() => { 
        const fetchUser = async (id) => {
        const res = await fetch(`${findUserByIdRoute}/${id}`);
        const data = await res.json();
        setUser(data);
        };
        fetchUser(id);
    }, [id]);

    const handleClick = () => {
        //console.log(user);
        if(user){
            dispatch(setReceiver(user));
            //console.log(receiver);
        }
    }

    return (
        <div className='py-4 sm:px-28 sm:py-10'>
            <div className=' top border-b-2 border-b-black' id='1'>
                <div className='flex flex-col md:flex-row justify-between items-center w-full gap-4 pb-12  px-8 lg:px-48'>
                    <div className='flex flex-col md:flex-row justify-center items-center md:gap-6'>
                        <img
                            src={user?.profile ?? profile}
                            alt={user?.userName}
                            className='w-44 h-44 object-cover rounded-full'
                        />

                        <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
                            <p className='text-4xl font-bold dark:text-white'>
                                {user?.firstName} {user?.lastName}
                            </p>
                            <span className='text-lg font-medium'>
                                @{user?.userName}
                            </span>
                        </div>
                    </div>
                    <div className='flex justify-center items-center md:justify-start mt-4 md:mt-0'>
                        {user?.studentID === currentUser?.studentID ? (
                                <Button className=' bg-blue-600'><Link to='/edit' className='mr-1'>Edit Profile</Link> <div className=' place-content-center'><FaEdit /></div></Button>
                            ):(
                                <Button className=' bg-blue-600'><span className='mr-1' onClick={handleClick}>Message</span> <div className=' place-content-center'><FiMessageCircle /></div></Button>
                            )}
                    </div>
                </div>
            </div>
            <div className=' w-full max-h-[600px] flex flex-col md:flex-row mt-10 lg:pl-24' id='2'>
                <div className= ' w-full md:w-1/3 flex flex-col gap-8'>
                    {(user?.homeTown || user?.currentCity) && <div className=' flex flex-col shadow-sm rounded-xl px-6 py-4 bg-gray-300 dark:bg-[rgb(11,11,11)] gap-4'>
                        {
                            user?.homeTown? (
                                <div className=' flex gap-2'>
                                    <IoLocation size={30} />
                                    <span className=''>Lives in <span className=' font-semibold text-lg'>{user.currentCity}</span></span>
                                </div>
                            ):(<></>)
                        }
                        {
                            user?.homeTown? (
                                <div className=' flex gap-2'>
                                    <FaHome size={30} />
                                    <span className=''> From <span className=' font-semibold text-lg'>{user.homeTown}</span></span>
                                </div>
                            ):(<></>)
                        }
                    </div>}
                    {user?.education.length ? (
                            <div className=' flex flex-col shadow-sm rounded-xl px-6 py-4 bg-gray-300 dark:bg-[rgb(11,11,11)]'>
                                <h1 className=' text-2xl font-bold'>Education:</h1>
                                {user?.education.map((edu, index) => (
                                    <div key={index} className=' border-b-2 border-b-black dark:border-b-white'>
                                        {edu.to ? 
                                            <span className=' text-base font-semibold ml-4'>Went to </span> 
                                            : 
                                            <span className=' text-base font-semibold ml-4'>Studies at </span>
                                        }
                                        <span className=' text-lg font-bold mr-4'>{edu.institution}</span>
                                        <div className=' flex text-base flex-col sm:flex-row justify-between items-center mx-4 sm:mx-12'>
                                            <span>From: {edu.from}</span>
                                            {edu.to ? (<span>To: {edu.to}</span>): (<></>)}
                                        </div>
                                        {edu.description ? (<p className=' text-base mx-4'>
                                           {edu.description} 
                                        </p>):(<></>)}
                                    </div>
                                ))}
                            </div>
                        )
                        :
                        (<div className='w-full flex flex-col shadow-sm rounded-xl px-6 py-4 bg-gray-300 dark:bg-[rgb(11,11,11)]'>
                            <h1 className=' text-2xl font-bold'>Education:</h1>
                            No Education Profile to Show...
                        </div>)
                    }
                    {user?.work.length ? (
                            <div className='w-full flex flex-col shadow-sm rounded-xl px-6 py-4 bg-gray-300 dark:bg-[rgb(11,11,11)]'>
                                <h1 className=' text-2xl font-bold'>Work:</h1>
                                {user?.work.map((wrk, index) => (
                                    <div key={index} className=' border-b-2 border-b-black dark:border-b-white'>
                                        {wrk.to ? 
                                            <span className=' text-base font-semibold ml-4'>Worked at </span> 
                                            : 
                                            <span className=' text-base font-semibold ml-4'>Works at </span>
                                        }
                                        <span className=' text-lg font-bold mr-4'>{wrk.company}</span>
                                        <div className='  mx-2 sm:mx-12'>
                                            <span>Position: {wrk.position}</span>
                                            <div className=' flex text-base flex-col sm:flex-row justify-between items-center'>
                                                <span>From: {wrk.from}</span>
                                                {wrk.to ? (<span>To: {wrk.to}</span>): (<></>)}
                                            </div>
                                        </div>
                                        {wrk.description ? (<p className=' text-base mx-4'>
                                           {wrk.description} 
                                        </p>):(<></>)}
                                    </div>
                                ))}
                            </div>
                        )
                        :
                        ( <div className='w-full flex flex-col shadow-sm rounded-xl px-6 py-4 bg-gray-300 dark:bg-[rgb(11,11,11)]'>
                            <h1 className=' text-2xl font-bold'>Work:</h1>
                            No Work Profile to Show...
                        </div>)
                    }
                </div>
                <div className=' w-full md:w-2/3 overflow-y-auto right-0 px-4' id='3'>
                    <div className=" w-4/5 px-4 flex flex-col gap-6 rounded-lg">
                        Posts
                        <UserPosts id={user?.studentID}/>
                    </div>
                </div>
            </div>
            <MessageBox />
        </div>
    );
}
