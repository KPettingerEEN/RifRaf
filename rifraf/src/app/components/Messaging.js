import React, { useState, useEffect } from 'react';
import { SlOptionsVertical } from "react-icons/sl";
import { RiSearchLine, RiArrowRightWideLine, RiArrowLeftDoubleLine, RiAccountCircleLine } from "react-icons/ri";
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';

const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: fromEnv()
});

const MessageBubble = ({ text, float, color }) => (
  <div style={{
    width: '90%', float: float, padding: '10px', margin: '5px 0', position: 'relative', color: 'rgb(30, 30, 30)',
    backgroundColor: color, borderRadius: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', wordWrap: 'break-word'
  }}>
    <div style={{
      position: 'absolute', top: '-10px', left: float === 'left' ? '-20px' : 'auto', right: float === 'right' ? '-20px' : 'auto',
      fontSize: '30px', color: color
    }} />
    {text}
  </div>
);

const Messaging = () => {
  const [friends, setFriends] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState({ To: '', From: '', Time: '', Message: '' });
  const [chatOpen, setChatOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className='page'>
      <div 
        style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: '4', paddingBottom: '5px' }}>
        <RiSearchLine className='fixed-icon-2' style={{ position: 'fixed', top: '15px' }} size={25}/>
        <input
          style={{ 
            position: 'absolute', left: '40px', right: '20px', backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgb(200, 200, 200)',
            borderRadius: '4px', padding: '8px', color: 'white'
          }}
          placeholder='Search Messages'
        />
      </div>
      <div 
        onClick={() => {setChatOpen(true)}}
        style={{
          position: 'absolute', top: '60px', left: '0px', right: '0px', padding: '8px', cursor: 'pointer',
          zIndex: '3', backgroundColor: 'rgb(200, 200, 200)', color: 'rgb(30,30,30)'
        }}
      >
        <div style={{ float: 'left', zIndex: '4' }}>
          <RiAccountCircleLine size={30} />
        </div>
        <h5 style={{ margin: '0px', marginLeft: '35px' }}>JackieChanTheMan</h5>
        <label style={{fontSize: '10px', marginLeft: '10px' }}>A friend sent something.</label>
        <div style={{ marginTop: '-5px', float: 'right', zIndex: '4' }} onClick={() => setShowOptions(!showOptions)}>
          <SlOptionsVertical size={20}/>
        </div>
      </div>
      {chatOpen && (
        <div
          style={{
            position: 'fixed', top: '0px', left: '0px', right: '0px', bottom: '35px', backgroundColor: 'rgb(30, 30, 30)',
            zIndex: '5'
          }}
        >
          <button
            onClick={() => {setChatOpen(false)}}
            style={{
              position: 'fixed', top: '2px', left: '0px', backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(0,0,0,0)',
              color: 'rgb(30,30,30)', fontWeight: 'bold', zIndex: '6'
            }}
          >
            <RiArrowLeftDoubleLine size={30} style={{ color: 'rgb(255, 255, 255)'}} />
          </button>
          <label 
            style={{
              position: 'fixed', top: '12px', left: '50px', backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(0,0,0,0)',
              color: 'rgb(255, 255, 255)', fontWeight: 'bold', zIndex: '6', textDecoration: 'underline'
            }}
          >
            JackieChanTheMan
          </label>
          <div
            style={{
              position: 'fixed', top: '40px', left: '5px', right: '5px', zIndex: '3'
            }}
          >
            <MessageBubble text="Yo!" float="left" color="rgb(118, 255, 113)" />
            <MessageBubble text="What's good bro?" float="right" color="rgba(133, 115, 252, 0.68)" />
          </div>
          <textarea
            style={{
              position: 'fixed', left: '5px', right: '45px', bottom: '40px', minHeight: '60px', maxHeight: '60px',
              backgroundColor: 'rgb(200, 200, 200)', borderColor: 'white', borderRadius: '4px', padding: '6px', 
              fontFamily: 'sans-serif'
            }}
          />
          <button
            style={{
              position: 'fixed', bottom: '40px', right: '3px', width: '40px', height: '74px', backgroundColor: 'rgb(80, 70, 190)',
              border: 'solid 1px white', borderRadius: '4px'
            }}
          >
            <RiArrowRightWideLine size={25} style={{ color: 'white' }} />
          </button>
        </div>
      )}
    </div>
  )
}

export default Messaging;