import React, { useState } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';

const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: fromEnv()
});

function Register() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const profilesData = {
      Username: userName, 
      Password: password, 
      Email: email, 
      Role: 'Standard'
    };

    const settingsData = {};
    const favoritesData = {};
    const repostData = {};
    const uploadData = {};
    const friendData = {};
    const followingData = {};

    try {
      await Promise.all([
        s3Client.send(new PutObjectCommand({
          Bucket: 'rifraf.site',
          Key: `users/${userName}/profile.json`,
          Body: JSON.stringify(profilesData),
          ContentType: 'application/json'
        })),
        s3Client.send(new PutObjectCommand({
          Bucket: 'rifraf.site',
          Key: `users/${userName}/friends.json`,
          Body: JSON.stringify(friendData),
          ContentType: 'application/json'
        })),
        s3Client.send(new PutObjectCommand({
          Bucket: 'rifraf.site',
          Key: `users/${userName}/following.json`,
          Body: JSON.stringify(followingData),
          ContentType: 'application/json'
        })),
        s3Client.send(new PutObjectCommand({
          Bucket: 'rifraf.site',
          Key: `users/${userName}/settings.json`,
          Body: JSON.stringify(settingsData),
          ContentType: 'application/json'
        })),
        s3Client.send(new PutObjectCommand({
          Bucket: 'rifraf.site',
          Key: `users/${userName}/favorites.json`,
          Body: JSON.stringify(favoritesData),
          ContentType: 'application/json'
        })),
        s3Client.send(new PutObjectCommand({
          Bucket: 'rifraf.site',
          Key: `users/${userName}/reposts.json`,
          Body: JSON.stringify(repostData),
          ContentType: 'application/json'
        })), 
        s3Client.send(new PutObjectCommand({
          Bucket: 'rifraf.site',
          Key: `users/${userName}/uploads.json`,
          Body: JSON.stringify(uploadData),
          ContentType: 'application/json'
        })),
        s3Client.send(new PutObjectCommand({
          Bucket: 'rifraf.site',
          Key: `users/${userName}/Thumbnails/`,
          ContentType: 'folder'
        })),
        s3Client.send(new PutObjectCommand({
          Bucket: 'rifraf.site',
          Key: `users/${userName}/Messages/`,
          ContentType: 'folder'
        })),
      ]);

      alert('User registered successfully!');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed, please try again.');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
      />
      <div className='spacer' />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className='spacer' />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className='spacer' />
      <div className='spacer' />
      <button id="register-button" type="submit">Register</button>
    </form>
  );
}

export default Register;
