import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import "./Chat.css";
import axios from "./axios";
import { useParams } from 'react-router';
import Pusher from "pusher-js";

const pusher = new Pusher('d0e96771c525c0ffd068', {
    cluster: 'ap2'
});

function Chat() {
    const [input, setInput] = useState("");
    const [roomDetails, setRoomDetails] = useState(null)
    const [roomMessages, setRoomMessages] = useState([])
    const { roomId } = useParams();

    const getConvo = () => {
        axios.get(`/get/conversation?id=${roomId}`).then((res) => {
            setRoomDetails(res.data[0]?.channelName);
            setRoomMessages(res.data[0]?.conversation);
        })
    }

    useEffect(() => {
        if (roomId) {
            getConvo();

            const channel = pusher.subscribe('conversations');
            channel.bind('newMessage', function(data) {
                alert(JSON.stringify(data));
                getConvo();
            });
        }
    }, []);

    const sendMessage = () => {
        if (roomId) {
            axios.post(`/new/message?id=${roomId}`, {
                name: 'Vijay B Nath',
                message: input,
                timestamp: Date.now(),
                received: false
            });
            setInput("");
        }
    }

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar />  

                <div className="chat__headerInfo">
                    <h3>{roomDetails}</h3>
                    <p>Last seen at...</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">
                {roomMessages?.map((message) => (
                    <p className={`chat__message ${message.received && "chat__reciever"}`}>
                    <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">
                            {message.timestamp}
                        </span>
                    </p>
                ))}
                

                {/* <p className={`chat__message ${message.received && "chat__reciever"}`}>
                    <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">
                            {message.timestamp}
                        </span>
                    </p> */}
            </div>

            <div className="chat__footer">
                <InsertEmoticon />
                <form>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type A Message"
                        type="text"
                    />
                    <button type="submit" onClick={sendMessage}>
                        Send a message
                    </button>
                </form>
                <Mic />
            </div>
        </div>
    );
}

export default Chat;
