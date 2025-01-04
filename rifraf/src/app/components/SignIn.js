import React, { useState } from 'react';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';
import Register from './Register';

const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: fromEnv()
});

const SignIn = ({ setSignedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignIn, setShowSignIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const fetchProfile = async () => {
    try {
      const params = {
        Bucket: 'rifraf.site',
        Key: `users/${username}/profile.json`,
      };
      const command = new GetObjectCommand(params);
      const data = await s3Client.send(command);
      const bodyContents = await streamToString(data.Body);
      return JSON.parse(bodyContents);
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    const profileData = await fetchProfile();
    if (profileData && profileData.Uname === username && password === profileData.Password) {
      localStorage.setItem('profile', username);
      setSignedIn(true);
    } else {
      alert('User does not exist.');
    }
  };

  // Utility function to convert stream to string
  const streamToString = (stream) => {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  };

  return (
    <div className='signin' style={{ backgroundImage: `url('/logo512.png')` }}>
      <div style={{ position: 'fixed', top: '140px', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '220px' }}>
        <h1 style={{ textAlign: 'center', margin: '0px', padding: '0px', textShadow: '3px 3px 3px rgba(0, 0, 0, 0.5)' }}>RifRaf</h1>
        <h3 style={{ textAlign: 'center', margin: '0px', padding: '0px' }}>
          For the Lulz
        </h3>
      </div>
      <div style={{ position: 'fixed', bottom: '15px', right: '15px', left: '15px' }}>
        <button style={{ float: 'left', margin: '10px' }} onClick={() => { setShowSignIn(!showSignIn); setShowRegister(false); }}>SIGN IN</button>
        <button style={{ float: 'right', margin: '10px' }} onClick={() => { setShowRegister(!showRegister); setShowSignIn(false); }}>REGISTER</button>
      </div>
      {showRegister && (
        <Register />
      )}
      {showSignIn && (
        <form onSubmit={handleSignIn}>
          <h2>Sign Into RifRaf</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className='spacer' />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className='spacer' />
          <div className='spacer' />
          <button style={{ color: 'blue' }} type="submit">Sign In</button>
          <div className="spacer" />
          <button onClick={() => { setShowRegister(true); setShowSignIn(false); }}>Register</button>
        </form>
      )}
    </div>
  );
}

export default SignIn;
