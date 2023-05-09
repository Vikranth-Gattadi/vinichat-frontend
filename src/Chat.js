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
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function Chat({ snackOpen, mobile, useryo, ImgUrl, chat_data, index }) {
  // console.log(index);
  const [newMsg, setNewMsg] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [emojiOption, setEmojiOption] = useState("message");
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
    const message = newMsg;
    if (message === "") {
      return
    }
    setShowEmojis(false);
    setNewMsg("");
    const req = {
      "mobile": mobile,
      "chat_mobile": chat_data.chat_mobile,
      "message_data": {
        "message": message,
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
        "message": message,
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
    chat_data.messages = chat_data.messages.concat(req.message_data)
    // console.log(chat_data.messages); 
  };

  async function markasread() {
    const req = {
      "mobile": mobile,
      "chat_mobile": chat_data.chat_mobile,
    }
    try {
      const res = await axios.put("/vinichat/markasread", req);
      if (res.status !== 202) {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  }
  const bottomRef = useRef(null);
  useEffect(() => {
    if (index !== -1) {
      markasread();
    }
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView();
  }, [index === -1 ? "" : chat_data.messages]);

  function closeChatHandler() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width <= 900) {
      let ele = document.getElementsByClassName("sidebar_body")
      if (ele[0].style !== undefined) {
        ele[0].style.display = "block";
      }
      let ele1 = document.getElementsByClassName("chat")
      if (ele1[0].style !== undefined) {
        ele1[0].style.display = "none";
      }
    }
  }
  const escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const emojiMap = {
    ':) ': '😊',
    ':( ': '🙁',
    ':D ': '😁',
    ';( ': '😥',
    ':O ': '😮',
    ';) ': '😉',
    '8) ': '😎',
    '>:@ ': '😡',
  };
  const replaceStringWithEmoji = (string) => {
    const pattern = new RegExp(
      Object.keys(emojiMap).map(escape).join('|'),
      'g'
    );
    return string.replace(pattern, (m) => emojiMap[m] || m)
  };
  const messageSetting = (msg) => {
    setNewMsg(replaceStringWithEmoji(msg))
  }
  const addEmoji = (key) => {
    setNewMsg(newMsg + emojiMap[key])
  }
  return (
    <div className={(snackOpen === true) ? "chat_yo" : "chat"}>
      {index === -1 ? (<div className='chat_empty'>
        Vini Chatting Starts Here
      </div>
      ) : (< >
        <div className="chat_header">
          <IconButton onClick={closeChatHandler}>
            <div className="arrow_back">
              <ArrowBackIosNewIcon /></div>
            <Avatar src={chat_data.ImgUrl} />
          </IconButton>
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
                  {/* <span className='chat_name'>{useryo}</span> */}
                  {message.message}
                  <span className='time_stamp'>{message.time}</span>
                </p>
                </>) : (<><p className='message '>
                  {/* <span className='chat_name'>{chat_data.chat_name}</span> */}
                  {message.message}
                  <span className='time_stamp'>{message.time}</span>
                </p>
                </>)
                }
              </>
            ))}
            <div ref={bottomRef} />
          </div>
          {showEmojis && (
            <div className='emoji_picker'>
              <table width={"100%"} >
                <tr>
                  <th style={{ "color": "black", "font-size": "12px", "textDecoration": "underline" }} width={"50%"} className="btn_emoji_option" onClick={() => setEmojiOption("message")}>Message</th>
                  <th style={{ "color": "black", "font-size": "12px", "textDecoration": "underline" }} className="btn_emoji_option" onClick={() => setEmojiOption("emoji")}>Emoji</th>
                </tr>
                {emojiOption === "message" && (
                  <>
                    <tr><td style={{ "color": "black", "font-size": "12px", "textAlign": "justify" }} colSpan={"2"}>Type the Message to get respective emojis </td>
                    </tr>
                    <tr>
                      <th style={{ "color": "black", "font-size": "12px", "textDecoration": "underline" }} >Message</th>
                      <th style={{ "color": "black", "font-size": "12px", "textDecoration": "underline" }}>Emoji</th>
                    </tr>
                    {Object.keys(emojiMap).map((key, index) => (
                      <tr>
                        <th style={{ "color": "black", "font-size": "12px" }}>{key}</th>
                        <th>{emojiMap[key]} </th>
                      </tr>
                    ))}
                  </>
                )}
                {emojiOption === "emoji" && (
                  <>
                    <tr><td style={{ "color": "black", "font-size": "12px", "textAlign": "justify" }} colSpan={"2"}>Click on the emoji </td>
                    </tr>
                    {Object.keys(emojiMap).map((key, index) => (
                      (index % 2 === 0) && (
                        <tr>
                          <th onClick={() => addEmoji(key)} className="th_emoji"> {emojiMap[key]} </th>
                          <th onClick={() => addEmoji(Object.keys(emojiMap)[index + 1])} className="th_emoji">{emojiMap[Object.keys(emojiMap)[index + 1]]}</th>
                        </tr>
                      )
                    ))}
                  </>
                )}
              </table>
            </div>
          )}

          <div className="chat_footer">
            <IconButton onClick={() => setShowEmojis(!showEmojis)}>
              <SentimentSatisfiedAltIcon />
            </IconButton>
            <form onSubmit={handleSubmit} >
              <input type="text" value={newMsg} onChange={event => messageSetting(event.target.value)}
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
