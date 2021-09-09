import { Avatar, IconButton } from '@material-ui/core';
import { Chat, DonutLarge, MoreVert, SearchOutlined } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import "./Sidebar.css";
import logo from "./logo.svg"
import SidebarChat from './SidebarChat';
import axios from './axios';
import Pusher from "pusher-js";

const pusher = new Pusher('d0e96771c525c0ffd068', {
    cluster: 'ap2'
});

function Sidebar() {
    const [channels, setChannels] = useState([])

    const getChannelList = () => {
        axios.get("/get/channelList").then((res) => {
            setChannels(res.data)
        })
    }
    useEffect(() => {
        getChannelList();

        const channel = pusher.subscribe("channels");
        channel.bind("newChannel", function(data) {
            getChannelList();
        })
    }, [])

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={logo} />
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLarge />
                    </IconButton>
                    <IconButton>
                        <Chat />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder="Search or start new 
                    chat" type="text" />
                </div>
            </div>
            <div className="sidebar__chats">
                <SidebarChat addNewChat />
                {channels.map((channel) => (
                    <SidebarChat title={channel.name} id={channel.id} />
                ))}
            </div>
        </div>
    );
}

export default Sidebar;
