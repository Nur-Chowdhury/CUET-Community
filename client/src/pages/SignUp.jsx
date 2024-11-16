import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Label, TextInput, Button, Spinner, Alert} from 'flowbite-react'
import { signupRoute } from '../utils/ApiRoutes';

export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.firstName||
      !formData.lastName||
      !formData.userName||
      !formData.studentID||
      !formData.email||
      !formData.password
    ){
      return setErrorMessage('Please fill out the required fields.');
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`${signupRoute}`,{
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if(data.success ===false){
        setLoading(false);
        return setErrorMessage(data.message);
      }

      setLoading(false);
      if(res.ok){
        navigate('/login');
      }

    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  return (
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
            <div className=' flex flex-row gap-2'>
              <div>
                <Label value='First Name'/>
                <TextInput
                  type='text'
                  placeholder='First Name'
                  id='firstName'
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value='Last Name'/>
                <TextInput
                  type='text'
                  placeholder='Last Name'
                  id='lastName'
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className=' flex flex-row gap-2'>
              <div>
                <Label value='User Name'/>
                <TextInput
                  type='text'
                  placeholder='Your User Name'
                  id='userName'
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value='Student ID'/>
                <TextInput
                  type='text'
                  placeholder='Your Student ID'
                  id='studentID'
                  onChange={handleChange}
                />
              </div>
            </div>
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
            <div>
              <Label value='Current Organization'/>
              <TextInput
                type='text'
                placeholder='Your Organization'
                id='currentIns'
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
                'Sign Up'
              )}
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/login' className='text-blue-500'>
              Sign In
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
}
