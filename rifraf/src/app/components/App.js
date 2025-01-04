import React, { useState, useEffect } from 'react';
import Home from './Home';
import Profile from './Profile';
import Messages from './Messaging';
import Upload from './Upload';
import Settings from './Settings';
import SignIn from './SignIn';
import './App.css';
import { 
    RiHome9Line,
    RiDiscussLine,
    RiAccountCircleLine,
    RiSettings4Line
} from "react-icons/ri";
import { SlCamrecorder } from "react-icons/sl";

const App = () => {
  const [page, setPage] = useState('Home');
  const [signedIn, setSignedIn] = useState(false);

  const Nav = () => (
    <nav className='appnav'>
      <SlCamrecorder className='fixed-icon-2' style={{ position: 'fixed', bottom: '4px', left: '25%' }} size={25} onClick={() => setPage('Upload')}/>
      <RiAccountCircleLine className='fixed-icon-2' style={{ position: 'fixed', bottom: '4px', left: '20px' }} size={25} onClick={() => setPage('Profile')}/>
      <RiHome9Line className='fixed-icon-2' style={{ position: 'relative', bottom: '0px' }} size={35} onClick={() => setPage('Home')}/>
      <RiDiscussLine className='fixed-icon-2' style={{ position: 'fixed', bottom: '4px', right: '25%' }} size={25} onClick={() => setPage('Messages')}/>
      <RiSettings4Line className='fixed-icon-2' style={{ position: 'fixed', bottom: '5px', right: '20px' }} size={25} onClick={() => setPage('Settings')}/>
    </nav>
  );

  if (!signedIn) {
    return (
      <div className='page'>
        <SignIn setSignedIn={setSignedIn} />
      </div>
    );
  }

  return (
    <div className='App'>
      {page === 'Home' && (
        <div className='page'>
          <Home />
          <Nav />
        </div>
      )}
      {page === 'Profile' && (
        <div className='page'>
          <Profile />
          <Nav />
        </div>
      )}
      {page === 'Messages' && (
        <div className='page'>
          <Messages />
          <Nav />
        </div>
      )}
      {page === 'Settings' && (
        <div className='page'>
          <Nav />
          <Settings />
        </div>
      )}
      {page === 'Upload' && (
        <div className='page'>
          <Nav />
          <Upload />
        </div>
      )}
    </div>
  );
};

export default App;
