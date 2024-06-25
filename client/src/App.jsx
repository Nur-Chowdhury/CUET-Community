import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Signup from './pages/SignUp';
import Header from './Components/Header';
import PrivateRoute from './Components/PrivateRoute';
import EditProfile from './pages/EditProfile';
import Search from './pages/Search';
import Profile from './pages/Profile';

const App = () => {
  //const { currentUser } = useSelector((state) => state.user);

  return (
    <BrowserRouter> 
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/profile/:id?' element={<Profile />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/edit' element={<EditProfile />} />
          <Route path='/search' element={<Search />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
