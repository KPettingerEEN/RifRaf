import React, { useState, useEffect } from 'react';
import Player from 'react-player';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';

const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: fromEnv()
});

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadName, setUploadName] = useState('');
  const [tags, setTags] = useState([]);
  const [link, setLink] = useState('');
  const [about, setAbout] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const profile = localStorage.getItem('profile');

  useEffect(() => {
    if (playing) {
      console.log('Video is playing');
    } else {
      console.log('Video is paused');
    }
  }, [playing]);

  const fetchUploads = async () => {
    try {
      const params = {
        Bucket: 'rifraf.site',
        Key: `users/${profile}/uploads.json`,
      };
      const command = new GetObjectCommand(params);
      const data = await s3Client.send(command);
      return JSON.parse(await streamToString(data.Body));
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  const fetchAll = async () => {
    try {
      const params = {
        Bucket: 'rifraf.site',
        Key: 'posts.json',
      };
      const command = new GetObjectCommand(params);
      const data = await s3Client.send(command);
      return JSON.parse(await streamToString(data.Body));
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPlaying(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const fileURL = URL.createObjectURL(selectedFile);
    const uploadData = {
      User: profile,
      Link: fileURL,
      Elink: link,
      Title: uploadName,
      Tags: tags,
      About: about,
      Thumbnail: uploadName,
      Likes: 0,
      Liked: false,
      Comments: []
    };

    const userUploads = await fetchUploads();
    const allUploads = await fetchAll();
    userUploads.push(uploadData);
    allUploads.push(uploadData);

    try {
      await Promise.all([
        s3Client.send(new PutObjectCommand({
          Bucket: 'rifraf.site',
          Key: `users/${profile}/uploads.json`,
          Body: JSON.stringify(userUploads),
          ContentType: 'application/json'
        })),
        s3Client.send(new PutObjectCommand({
          Bucket: 'rifraf.site',
          Key: 'posts.json',
          Body: JSON.stringify(allUploads),
          ContentType: 'application/json'
        })),
        s3Client.send(new PutObjectCommand({
          Bucket: 'rifraf.site',
          Key: `${uploadName}`,
          Body: selectedFile,
          ContentType: selectedFile.type
        })),
      ]);

      alert('Upload Complete!');
    } catch (error) {
      console.error('Error Uploading:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const handleProgress = (state) => {
    if (state.playedSeconds >= 1) {
      setPlaying(false);
    }
  };

  const renderPreview = () => {
    if (!selectedFile) {
      console.log('No file selected');
      return null;
    }

    try {
      const fileURL = URL.createObjectURL(selectedFile);
      if (selectedFile.type.startsWith('video')) {
        return (
          <Player
            url={fileURL}
            playing={playing}
            volume={volume}
            onProgress={handleProgress}
            onEnded={() => setPlaying(false)}
            width='100%'
            height='100%'
            controls
            loop={false}
          />
        );
      } else if (selectedFile.type.startsWith('image')) {
        return <img src={fileURL} alt="Selected" style={{ height: '100%' }} />;
      }
    } catch (error) {
      console.error('Error creating object URL:', error);
      return null;
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
    <div style={{ position: 'fixed', top: '0px', bottom: '35px', left: '0px', right: '0px', backgroundColor: 'white', color: 'rgb(30,30,30)', zIndex: '6' }}>
      <h4 style={{ margin: '15px', marginTop: '10px' }}>Make Some Content</h4>
      <input
        type="file"
        accept="image/*,video/*,video/x-matroska"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="upload-file-input"
      />
      <label
        htmlFor="upload-file-input"
        className='btn1'
        style={{ top: '50px', left: '5px', right: '5px', backgroundColor: 'rgb(255, 255, 255)', color: 'rgb(30,30,30)' }}
      >
        Upload Photo/Video
      </label>
      <button
        onClick={()=>setShowCreate(!showCreate)}
        className='btn1'
        style={{ top: '80px', left: '5px', right: '5px' }}
      >
        Create Post
      </button>
      {showCreate && (
        <div style={{ 
          position: 'fixed', 
          top: '115px', 
          left: '5px', 
          right: '5px', 
          fontSize: '14px', 
          padding: '8px',
          zIndex: '8',
          border: 'solid 1px rgb(180,180,180)',
          paddingBottom: '40px',
          backgroundColor: 'white'
        }}>
          <label>
            Title:
            <input 
              value={uploadName} onChange={(e) => setUploadName(e.target.value)}
              style={{ marginLeft: '10px', padding: '4px', borderRadius: '4px', border: 'solid 1px rgb(180,180,180)' }}
            />
          </label>
          <div className='spacer'/>
          <label>
            Tags:
            <input 
              value={tags} onChange={(e) => setTags(e.target.value)}
              style={{ marginLeft: '7px', padding: '4px', borderRadius: '4px', border: 'solid 1px rgb(180,180,180)' }}
            />
          </label>
          <div className='spacer'/>
          <label>
            Link:
            <input 
              value={link} onChange={(e) => setLink(e.target.value)}
              style={{ marginLeft: '11px', padding: '4px', borderRadius: '4px', border: 'solid 1px rgb(180,180,180)' }}
            />
          </label>
          <div className='spacer'/>
          <label>
            About:
            <div className='spacer'/>
            <textarea 
              value={about} onChange={(e) => setAbout(e.target.value)}
              style={{ minWidth: '97%', maxWidth: '97%', maxHeight: '100px', padding: '4px', borderRadius: '4px', border: 'solid 1px rgb(180,180,180)' }}
            />
          </label>
          <div className='spacer'/>
          <label
            className='btn1'
            style={{ left: '10px', width: '40%', backgroundColor: 'rgb(255, 255, 255)', color: 'rgb(30,30,30)' }}
          >
            Select Thumbnail
          </label>
          <button className='btn1' style={{ right: '10px', width: '40%', backgroundColor: 'rgb(255, 255, 255)', color: 'rgb(30,30,30)' }} onClick={handleUpload}>
            Post to Feed
          </button>
        </div>
      )}
      <div style={{ position: 'fixed', top: '150px', bottom: '50px', left: '5px', right: '5px', textAlign: 'center' }}>
        {renderPreview()}
      </div>
    </div>
  );
};

export default Upload;
