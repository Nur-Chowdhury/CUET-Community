import React, {useState} from 'react'
import profile from "../assets/userprofile.png"
import {Textarea, Button, Alert} from 'flowbite-react'
import {commentStart, commentsFailure, commentsSuccess} from '../redux/slices/commentSlice';
import { useSelector, useDispatch } from 'react-redux';
import { commentRoute } from '../utils/ApiRoutes';

export default function CommentForm({ userId, id }) {
    const {commentLoading, commentError} = useSelector((state) => state.comment);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({userId: userId, postId: id});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(commentStart());
            console.log(formData);
            const res = await fetch(`${commentRoute}/create`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(res, data);
            if (data.success===false) {
                dispatch(commentsFailure(data.message));
                return;
            }

            if (res.ok) {
              dispatch(commentsSuccess(data));
            }
            formData.comment = "";
        } catch (error) {
            dispatch(commentsFailure(error.message));
        }
    }
  
    return (
      <form
        className='w-full border-b border-[#66666645]'
        onSubmit={handleSubmit}
      >
        <div className='w-full flex items-center gap-2 py-4'>
          <img
            src={userId?.profileUrl ?? profile}
            alt='User Image'
            className='w-10 h-10 rounded-full object-cover'
          />
  
          <Textarea
            type='text'
            id='comment'
            className='w-full h-12 resize-none rounded-full py-3'
            placeholder="Your Comment..."
            value={formData.comment}
            required
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
          />
          {commentLoading ? (
            <p>Posting</p>
          ) : (
            <Button type='submit' className='bg-[#0444a4] text-white py-1 px-3 rounded-full font-semibold text-sm'>
                Post
            </Button>
          )}
        </div>
        {commentError && (
            <Alert className='mt-5' color='failure'>
                {commentError}
            </Alert>
        )}
  
        {/* <div className='flex items-end justify-end pb-2'>
          {loading ? (
            Posting
          ) : (
            <Button type='submit' className='bg-[#0444a4] text-white py-1 px-3 rounded-full font-semibold text-sm'>
                Post
            </Button>
          )}
        </div> */}
      </form>
    );
  };