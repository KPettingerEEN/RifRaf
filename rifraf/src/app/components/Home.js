import React, { useState, useEffect } from 'react';
import Player from 'react-player';
import './App.css';
import { PiCoins } from "react-icons/pi";
import { 
  RiHeart3Line,
  RiHeart3Fill,
  RiAccountCircleFill,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiArrowLeftDoubleLine,
  RiArrowRightWideLine
} from "react-icons/ri";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';

const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: fromEnv()
});

const Home = () => {
  const [video, setVideo] = useState({});
  const [videoLink, setVideoLink] = useState(null);
  const [vidIndex, setVidIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [showComments, setShowComments] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);

  useEffect(() => {
    fetchInitialPosts();
  }, []);

  useEffect(() => {
    if (video && video.Title) {
      fetchCurrentVideo();
    }
  }, [video]);

  const fetchInitialPosts = async () => {
    try {
      const params = {
        Bucket: 'rifraf.site',
        Key: 'posts.json',
      };
      const command = new GetObjectCommand(params);
      const data = await s3Client.send(command);
      const jsonData = await streamToString(data.Body);
      const shuffledVideos = JSON.parse(jsonData).sort(() => 0.5 - Math.random());
      setVideos(shuffledVideos || []);
      setVideo(shuffledVideos[0]);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const fetchCurrentVideo = async () => {
    try {
      const params = {
        Bucket: 'rifrafvidsafe',
        Key: `${video.Title}`,
      };
      const command = new GetObjectCommand(params);
      const data = await s3Client.send(command);
      setVideoLink(URL.createObjectURL(new Blob([data.Body])));
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  const handleVideoChange = (direction) => {
    const newIndex = (vidIndex + direction + videos.length) % videos.length;
    setVidIndex(newIndex);
    setVideo(videos[newIndex]);
  };

  const handleProgress = (state) => {
    setPlayedSeconds(state.playedSeconds);
  };

  const handleLike = () => {
    const updatedVideo = { ...video, Likes: video.Likes + 1, Liked: true };
    const updatedVideos = videos.map((vid) =>
      vid.Name === video.Name ? updatedVideo : vid
    );
    setVideo(updatedVideo);
    setVideos(updatedVideos);
  };

  const handleCommentLike = (commentIndex) => {
    const updatedComments = video.Comments.map((comment, index) => {
      if (index === commentIndex) {
        return { ...comment, Likes: comment.Likes + 1, Liked: true };
      }
      return comment;
    });
    setVideo({ ...video, Comments: updatedComments });
  };

  const handleSubcommentLike = (commentIndex, subcommentIndex) => {
    const updatedComments = video.Comments.map((comment, index) => {
      if (index === commentIndex) {
        const updatedSubcoms = comment.Subcoms.map((subcom, subIndex) => {
          if (subIndex === subcommentIndex) {
            return { ...subcom, Likes: subcom.Likes + 1, Liked: true };
          }
          return subcom;
        });
        return { ...comment, Subcoms: updatedSubcoms };
      }
      return comment;
    });
    setVideo({ ...video, Comments: updatedComments });
  };

  const openComments = () => {
    setShowComments(!showComments);
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
    <div>
      <div className='player'>
        <Player url={video.Link} playing={playing} volume={volume} onProgress={handleProgress} width='100%' height='100%' controls />
      </div>
      <div>
        <RiAccountCircleFill className='fixed-icon' style={{ top: '10px', left: '10px' }} size={30} />
        <PiCoins className='fixed-icon' style={{ top: '10px', left: '55px' }} size={17} onClick={openComments}/>
        {video.Liked ? (
          <RiHeart3Fill className='fixed-icon' style={{ top: '10px', left: '90px' }} size={17} />
        ) : (
          <RiHeart3Line className='fixed-icon' style={{ top: '10px', left: '90px' }} size={17} onClick={handleLike} />
        )}
        <label style={{ position: 'fixed', top: '30px', left: '80px', width: '38px', zIndex: '3', textAlign: 'center', fontSize: '12px' }} >
          {video.Likes}
        </label>
        <RiArrowUpSLine className='fixed-icon' style={{ top: '10px', right: '10px' }} size={25} onClick={() => handleVideoChange(-1)} />
        <RiArrowDownSLine className='fixed-icon' style={{ top: '40px', right: '10px' }} size={25} onClick={() => handleVideoChange(1)} />
      </div>
      {showComments && (
        <div className="comments-section">
          <div className="comments-header">
            <button onClick={openComments} style={{marginTop: '-3px', marginLeft: '-5px'}}>
              <RiArrowLeftDoubleLine size={25} />
            </button>
            <h5>2-Cents</h5>
          </div>
          {video.Comments.map((comment, commentIndex) => (
            <div key={commentIndex} className="comment">
              <label>{comment.User}</label>
              <p>{comment.Comment}</p>
              <div>
                {comment.Liked ? (
                  <RiHeart3Fill size={15} style={{ marginRight: '5px' }} />
                ) : (
                  <RiHeart3Line size={15} style={{ marginRight: '5px' }} onClick={() => handleCommentLike(commentIndex)} />
                )}
                <span style={{ float: 'right' }}>{comment.Likes}</span>
              </div>
              {comment.Subcoms.map((subcom, subIndex) => (
                <div key={subIndex} className="subcomment">
                  <label>{subcom.User}</label>
                  <p>{subcom.Comment}</p>
                  <div>
                    {subcom.Liked ? (
                      <RiHeart3Fill size={13} style={{ marginRight: '5px' }} />
                    ) : (
                      <RiHeart3Line size={13} style={{ marginRight: '5px' }} onClick={() => handleSubcommentLike(commentIndex, subIndex)} />
                    )}
                    <span style={{ float: 'right' }}>{subcom.Likes}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <textarea
            style={{
              position: 'fixed', left: '5px', right: '45px', bottom: '5px', minHeight: '50px', maxHeight: '50px',
              backgroundColor: 'rgb(239, 239, 239)', borderColor: 'white', borderRadius: '4px', padding: '6px', 
              fontFamily: 'sans-serif'
            }}
          />
          <button
            style={{
              position: 'fixed', bottom: '5px', right: '3px', width: '40px', height: '64px', backgroundColor: 'rgb(80, 70, 190)',
              border: 'solid 1px white', borderRadius: '4px'
            }}
          >
            <RiArrowRightWideLine size={25} style={{ color: 'white' }} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
