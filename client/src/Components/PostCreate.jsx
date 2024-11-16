import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import profile from "../assets/userprofile.png"
import {TextInput, FileInput, Label, Button, Alert} from 'flowbite-react'
import {BiImage} from 'react-icons/bi';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import {app} from '../firebase'
import { postCreateRoute } from '../utils/ApiRoutes';


export default function PostCreate() {
    const {currentUser} = useSelector((state) => state.user);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [publishError, setPublishError] = useState(null);
    const [formData, setFormData] = useState({});
    const [uploading, setUploading] = useState(false);
    const [img, setImg] = useState(null);

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        setUploading(true);
        try{
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            uploadBytesResumable(storageRef, file).then((value)=>{
                getDownloadURL(value.ref).then((url) => {
                    console.log(url);
                    setImageUploadError(null);
                    setFormData({...formData, image: url});
                    setUploading(false);
                    setImg(url);
                });
            });
            // const uploadTask = uploadBytesResumable(storageRef, file);
            // uploadTask.on(
            //     'state_changed',
            //     (error) => {
            //         console.log(error);
            //         setImageUploadError('Image Upload Failed');
            //     },
            //     () => {
            //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //             setImageUploadError(null);
            //             console.log(downloadURL);
            //             setFormData({...formData, img: downloadURL});
            //         });
            //     }
            // );
        }catch(error){
            setImageUploadError(error);
            setUploading(false);
        }
    }

    const handleSubmit = async (e) => {
        //e.preventDefault(); 
        try {
            console.log("a", formData); 
            const res = await fetch(`${postCreateRoute}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
        
            if (res.ok) {
                setPublishError(null);
                //navigate("/");
            }
        } catch (error) {
            setPublishError('Something went wrong');
        }
      
    }

  return (
    <div>
      <form onSubmit={handleSubmit} className='bg-gray-300 dark:bg-[rgb(11,11,11)] px-4 rounded-lg'>
        <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
            <img
                src={currentUser?.profile ?? profile}
                alt='User Image'
                className=' w-14 h-14 rounded-full object-cover' 
            />
            <div className='w-full flex flex-col mt-2'>
                <TextInput
                    type='text'
                    placeholder="What's on your mind..."
                    required
                    id='content'
                    className='w-full rounded-full object-cover bg-secondary border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-3 placeholder:text-[#666] max-h-32'
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                /> 
            </div>
        </div>
        <div className='flex items-center justify-between py-4'>
            { img ? (
                <div className=' flex gap-4 items-center'>
                    <img
                        src={img}
                        alt='User Image'
                        className=' w-14 h-14 object-cover' 
                    />
                    <div
                        className=' bg-red-800 px-4 py-1 rounded-lg cursor-pointer text-white'
                        onClick={() => setImg(null)}
                    >
                        Delete
                    </div>
                </div>
            ):(
                <Label
                    htmlFor='image'
                    className='flex items-center gap-1 text-base cursor-pointer'
                >
                    <FileInput
                    accept='image/*'
                    className='hidden'
                    id='image'
                    onChange={ handleUpload }
                />
                <BiImage size={30}/>
                <span>Image</span>
            </Label>
            )}
            <div>
                <Button outline gradientDuoTone='purpleToBlue' type='submit' disabled={uploading}>
                    Post
                </Button>
            </div>
        </div>
        <div className=' p-1'>
            {publishError && (
                <Alert className='mt-5' color='failure'>
                    {publishError}
                </Alert>
            )}
            {imageUploadError && 
                <Alert color='failure'>
                    {imageUploadError}
                </Alert>
            }
        </div>
      </form>
    </div>
  )
}
