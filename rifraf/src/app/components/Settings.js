import React, { useState, useEffect } from 'react';
import { RiInformationFill } from "react-icons/ri";
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';

const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: fromEnv()
});

const Settings = () => {
  const [savedSettings, setSavedSettings] = useState({});
  const [user, setUser] = useState({});
  const [infoVET, setInfoVET] = useState(false);
  const [infoPM, setInfoPM] = useState(false);
  const profile = localStorage.getItem('profile');

  useEffect(() => {
    fetchProfileData();
    fetchSettings();
  }, []);

  const fetchProfileData = async () => {
    try {
      const params = {
        Bucket: 'rifraf.site',
        Key: `users/${profile}/profile.json`,
      };
      const command = new GetObjectCommand(params);
      const data = await s3Client.send(command);
      return JSON.parse(await streamToString(data.Body));
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  const fetchSettings = async () => {
    try {
      const params = {
        Bucket: 'rifraf.site',
        Key: `users/${profile}/settings.json`,
      };
      const command = new GetObjectCommand(params);
      const data = await s3Client.send(command);
      setSavedSettings(JSON.parse(await streamToString(data.Body)));
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: 'rifraf.site',
        Key: `users/${profile}/profile.json`,
        Body: JSON.stringify(user),
        ContentType: 'application/json'
      }));

      await s3Client.send(new PutObjectCommand({
        Bucket: 'rifraf.site',
        Key: `users/${profile}/settings.json`,
        Body: JSON.stringify(savedSettings),
        ContentType: 'application/json'
      }));
      
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
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
    <div 
      style={{ position: 'fixed', top: '0px', bottom: '35px', left: '0px', right: '0px', 
      backgroundColor: 'white', color: 'rgb(30,30,30)', zIndex: '6', overflow: 'auto' }}
    >
      <h4 style={{ margin: '15px', marginTop: '10px' }} >App Settings</h4>
      <label style={{ marginLeft: '10px' }} >
        Dark Theme: {savedSettings.ThemeDark ? 'Enabled' : 'Disabled'}
        <label className="switch" style={{ left: '22px' }} >
          <input 
            type='checkbox' 
            checked={savedSettings.ThemeDark}
            onChange={(e) => setSavedSettings({ ...savedSettings, ThemeDark: e.target.checked })}
          />
          <span className="slider"></span>
        </label>
      </label>
      <div className='spacer'/>
      <label style={{ marginLeft: '10px' }} >
        Notifications: {savedSettings.Notifications ? 'On' : 'Off'}
        <label className="switch" style={{ left: '23px' }} >
          <input 
            type='checkbox' 
            checked={savedSettings.Notifications}
            onChange={(e) => setSavedSettings({ ...savedSettings, Notifications: e.target.checked })}
          />
          <span className="slider"></span>
        </label>
      </label>
      <div className='spacer'/>
      <label style={{ marginLeft: '10px' }} >
        Default VET: {savedSettings.DefaultVet ? 'Enabled' : 'Disabled'}
        <label className="switch" style={{ left: '26px' }} >
          <input 
            type='checkbox' 
            checked={savedSettings.DefaultVet}
            onChange={(e) => setSavedSettings({ ...savedSettings, DefaultVet: e.target.checked })}
          />
          <span className="slider"></span>
        </label>
      </label>
      <RiInformationFill className='fixed-icon-2' style={{ position: 'fixed', left: '210px' }} size={20} onClick={() => setInfoVET(!infoVET)} />
      <div className='spacer'/>
      <label style={{ marginLeft: '10px' }} >
        Private Mode: {savedSettings.Private ? 'Enabled' : 'Disabled'}
        <label className="switch" style={{ left: '17px' }} >
          <input 
            type='checkbox' 
            checked={savedSettings.Private}
            onChange={(e) => setSavedSettings({ ...savedSettings, Private: e.target.checked })}
          />
          <span className="slider"></span>
        </label>
      </label>
      <RiInformationFill className='fixed-icon-2' style={{ position: 'fixed', left: '210px' }} size={20} onClick={() => setInfoPM(!infoPM)} />
      <div className='spacer'/>
      {infoVET && (
        <div className='btn1' style={{ top: '180px', bottom: '150px', left: '5px', right: '5px', zIndex: '8', backgroundColor: 'rgb(200,200,200)' }} onClick={() => setInfoVET(!infoVET)} >
          <h3>Viewer Engagement Tool</h3>
          The VET is a system that creators can use that allows them to automatically respond to comments for their posts on various platforms, including RifRaf!
          Using the VET on RifRaf is free, but if you want to use it for example on a Facebook post, then you will have to subscribe for VET and link your
          Facebook account. This has been integrated with several social media and content platforms, so be sure to check it out!
        </div>
      )}
      {infoPM && (
        <div className='btn1' style={{ top: '180px', bottom: '150px', left: '5px', right: '5px', zIndex: '8', backgroundColor: 'rgb(200,200,200)' }} onClick={() => setInfoPM(!infoPM)} >
          <h3>Private Mode</h3>
          Enabling private mode will set your profile and direct messaging to private. This means that only friends will be able to view your content
          and send you messages. Other users will not be able to follow you and subscriptions will be disabled for your account. You will not be able 
          to make any public posts, or comment on posts that are not yours or your friends'. Your account data will still be stored for functionality 
          of the app, but will not be used for any other purposes.
        </div>
      )}
      <h4 style={{ margin: '15px', marginTop: '10px' }} >Account Settings</h4>
      <label style={{ marginLeft: '10px' }} >
        Email: <input 
          style={{ position: 'fixed', left: '70px', width: '150px' }} 
          placeholder={user.Email} 
          value={user.Email}
          onChange={(e) => setUser({ ...user, Email: e.target.value })}
        />
      </label>
      <div className='spacer'/>
      <label style={{ marginLeft: '10px' }} >
        Phone: <input 
          style={{ position: 'fixed', left: '70px', width: '150px' }} 
          placeholder={user.Phone} 
          value={user.Phone}
          onChange={(e) => setUser({ ...user, Phone: e.target.value })}
        />
      </label>
      <div className='spacer'/>
      <button 
        className='btn1' 
        style={{ bottom: '100px', left: '5px', right: '5px' }} 
        onClick={handleSaveChanges}
      >
        Save Changes
      </button>
      <button className='btn1' style={{ bottom: '70px', left: '5px', right: '5px' }} >Reset Password</button>
      <button className='btn1' style={{ bottom: '40px', left: '5px', right: '5px' }} >Delete Account</button>
    </div>
  );
};

export default Settings;
