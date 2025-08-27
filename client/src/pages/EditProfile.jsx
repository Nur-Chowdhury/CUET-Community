import React, {useState, useRef, useEffect} from 'react'
import {Button, TextInput, Alert, Textarea} from 'flowbite-react'
import {CircularProgressbar} from 'react-circular-progressbar'
import {useSelector, useDispatch} from 'react-redux'
import profile from "../assets/userprofile.png"
import {updateStart, updateSuccess, updateFailure} from '../redux/slices/userSlice'
import { PiPlusBold } from "react-icons/pi";
import EducationEdit from '../Components/EducationEdit'
import WorkEdit from '../Components/WorkEdit'
import { updateUserRoute } from '../utils/ApiRoutes'
import { supabase } from '../supabase';


export default function EditProfile() {

  const [formData, setFormData] = useState({});
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const {currentUser} = useSelector((state) => state.user);
  const [homecng, setHomecng] = useState(false);
  const [citycng, setCitycng] = useState(false);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [addEdu, setAddEdu] = useState(false);
  const [addWork, setAddWork] = useState(false);
  

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (imageFile) {
      handleFileUpload();
    }
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.id]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleFileUpload = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const fileName = `${Date.now()}_${imageFile.name}`;

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('img_bkt')
        .createSignedUploadUrl(fileName);

    if (signedUrlError) {
      console.log('Failed to get signed URL:', signedUrlError.message);
      setImageFileUploadError(
        'Could not upload image (File must be less than 2MB)'
      );
      setImageFileUploadProgress(null);
      setImageFile(null);
      setImageFileUrl(null);
      setImageFileUploading(false);
      return;
    }

    const uploadUrl = signedUrlData?.signedUrl;

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', imageFile.type);

    xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setImageFileUploadProgress(percent);
        }
    };

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const { data: urlData } = supabase.storage
            .from('img_bkt')
            .getPublicUrl(fileName);

        const publicUrl = urlData?.publicUrl;
        setImageFileUrl(publicUrl);
        setFormData((prevFormData) => ({
            ...prevFormData,
            profile: publicUrl,
        }));
        setImageFileUploading(false);
      } else {
        console.log("Upload failed with status:", xhr.status);
        setImageFileUploadError(
          'Could not upload image (File must be less than 2MB)'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      }
    };

    xhr.onerror = () => {
      console.error("XHR upload error");
      setImageFileUploadError(
        'Could not upload image (File must be less than 2MB)'
      );
      setImageFileUploadProgress(null);
      setImageFile(null);
      setImageFileUrl(null);
      setImageFileUploading(false);
    };

    xhr.send(imageFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    let form = {};
    if(formData.profile){
      form = {
        row: "profile",
        data: formData.profile,
        type: "update",
      };
    }
    else if(formData.homeTown){
      form = {
        row: "homeTown",
        data: formData.homeTown,
        type: "update",
      };
    }
    else if(formData.currentCity){
      form = {
        row: "currentCity",
        data: formData.currentCity,
        type: "update",
      };
    }
    else if(formData.institution){
      form = {
        row: "education",
        data: {
          institution: formData.institution,
          from: formData.from,
          to: formData.to,
          description: formData.description 
        },
        type: "add",
      };
    }

    else if(formData.company){
      form = {
        row: "work",
        data: {
          company: formData.company,
          from: formData.from,
          to: formData.to,
          position: formData.position,
          description: formData.description 
        },
        type: "add",
      };
    }
    else {
      setUpdateUserError('No changes made');
      return;
    }

    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    try {
      dispatch(updateStart());
      console.log(form);
      const res = await fetch(`${updateUserRoute}/${currentUser.studentID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      console.log(res);
      
      const data = await res.json();
      console.log(data);
      
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
      setFormData({});
      setCitycng(false);
      setHomecng(false);
      setAddEdu(false);
    } catch (error) {
      console.log(error);
      
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }

  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Edit Profile</h1>

      {/* profile pic */}
      <form className='flex flex-col gap-4 p-6' onSubmit={handleSubmit} >
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profile || profile}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              'opacity-60'
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}
        <div className=' flex justify-center'>
          <Button className=' bg-blue-600 w-40' type='submit'>Upload</Button>
        </div>
      </form>

      {/* home */}
      <div className='flex justify-between p-2'>
        <h3>Home Town: {currentUser.homeTown || 'N/A'}</h3>
        {!homecng &&(
          <Button className=' bg-blue-600' onClick={() => setHomecng(true)}>Change Home</Button>
        )}
      </div>
      {homecng &&(
        <form onSubmit={handleSubmit}>
          <TextInput
            type='text'
            id='homeTown'
            placeholder='Your Home Town...'
            defaultValue={currentUser.homeTown}
            onChange={handleChange}
            required
          />
          <div className='flex justify-between p-2'>
            <Button color={'failure'} onClick={() => setHomecng(false)}>Cancel</Button>
            <Button className=' bg-blue-600' type='submit'>Submit</Button>
          </div>
        </form>
      )}

      {/* city */}
      <div className='flex justify-between p-2'>
        <h3>Current City: {currentUser.currentCity || 'N/A'}</h3>
        {!citycng &&(
          <Button className=' bg-blue-600' onClick={() => setCitycng(true)}>Change City</Button>
        )}
      </div>
      {citycng &&(
        <form onSubmit={handleSubmit}>
          <TextInput
            type='text'
            id='currentCity'
            placeholder='Your Current City...'
            defaultValue={currentUser.currentCity}
            onChange={handleChange}
            required
          />
          <div className='flex justify-between p-2'>
            <Button color={'failure'} onClick={() => setCitycng(false)}>Cancel</Button>
            <Button className=' bg-blue-600' type='submit'>Submit</Button>
          </div>
        </form>
      )}

      {/* edu */}
      <div className=' gap-2'>
        <div className='flex justify-between py-2'>
          <h2 className=' text-lg font-bold'>Education</h2>
          {!addEdu &&(
            <Button className=' bg-blue-600' onClick={() => setAddEdu(true)}>
              <div className='flex align-middle justify-center gap-1'>
                Add 
                <PiPlusBold className=' h-5 w-5' />
              </div>
              </Button>
          )}
        </div>
        {addEdu &&(
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-1'>
              <h4>Your Institution</h4>
              <TextInput
                type='text'
                id='institution'
                placeholder='Name of the institute'
                onChange={handleChange}
                required
              />
            </div>
            <div className='flex flex-col gap-1'>
              <h4>Time Period:</h4>
              <div>
                From  <input type='number' id='from' className=' w-20 h-6 text-black' onChange={handleChange} required />     To  <input onChange={handleChange} type='number' id='to' className=' w-20 h-6 text-black' />
              </div>
            </div>

            <div className='flex flex-col gap-1'>
              <h4>Descirption</h4>
              <Textarea
                type='text'
                placeholder="Please describe briefly..."
                required
                id='description'
                className='w-full resize-none object-cover rounded border-[#66666690] outline-none text-sm text-ascent-1 placeholder:text-[#666] h-32'
                onChange={handleChange}
              />
            </div>
              <div className='flex justify-between p-2'>
                <Button color={'failure'} onClick={() => setAddEdu(false)}>Cancel</Button>
                <Button className=' bg-blue-600' type='submit'>Submit</Button>
              </div>
            </div>
          </form>
        )}
        {currentUser?.education?.length>0 ? (
          currentUser?.education.map((edu, index) => (
            <EducationEdit edu={edu} key={index} />
          ))):(
            <div>No Education Background Added</div>
          )
        }
      </div>

      {/* work */}
      <div className=' gap-2'>
        <div className='flex justify-between py-2'>
          <h2 className=' text-lg font-bold'>Work</h2>
          {!addWork &&(
            <Button className=' bg-blue-600' onClick={() => setAddWork(true)}>
              <div className='flex align-middle justify-center gap-1'>
                Add 
                <PiPlusBold className=' h-5 w-5' />
              </div>
              </Button>
          )}
        </div>
        {addWork &&(
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-1'>
              <h4>Your Workplace</h4>
              <TextInput
                type='text'
                id='company'
                placeholder='Name of the company'
                onChange={handleChange}
                required
              />
            </div>
            <div className='flex flex-col gap-1'>
              <h4>Time Period:</h4>
              <div>
                From  <input type='number' id='from' className=' w-20 h-6 text-black' onChange={handleChange} required />     To  <input onChange={handleChange} type='number' id='to' className=' w-20 h-6 text-black' />
              </div>
            </div>

            <div className='flex flex-col gap-1'>
              <h4>Your Position</h4>
              <TextInput
                type='text'
                id='position'
                placeholder='Name of the position'
                onChange={handleChange}
                required
              />
            </div>

            <div className='flex flex-col gap-1'>
              <h4>Descirption</h4>
              <Textarea
                type='text'
                placeholder="Please describe briefly..."
                required
                id='description'
                className='w-full resize-none object-cover rounded border-[#66666690] outline-none text-sm text-ascent-1 placeholder:text-[#666] h-32'
                onChange={handleChange}
              />
            </div>
              <div className='flex justify-between p-2'>
                <Button color={'failure'} onClick={() => setAddWork(false)}>Cancel</Button>
                <Button className=' bg-blue-600' type='submit'>Submit</Button>
              </div>
            </div>
          </form>
        )}
        {currentUser?.work?.length>0 ?(
          currentUser?.work.map((wrk, index) => (
            <WorkEdit wrk={wrk} key={index} />
          ))):(
          <div>No Work Background Added</div>
        )}
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
    </div>
  )
}
