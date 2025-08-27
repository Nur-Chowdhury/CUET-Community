import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import profile from "../assets/userprofile.png"
import {TextInput, FileInput, Label, Button, Alert} from 'flowbite-react'
import {BiImage} from 'react-icons/bi';
import { postCreateRoute } from '../utils/ApiRoutes';
import { supabase } from '../supabase';

export default function PostCreate() {
    const {currentUser} = useSelector((state) => state.user);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [publishError, setPublishError] = useState(null);
    const [formData, setFormData] = useState({});
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        setUploading(true);
        const fileName = `${Date.now()}_${file.name}`;
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('img_bkt')
            .createSignedUploadUrl(fileName);
    
        if (signedUrlError) {
            console.log('Failed to get signed URL:', signedUrlError.message);
            setImageUploadError('Image upload failed');
            setUploading(false);
            return;
        }
    
        const uploadUrl = signedUrlData?.signedUrl;

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);
    
        xhr.onload = async () => {
            if (xhr.status === 200) {
                const { data: urlData } = supabase.storage
                    .from('img_bkt')
                    .getPublicUrl(fileName);

                const publicUrl = urlData?.publicUrl;
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    image: publicUrl,
                }));
                setImageUploadError(null);
                setUploading(false);
            } else {
                console.log("Upload failed with status:", xhr.status);
                setImageUploadError('Image upload failed');
                setUploading(false);
            }
        };
    
        xhr.onerror = () => {
            console.error("XHR upload error");
            setImageUploadError('Image upload failed');
            setUploading(false);
        };
    
        xhr.send(file);
    };

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
                    { formData.image ? (
                        <div className=' flex gap-4 items-center'>
                            <img
                                src={formData.image}
                                alt='User Image'
                                className=' w-14 h-14 object-cover' 
                            />
                            <div
                                className=' bg-red-800 px-4 py-1 rounded-lg cursor-pointer text-white'
                                onClick={() => setFormData({...formData, image: null})}
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
                                onChange={ handleFileUpload }
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
                    {uploading && 
                        <Alert color='info'>
                            Image Uploading...
                        </Alert>
                    }
                </div>
            </form>
        </div>
    )
}
