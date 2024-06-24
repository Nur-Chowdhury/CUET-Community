import React, { useState } from 'react'
import {BsEmojiSmileFill} from "react-icons/bs"
import {IoMdSend} from "react-icons/io";
import Picker from "emoji-picker-react";
import { useDispatch, useSelector } from 'react-redux';
import { setMessg} from '../redux/slices/commentSlice'


export default function ChatInput() {

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState("");
    const {currentUser, receiver} = useSelector((state) => state.user);
    const [publishError, setPublishError] = useState(null);

    const dispatch = useDispatch();

    const handleEmojiPIckerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    }

    const handleEmojiCLick = (emojiObject) => {
        setMsg((prevMsg) => prevMsg + emojiObject.emoji);
        setShowEmojiPicker(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(currentUser);
        try {
            const formData = {
                from: currentUser.studentID,
                to: receiver ? receiver.studentID : '2',
                message: msg,
            }
            const res = await fetch('/api/messages/addMessage', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            dispatch(setMessg());
            setMsg("");
        } catch (error) {
            setPublishError('Something went wrong');
        }
    }

  return (
    <div className=' relative w-full flex justify-between items-center px-2'>
      <div className=' flex items-center'>
        <div className=' relative'>
            {
                showEmojiPicker && 
                <Picker
                    className = ' absolute top-negative-460px'
                    onEmojiClick={handleEmojiCLick} 
                />
            }
            <BsEmojiSmileFill size={25} className=' text-yellow-300' onClick={handleEmojiPIckerHideShow} />
        </div>
      </div>
      <div className=' min-w-90p flex items-center'>
        <form className=' w-full' onSubmit={(e) => handleSubmit(e)}>
            <div className=' w-full flex justify-center items-center gap-2'>
                <input
                    required
                    className=' min-w-90p rounded-lg  bg-transparent'
                    type='text'
                    placeholder='type your message here'
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                />
                <button className='' type='submit'>
                    <IoMdSend size={20}/>
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}
