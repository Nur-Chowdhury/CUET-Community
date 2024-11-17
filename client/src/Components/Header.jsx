import React, {useEffect, useState} from 'react'
import {Avatar, Button, Dropdown, DropdownHeader, Navbar, TextInput} from 'flowbite-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import {AiOutlineSearch} from 'react-icons/ai';
import {FaMoon, FaSun} from 'react-icons/fa';
import { toggleTheme } from '../redux/slices/themeSlice';
import {useSelector, useDispatch} from 'react-redux';
import {setReceiver, signoutSuccess} from '../redux/slices/userSlice'
import {setCommentsNull} from  '../redux/slices/commentSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { signoutRoute } from '../utils/ApiRoutes';

export default function Header() {

    const {theme} = useSelector((state) => state.theme);
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('search');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('search', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };



    const handleSignOut = async () => {
        try {
            const res = await fetch(`${signoutRoute}`,{
                method: 'POST',
            })
            const data = await res.json();
            if(!res.ok){
                console.log(data.message);
            }else{
                dispatch(setCommentsNull());
                dispatch(signoutSuccess());
                dispatch(setReceiver());
            }
        } catch (error) {
            console.log(error.message);
        }
    }

  return (
    <Navbar className=' w-full border-b-2 flex justify-between'>
        <div className=' w-[10%]'>
            <Link to='/' className=' max-w-full self-center whitespace-nowrap'>
                <img src={logo} alt='logo' className=' max-h-16' />
            </Link>
        </div>

        <div className=' w-[70%]'>
            <form className=' max-w-full' onSubmit={handleSubmit}>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    className='inline'
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
        </div>

        {/* <Button className=' w-12 h-16 lg:hidden border-2'
            color=' gray' pill>
            <AiOutlineSearch className=' self-center w-8 h-10' />
        </Button> */}

        <div className=' w-[20%] flex justify-between md:order-2'>
            <Button 
                className=' max-w-[45%] h-10 inline'
                color={'gray'}
                pill
                onClick={()=> dispatch(toggleTheme())}
            >
                {theme === 'light' ? <FaMoon />: <FaSun />}
            </Button>
            {currentUser ? (
                <Dropdown 
                    arrowIcon={false}
                    inline
                    label = {
                        currentUser?.profile ? (
                            <img
                              src={currentUser?.profile}
                              alt="User Profile"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <Avatar rounded />
                        )
                    }
                >
                    <Dropdown.Header>
                        <span className=' block text-sm'>
                            @{currentUser?.userName}
                        </span>
                        <span className=' block text-sm font-medium truncate'>
                            {currentUser?.email}
                        </span>
                    </Dropdown.Header>
                    <Link to={"/profile/"+ currentUser?.studentID}>
                        <Dropdown.Item>Profile</Dropdown.Item>
                    </Link>
                    <Dropdown.Item onClick={handleSignOut}>Log Out</Dropdown.Item>
                </Dropdown>
            ):(
                <Link to={'/login'}>
                    <Button outline gradientDuoTone='purpleToBlue'>
                        Login
                    </Button>
                </Link>
            )
            }
        </div>
    </Navbar>
  )
}
