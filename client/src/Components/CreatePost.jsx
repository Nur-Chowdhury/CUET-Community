import React, {useState} from 'react'
import profile from "../assets/userprofile.png"
import {BiImage} from 'react-icons/bi'
import {useSelector} from 'react-redux'
import {app} from "../firebase";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import {Alert, Button, FileInput, TextInput, Label} from 'flowbite-react'


export default function CreatePost() {
    const {currentUser} = useSelector((state) => state.user);
    const [posting, setPosting] = useState(false);
    const [file, setFile] = useState(null);
    const [publishError, setPublishError] = useState("");
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});

    const handleUpload = async() => {
        console.log('hi'); 
        // e.preventDefault();
        // setPosting(true);

        if(!formData.content){
            return setPublishError('Please write something!');
        }

        try{
            // try {
            //     setImageUploadError(null);
            //     const storage = getStorage(app);
            //     const fileName = new Date().getTime() + '-' + file.name;
            //     const storageRef = ref(storage, fileName);
            //     const uploadTask = uploadBytesResumable(storageRef, file);
            //     uploadTask.on(
            //         'state_changed',
            //         (error) => {
            //             setImageUploadError('Image upload failed');
            //         },
            //         () => {
            //             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //             setImageUploadError(null);
            //             setFormData({ ...formData, image: downloadURL });
            //             });
            //         }
            //     );
            // } catch (error) {
            //     setImageUploadError('Image upload failed');
            // }
            console.log(formData);
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if(!res.ok){
                setPublishError(data.message);
                return;
            }

            if(res.ok){
                setPublishError(null);
            }
            setPosting(false);

        }catch(error){
            setPublishError('Something Went Wrong.');
        }
    }

  return (
    <div>
      <form className=' bg-gray-300 dark:bg-[rgb(11,11,11)] px-4 rounded-lg'
        onSubmit={handleUpload}
      >
        <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
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
                    className='w-full rounded-full object-cover bg-secondary border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-3 placeholder:text-[#666]'
                    onChange={(e)=>{
                        setFormData({...formData, content: e.target.value})
                        console.log(formData.content);
                    }}
                // styles=''
                // placeholder="What's on your mind..."
                // name='description'
                // onChange = {(value)=> {
                //     setFormData({...formData, content: value})
                //     console.log(formData.content)
                // }}
                />
            </div>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}

        <div className='flex items-center justify-between py-4'>
            <Label
            htmlFor='imgUpload'
            className='flex items-center gap-1 text-base cursor-pointer'
            >
            <FileInput type="file"
                accept = 'image/*'
                onChange={(e)=> setFile(e.target.files[0])}
                className='hidden'
                id = 'imgUpload'
                data-max-size = '5120'
            />
            <BiImage />
            <span>Image</span>
            </Label>
            <div>
            {
                posting? (
                Loading
                ):(
                <Button type='submit' gradientDuoTone='purpleToPink'>
                    Post
                </Button>
                )
            }
            </div>
            {publishError && (
                <Alert className='mt-5' color='failure'>
                    {publishError}
                </Alert>
            )}
        </div>
        </form>
    </div>
  )
}
