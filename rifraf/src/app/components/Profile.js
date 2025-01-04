import React, { useState, useEffect } from 'react';
import Player from 'react-player';
import { RiUpload2Fill, RiArrowLeftDoubleLine, RiUpload2Line } from "react-icons/ri";
import { FaStar, FaUserEdit } from "react-icons/fa";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';

const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: fromEnv()
});

const Profile = () => {
  const [tab, setTab] = useState('Favorites');
  const [videoLink, setVideoLink] = useState('');
  const [playVideo, setPlayVideo] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [profile, setProfile] = useState({ Uname: localStorage.getItem('profile'), Headline: '', Bio: '' });
  const [uploads, setUploads] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reposts, setReposts] = useState([]);
  const [profilePic, setProfilePic] = useState('');
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    fetchProfileData();
    fetchUploads();
    fetchFavs();
    fetchShared();
    fetchPhoto();
    fetchThumbnails();
  }, []);

  const handleProgress = (state) => {
    setPlayedSeconds(state.playedSeconds);
  };

  const fetchProfileData = async () => {
    try {
      const params = {
        Bucket: 'rifraf.site',
        Key: `users/${profile.Uname}/profile.json`,
      };
      const command = new GetObjectCommand(params);
      const data = await s3Client.send(command);
      const bodyContents = await streamToString(data.Body);
      setProfile(JSON.parse(bodyContents));
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  const fetchUploads = async () => {
    try {
      const params = {
        Bucket: 'rifraf.site',
        Key: `users/${profile.Uname}/uploads.json`,
      };
      const command = new GetObjectCommand(params);
      const data = await s3Client.send(command);
      const bodyContents = await streamToString(data.Body);
      setUploads(JSON.parse(bodyContents));
    } catch (error) {
      console.error('Error fetching uploads:', error);
    }
  };

  const fetchFavs = async () => {
    try {
      const params = {
        Bucket: 'rifraf.site',
        Key: `users/${profile.Uname}/favorites.json`,
      };
      const command = new GetObjectCommand(params);
      const data = await s3Client.send(command);
      const bodyContents = await streamToString(data.Body);
      setFavorites(JSON.parse(bodyContents));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchShared = async () => {
    try {
      const params = {
        Bucket: 'rifraf.site',
        Key: `users/${profile.Uname}/reposts.json`,
      };
      const command = new GetObjectCommand(params);
      const data = await s3Client.send(command);
      const bodyContents = await streamToString(data.Body);
      setReposts(JSON.parse(bodyContents));
    } catch (error) {
      console.error('Error fetching reposts:', error);
    }
  };

  const fetchPhoto = async () => {
    try {
      const params = {
        Bucket: 'rifraf.site',
        Key: `users/${profile.Uname}/pic.png`,
      };
      const command = new GetObjectCommand(params);
      const data = await s3Client.send(command);
      const bodyContents = await streamToBlob(data.Body);
      setProfilePic(URL.createObjectURL(bodyContents));
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  const fetchThumbnails = async () => {
    try {
      const params = {
        Bucket: 'rifraf.site',
        Key: `users/${profile.Uname}/Thumbnails/`,
      };
      const command = new GetObjectCommand(params);
      const data = await s3Client.send(command);
      const bodyContents = await streamToBlob(data.Body);
      setThumbnails(URL.createObjectURL(bodyContents));
    } catch (error) {
      console.error('Error fetching thumbnails:', error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const command = new PutObjectCommand({
        Bucket: 'rifraf.site',
        Key: `users/${profile.Uname}/profile.json`,
        Body: JSON.stringify(profile),
        ContentType: 'application/json'
      });
      await s3Client.send(command);
      alert('Profile updated successfully!');
      setShowEdit(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Profile update failed, please try again.');
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

  // Utility function to convert stream to Blob
  const streamToBlob = (stream) => {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(new Blob(chunks)));
    });
  };

  return (
    <div>
      <div 
        style={{ position: 'fixed', top: '10px', left: '10px', backgroundImage: `url(${profilePic})`, height: '40px', width: '40px', borderRadius: '20px', backgroundPosition: 'center', backgroundSize: 'cover' }}
      />
      <FaUserEdit  className='fixed-icon' style={{ top: '10px', right: '10px' }} size={25} onClick={() => setShowEdit(!showEdit)} />
      <label style={{ position: 'fixed', top: '13px', left: '56px', fontSize: '14px', textDecoration: 'underline'  }}>{profile.Uname}</label>
      <label style={{ position: 'fixed', top: '33px', left: '56px', fontSize: '14px' }}>{profile.Headline}</label>
      <div 
        style={{ position: 'fixed', top: '60px', left: '15px', right: '15px', height: '75px', backgroundColor: 'rgb(200, 200, 200)', color: 'rgb(30, 30, 30)', borderRadius: '4px' }}
      >
        <label style={{ position: 'fixed', top: '65px', left: '20px', fontSize: '13px', textDecoration: 'underline', fontWeight: 'bolder' }}>Bio</label>
        <label style={{ position: 'fixed', top: '85px', left: '20px', fontSize: '13px' }}>{profile.Bio}</label>
      </div>
      <div style={{ position: 'fixed', top: '150px', left: '0px', right: '0px', bottom: '35px', backgroundColor: 'rgba(0,0,0,0)', zIndex: '2', borderTop: 'solid 1px white' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px', height: '20px', borderBottom: 'solid 1px white' }}>
          <RiUpload2Fill className='fixed-icon-2' style={{ marginLeft: '10px' }} onClick={() => setTab('Uploads')}/>
          <FaStar className='fixed-icon-2' style={{ flex: '0 1 auto', margin: '0 auto' }} onClick={() => setTab('Favorites')}/>
          <FaRegShareFromSquare className='fixed-icon-2' style={{ marginRight: '10px' }} onClick={() => setTab('Reposts')}/>
        </div>
      </div>
      <div style={{ position: 'fixed', top: '180px', left: '0px', right: '0px', bottom: '35px', backgroundColor: 'rgb(200, 200, 200)', zIndex: '3' }}>
        {tab === 'Uploads' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
            {uploads.map((upload, index) => (
              <div 
                key={index} 
                style={{ backgroundImage: `url(${thumbnails/upload.Thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '120px', width: '100%', zIndex: '3', cursor: 'pointer', border: 'solid 1px rgba(130, 130, 130, .5)', borderRadius: '4px' }}
                onClick={() => { setPlayVideo(true); setVideoLink(upload.Link) }}
              >
                <label style={{ position: 'relative', bottom: '-100px', left: '5px', color: 'rgb(145, 145, 145)' }}>{upload.Likes}</label>
              </div>
            ))}
          </div>
        )}
        {tab === 'Favorites' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
            {favorites.map((favorite, index) => (
              <div
                key={index} 
                style={{ backgroundImage: `url(${thumbnails/favorite.Thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '120px', width: '100%', zIndex: '3', cursor: 'pointer',
                  border: 'solid 1px rgba(130, 130, 130, .5)', borderRadius: '4px'
                }}
                onClick={() => {setPlayVideo(true); setVideoLink(favorite.Link)}}
              >
                <label style={{ position: 'relative', bottom: '-100px', left: '5px', color: 'rgb(145, 145, 145)' }}>{favorite.Likes}</label>
              </div>
            ))}
          </div>
        )}
        {tab === 'Reposts' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '2px'
          }}>
            {reposts.map((repost, index) => (
              <div 
                key={index} 
                style={{ backgroundImage: `url(${thumbnails/repost.Thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '120px', width: '100%', zIndex: '3', cursor: 'pointer',
                  border: 'solid 1px rgba(130, 130, 130, .5)', borderRadius: '4px'
                }}
                onClick={() => {setPlayVideo(true); setVideoLink(repost.Link)}}
              >
                <label style={{ position: 'relative', bottom: '-100px', left: '5px', color: 'rgb(145, 145, 145)' }}>{repost.Likes}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      {playVideo && (
        <div style={{ zIndex: '4', position: 'fixed', top: '0px', right: '0px', left: '0px', bottom: '40px' }}>
          <div style={{ position: 'absolute', top: '0', left: '0', right: '0px', bottom: '0px' }}>
            <Player url={videoLink} playing={playing} volume={volume} onProgress={handleProgress} width='100%' height='100%' controls />
          </div>
          <RiArrowLeftDoubleLine className='fixed-icon-2' size={25} style={{ position: 'fixed', top: '20px', left: '10px', zIndex: '5' }} onClick={() => {setPlayVideo(false); setVideoLink('')}} />
        </div>
      )}
      {showEdit && (
        <div 
          style={{ position: 'fixed', top: '120px', bottom: '100px', left: '5px', right: '5px', zIndex: '4', backgroundColor: 'white', borderRadius: '8px',
          color: 'rgb(30,30,30)', padding: '10px' }}
        >
          <h4 style={{ marginBottom: '10px', marginTop: '0px' }} >Edit Profile</h4>
          <label>
            Headline: <input style={{ width: '99%', padding: '3px', border: 'solid 1px rgb(200,200,200)', borderRadius: '5px', backgroundColor: 'rgb(255, 255, 255)' }} ></input>
          </label>
          <div className='spacer'/>
          <label>
            Bio: 
            <textarea 
              style={{ minWidth: '98%', maxWidth: '98%', padding: '3px', border: 'solid 1px rgb(200,200,200)', borderRadius: '5px', maxHeight: '50px', minHeight: '50px',
                backgroundColor: 'rgb(255, 255, 255)'  }} 
            ></textarea>
          </label>
          <div className='spacer'/>
          <div className='spacer'/>
          <label>Picture:</label>
          <div 
            style={{ position: 'fixed', bottom: '110px', left: '15px', backgroundImage: `url(${profilePic})`, height: '60px', width: '60px', borderRadius: '30px', 
            backgroundPosition: 'center', backgroundSize: 'cover' }}
          />
          <button 
            style={{ position: 'fixed', bottom: '110px', left: '85px', right: '15px', backgroundColor: 'rgb(255, 255, 255)', color: 'rgb(30,30,30)', 
            border: 'solid 1px rgb(200,200,200)', borderRadius: '8px', padding: '10px' }}
          >
            <RiUpload2Line size={30} />
            <div className='spacer'/>
            Upload Photo
          </button>
        </div>
      )}
    </div>
  )
}

export default Profile;