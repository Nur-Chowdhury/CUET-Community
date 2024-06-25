import React,{useState, useEffect, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import profile from "../assets/userprofile.png"
import {IoMdClose} from 'react-icons/io'
import Picker from 'emoji-picker-react'
import {BsEmojiSmileFill} from "react-icons/bs"
import { IoSend } from "react-icons/io5";
import { IoMdAttach } from "react-icons/io";
import {Textarea} from 'flowbite-react';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import {app} from '../firebase'
import { setReceiver, unsetReceiver } from '../redux/slices/userSlice'
import ChatInput from './ChatInput'

export default function MessageBox() {

  const scrollRef = useRef();

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState("");
    const dispatch = useDispatch();
    const [imageUploadError, setImageUploadError] = useState(null);
    const [publishError, setPublishError] = useState(null);
    const {currentUser, receiver} = useSelector((state) => state.user);
    const [messages, setMessages] = useState([]);
    const [formData, setFormData] = useState({
      from: currentUser.studentID,
      to: receiver ? receiver.studentID : '2',
    });
    
    const {messg} = useSelector((state) => state.comment);

    useEffect(() => {
      const fetchMessages = async () => {
          try {
              if (currentUser?.studentID && receiver?.studentID) {
                  const res = await fetch('/api/messages/getAllMessages', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          from: currentUser.studentID,
                          to: receiver.studentID,
                      }),
                  });
      
                  const data = await res.json();
                  setMessages(data);
              }
          } catch (error) {
              console.error('Error fetching messages:', error);
          }
      };
      fetchMessages();
    }, [receiver, messg]);


    const handleClose = () => {
      dispatch(unsetReceiver());
  }


  //   const handleUpload = async (event) => {
  //     const file = event.target.files[0];
  //     try{
  //         setImageUploadError(null);
  //         const storage = getStorage(app);
  //         const fileName = new Date().getTime() + '-' + file.name;
  //         const storageRef = ref(storage, fileName);
  //         uploadBytesResumable(storageRef, file).then((value)=>{
  //             getDownloadURL(value.ref).then((url) => {
  //                 console.log(url);
  //                 setImageUploadError(null);
  //                 setFormData({...formData, image: url});
  //             });
  //         });
  //         // const uploadTask = uploadBytesResumable(storageRef, file);
  //         // uploadTask.on(
  //         //     'state_changed',
  //         //     (error) => {
  //         //         console.log(error);
  //         //         setImageUploadError('Image Upload Failed');
  //         //     },
  //         //     () => {
  //         //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         //             setImageUploadError(null);
  //         //             console.log(downloadURL);
  //         //             setFormData({...formData, img: downloadURL});
  //         //         });
  //         //     }
  //         // );
  //     }catch(error){
  //         setImageUploadError(error);
  //     }
  // }
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   console.log(currentUser);
    //   try {
    //       console.log("a", formData); 
    //       const res = await fetch('/api/messages/addMessage', {
    //           method: 'POST',
    //           headers: {
    //           'Content-Type': 'application/json',
    //           },
    //           body: JSON.stringify(formData),
    //       });
    //       const data = await res.json();
    //       const newMessage = { fromSelf: true, message: data.message.text };
    //       setMessages((prevMessages) => [...prevMessages, newMessage]);
    //       setFormData({ ...formData, message: "" });
    //       console.log(messages);
    //   } catch (error) {
    //       setPublishError('Something went wrong');
    //   }
    // }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behaviour: "smooth"});
    }, [messages]);

  return (
    receiver && (
      <div className='fixed bottom-0 right-40 h-[460px] w-[330px] bg-gray-400 dark:bg-[rgb(40,40,40)] rounded-t-lg flex flex-col'>
        <div className=' w-full min-h-10p flex items-center justify-between px-2'>
          <div className='flex gap-2'>
            <img src={receiver?.profile ?? profile} alt='profile' className='w-8 h-8 rounded-full object-cover' />
            <span>{receiver?.userName}</span>
          </div>
          <IoMdClose className='right-2 h-6 w-6 cursor-pointer' onClick={handleClose} />
        </div>
        <div className='w-full min-h-80p overflow-y-auto'>
          {
            messages?.length ? (
              messages.map((message, index) => (
                <div ref={scrollRef} key={index}>
                  <div className={`flex items-center ${message.fromSelf ? 'justify-end' : 'justify-start'}`}>
                    <div className={`h-full max-w-40p break-words px-1 mx-2 my-1 text-lg rounded-md ${message.fromSelf ? 'bg-blue-300 dark:bg-blue-700 text-black' : 'bg-gray-700 text-white'}`}>
                      <p>{message.message}</p>
                    </div>
                  </div>
                </div>
              ))
            ):(
              <p className=' flex items-center justify-center text-black dark:text-white'>Send Message To start Conversation.</p>
            )
          }
        </div>
        <div className=' w-full min-h-10p max-h-10p'>
          <ChatInput className=' w-full h-full' />
        </div>
      </div>
    )    
  ); 
}
