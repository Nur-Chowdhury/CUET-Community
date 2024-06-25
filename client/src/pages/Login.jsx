import React, { useState } from 'react'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import {Label, TextInput, Button, Spinner, Alert} from 'flowbite-react'
import {useDispatch, useSelector} from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/slices/userSlice';


export default function Login() {

  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage, currentUser} = useSelector(state => state.user);
  const navigate = useNavigate();
  const  dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(
      !formData.email||
      !formData.password
    ){
      return dispatch(signInFailure('Please fill all the fields'));
    }

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin',{
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if(data.success ===false){
        dispatch(signInFailure(data.message));
      }

      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/'); 
      }

    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  return (
    currentUser ? (<Navigate to={'/'} />):
    (
      <div className=' min-h-screen mt-20' >
        <div className=' flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
          <div className=' flex-1'>
            <Link to='/' className=' font-bold dark:text-white text-4xl'>
              <span className=' px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white'>
                CUET
              </span>
              -Community
            </Link>
          </div>

          <div className=' flex-1'>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <div>
                <Label value='Email'/>
                <TextInput
                  type='email'
                  placeholder='Your Email'
                  id='email'
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value='Password'/>
                <TextInput
                  type='password'
                  placeholder='Your Password'
                  id='password'
                  onChange={handleChange}
                />
              </div>
              <Button
                gradientDuoTone='purpleToPink'
                type='submit'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            <div className='flex gap-2 text-sm mt-5'>
              <span>Don't Have an Account?</span>
              <Link to='/signup' className='text-blue-500'>
                Sign Up
              </Link>
            </div>
            {errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    )
  )
}
