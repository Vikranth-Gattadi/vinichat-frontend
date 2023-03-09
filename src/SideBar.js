import React, { useEffect, useState } from 'react';
import "./SideBar.css";
import Chat from './Chat';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "./axios.js";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Spinner from "./images/spinner-removebg-preview.png";
import Cookies from 'js-cookie';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 2s infinite',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(1)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(3)',
            opacity: 0,
        },
    },
}));
function SideBar({ mobile, user, ImgUrl, chats }) {
    const [yoIndex, setYoIndex] = useState(-1);
    const [options, setOptions] = useState(false);
    const [optionSelected, setOptionSelected] = useState(false);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imgurl, setImgurl] = useState("");
    const [orgImgUrl, setOrgImgUrl] = useState(ImgUrl);
    const [chatsTemp, setChatsTemp] = useState(chats);
    const [refreshInterval, setRefreshInterval] = useState(2000 || 0);
    const [addChatOpen, setAddChatOpen] = useState(false);
    const [searchMobile, setSearchMobile] = useState("");
    const [searchedData, setSearchedData] = useState("");
    const [newChatName, setChatName] = useState("");

    async function handleSearchChat() {
        if (searchMobile === mobile) {
            alert("You are searching Your Mobile")
        } else {
            const found = chatsTemp.find(obj => {
                return obj.chat_mobile === searchMobile;
            })
            if (found) {
                alert("User is already in your chat!")
            } else {
                const data = {
                    mobile: searchMobile
                }
                try {
                    const res = await axios.post("/vinichat/finduser", data);
                    if (res.status !== 500) {
                        // console.log(res.data)
                        if (res.data.code === "404") {
                            alert(res.data.data);
                        } else {
                            setSearchedData(res.data);
                            setChatName(res.data.user);
                            setSearchMobile("");
                            setOpen(false);
                            setAddChatOpen(true);
                        }
                    }
                } catch (err) {
                    alert("Error in finding user, try again")
                }
            }
        }
    }
    async function handleAddChat() {
        const data = {
            mobile,
            details: {
                chat_name: newChatName,
                chat_mobile: searchedData.mobile,
                ImgUrl: searchedData.ImgUrl,
                backGroundImg: "https://t4.ftcdn.net/jpg/03/87/75/31/360_F_387753109_0xjbgmibs2VrN34VrNYPMjVn883yB632.jpg",
            }
        }
        try {
            const res = await axios.post("/vinichat/addchat", data)
            if (res.status === 200) {
                // setChatsTemp(chatsTemp.concat(data.details));
                alert("added successfully");
                setAddChatOpen(false);
            } else {
                alert("something went wrong try again");
            }
        } catch (err) {
            alert("something went wrong try again");
        }
    }
    const handleClose = () => {
        setOpen(false);
        setAddChatOpen(false);
    };

    function handleOptions() {
        if (options) {
            setOptions(false);
            setOptionSelected(false);
        } else {
            setOptions(true);
            setYoIndex(-1);
        }
    }
    async function handleImageChange(event) {
        setIsLoading(true);
        event.preventDefault();
        const data = {
            mobile,
            user,
            imgurl
        }
        try {
            const res = await axios.post("/vinichat/changeimage", data);
            if (res.status === 202) {
                alert("changed successfully");
                setOptionSelected(false);
                setOrgImgUrl(imgurl);
                setImgurl("");
                setIsLoading(false);
            }
            else {
                console.log(res);
            }
        } catch (e) {
            alert("something went wrong try again");
        }
    }
    const handleClickOpen = () => {
        // console.log(open);
        setOpen(true);
    };
    function logout(){
        window.localStorage.clear();
        Cookies.remove("viniUser");
        window.location.href = "/";
    }
    function openChatHandler(index){
        setYoIndex(index);
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if(width<=900){
            let ele = document.getElementsByClassName("sidebar_body")
            if(ele[0].style!== undefined){
                ele[0].style.display="none";
            }
            let ele1 = document.getElementsByClassName("chat")
            if(ele1[0].style!== undefined){
                ele1[0].style.display="block";
            }
        }
    }

    async function fetchChats() {
        const req = {
            searchUser: true,
            mobile
        }
        try {
            const res = await axios.post("/vinichat/finduser", req)
            if (res.status !== 200) {
                console.log(res);
            } else {
                setOrgImgUrl(res.data.ImgUrl);
                setChatsTemp(res.data.chats);
            }
        } catch (err) {
            alert("something went wrong try again");
        }
    }
    useEffect(() => {
        if (refreshInterval && refreshInterval > 0) {
            const interval = setInterval(fetchChats, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [refreshInterval]);
    // console.log(yoIndex);
    return (<>
        <div className='sidebar_body'>
            <div className="sidebar_header">
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot">
                    <Avatar
                        src={orgImgUrl} />
                </StyledBadge>
                <div className="sidebar_header_icons">
                    <IconButton onClick={handleClickOpen}>
                        <ChatBubbleIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOptions()} >
                        <ExpandMoreIcon fontSize='small' />
                    </IconButton>
                </div>
            </div>
            {!options ? (
                <div className="sidebar_chats">
                    {chatsTemp.map((chat, index) => (<>
                        {yoIndex === index ? (
                            <div className="sidebar_chat selected" onClick={() => openChatHandler(index)}  >
                                <Avatar src={chat.ImgUrl} />
                                <div className="sidebbar_chat_desc" >
                                    <h5>{chat.chat_name}</h5>
                                </div>
                            </div>
                        ) : (<div className="sidebar_chat" onClick={() => openChatHandler(index)}  >
                            <Avatar src={chat.ImgUrl} />
                            <div className="sidebbar_chat_desc" >
                                <h5>{chat.chat_name}</h5>
                            </div>
                        </div>)}
                    </>))}
                </div>)
                : (<div className="sidebar_chats"><br /><br />
                    <div className="sidebar_option" onClick={() => setOptionSelected(true)}>
                        Change Image
                    </div><br />
                    <div className="sidebar_option">
                        Change Password
                    </div><br />
                    <div className="sidebar_option" onClick={()=> logout()}>
                        Log Out
                    </div>

                </div>
                )}
        </div >
        {optionSelected ? (
            <div className='option_pannel'>
                <div className='image_change_pannel'>
                    <center>
                        <form onSubmit={handleImageChange}>
                            Image Url :
                            <input type="text" className='img_input' value={imgurl} onChange={(e) => { setImgurl(e.target.value) }} required />
                            <br /><br />
                            <Avatar src={imgurl} sx={{ height: '100px', width: '100px' }} /><br /><br />
                            <center>{isLoading ? (<button disabled><img className='spinner_img change_img' src={Spinner} alt="" /></button>) : (<button type="submit" className='btn' > Change Image</button>)}</center>
                        </form>
                    </center>
                </div>
            </div>)
            : (<Chat mobile={mobile} ImgUrl={orgImgUrl} chat_data={chatsTemp[yoIndex]} useryo={user} index={yoIndex} />
            )}
        <Dialog open={open} onClose={handleClose}>
            <div className='dialog-main' >
                <DialogTitle style={{ 'color': 'whitesmoke' }} >Add New Chat</DialogTitle>
                <DialogContent     >
                    <DialogContentText style={{ 'color': 'whitesmoke' }}>
                        Search User From Here
                    </DialogContentText>
                    < TextField
                        className='hola'
                        autoFocus
                        label="Mobile Number"
                        type="Number"
                        fullWidth
                        variant="standard" sx={{ input: { color: 'whitesmoke' } }}
                        value={searchMobile} onChange={(e) => setSearchMobile(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button style={{ 'color': 'whitesmoke' }} onClick={handleClose}>Cancel</Button>
                    <Button style={{ 'color': 'whitesmoke' }} onClick={handleSearchChat}>Search</Button>
                </DialogActions>
            </div>
        </Dialog>
        <Dialog open={addChatOpen} onClose={handleClose}>
            <div className='dialog-main' >
                <DialogTitle style={{ 'color': 'whitesmoke' }} >Add New Chat</DialogTitle>
                <DialogContent     >
                    <DialogContentText style={{ 'color': 'whitesmoke' }}>
                        Searched User
                    </DialogContentText>
                    <div className='searched_option'>
                        <div className='searched_left'>
                            <Avatar src={searchedData.ImgUrl} sx={{ height: '100px', width: '100px' }} />
                        </div>
                        <div className='searched_right'>
                            <input value={newChatName} onChange={(e) => setChatName(e.target.value)} type="text" style={{ fontSize: "15px" }} />
                            <input type="number" value={searchedData.mobile} disabled />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button style={{ 'color': 'whitesmoke' }} onClick={handleClose}>Cancel</Button>
                    <Button style={{ 'color': 'whitesmoke' }} onClick={handleAddChat}>Add Chat</Button>
                </DialogActions>
            </div>
        </Dialog>
    </>
    )
}

export default SideBar
