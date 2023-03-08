import React, { useEffect, useRef, useState } from 'react';
import "./Chat.css";
import Avatar from '@mui/material/Avatar';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { IconButton } from '@mui/material';
import VideoChatIcon from '@mui/icons-material/VideoChat';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import MicNoneIcon from '@mui/icons-material/MicNone';
import axios from './axios';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function Chat({ mobile, useryo, ImgUrl, chat_data, index }) {
  // console.log(index);
  const [newMsg, setNewMsg] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const date = new Date();
    let nowTime = "";
    if (date.getHours() < 10) {
      nowTime = "0" + date.getHours();
    } else {
      nowTime = date.getHours() + ":";
    }
    if (date.getMinutes() < 10) {
      nowTime += "0";
    }
    nowTime += date.getMinutes();

    const req = {
      "mobile": mobile,
      "chat_mobile": chat_data.chat_mobile,
      "message_data": {
        "message": newMsg,
        "type": "sent",
        "time": nowTime
      }
    }
    try {
      const res = await axios.put("/vinichat/addmessage", req);
      if (res.status !== 200) {
        console.log(res);
      }
    } catch (Err) {
      alert("Got error at sender side, try again");
    }
    const req1 = {
      "mobile": chat_data.chat_mobile,
      "chat_mobile": mobile,
      "chat_name": useryo,
      "ImgUrl": ImgUrl,
      "message_data": {
        "message": newMsg,
        "type": "",
        "time": nowTime
      }
    }

    try {
      const res1 = await axios.put("/vinichat/addmessage", req1);
      if (res1.status !== 200) {
        console.log(res1);
      }
    } catch (Err) {
      alert("Got error at reciever side, try again");
    }
    // chat_data.messages = chat_data.messages.concat({ 'message': newMsg, type: "sent", "time": nowTime })
    setNewMsg("");
    // console.log(chat_data.messages); 
  };

  const bottomRef = useRef(null);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView();
  }, [index === -1 ? "" : chat_data.messages]);

  function closeChatHandler() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (width < 900) {
      var element = document.getElementsByClassName('sidebar_body')
      if (element[0].style !== undefined) {
        element[0].style.display = "block";
      }
      var element2 = document.getElementsByClassName('chat')
      if (element2[0].style !== undefined) {
        element2[0].style.display = "none";
      }
    }
  }
  return (
    <div className='chat'>
      {index === -1 ? (<div className='chat_empty'>
        Vini Chatting Starts Here
      </div>
      ) : (< >
        <div className="chat_header">
          <IconButton style={{marginRight:"-60px",position:"sticky"}} className='back_arrow' onClick={closeChatHandler}>
            <ArrowBackIosIcon />
          </IconButton>
          <Avatar src={chat_data.ImgUrl} />
          <h4>{chat_data.chat_name}</h4>
          <div className='chat_header_right'>
            <IconButton>
              <LocalPhoneIcon />
            </IconButton>
            <IconButton>
              <VideoChatIcon />
            </IconButton>
            <IconButton >
              <ExpandMoreIcon fontSize='small' />
            </IconButton>
          </div>
        </div>
        <div className="chat_body">
          <div className="chat_messages" style={{ "backgroundImage": 'url(' + chat_data.backGroundImg + ')' }}>
            {/* <div className='encrpt_msg'>
            end-end Encryption
          </div> */}
            {chat_data.messages.map((message) => (
              <>
                {message.type === "sent" ? (<><p className='message sent '>
                  <span className='chat_name'>{useryo}</span>
                  {message.message}
                  <span className='time_stamp'>{message.time}</span>
                </p>
                </>) : (<><p className='message '>
                  <span className='chat_name'>{chat_data.chat_name}</span>
                  {message.message}
                  <span className='time_stamp'>{message.time}</span>
                </p>
                </>)
                }
              </>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="chat_footer">
            <IconButton>
              <SentimentSatisfiedAltIcon />
            </IconButton>
            <form onSubmit={handleSubmit} >
              <input type="text" value={newMsg} onChange={event => setNewMsg(event.target.value)}
                name='new_msg' placeholder='Type your message' />
              <input type="submit" style={{ "display": "none" }} />
            </form>
            <IconButton>
              <MicNoneIcon />
            </IconButton>
          </div>
        </div>
      </>)
      }
    </div >
  )
}
