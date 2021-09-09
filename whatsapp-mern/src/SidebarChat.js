import { Avatar } from '@material-ui/core';
import axios from './axios';
import React from 'react';
import "./SidebarChat.css";
import { useHistory } from "react-router-dom";

function SidebarChat({ id, addNewChat, title }) {
    const history = useHistory();

    const selectChannel = () => {
        if (id) {
            history.push(`/rooms/${id}`);
        } else {
            history.push(title);
        }
    }

    const createChat = () => {
        const roomName = prompt("Please Enter The Name For the Chat");

        if (roomName) {
            axios.post("/new/channel", {
                channelName: roomName
            })  
        }
        
    }

    return!addNewChat ? (
        <div className="sidebarChat" onClick={selectChannel}>
            <Avatar />
            <div className="sidebarChat__info">
                <h2>{title}</h2>
                <p>This is the last Message</p>
            </div>
        </div>
    ) : (
        <div className="sidebarChat" onClick={createChat}>
            <h2>Add New Chat</h2>
        </div>
    );
}

export default SidebarChat;
