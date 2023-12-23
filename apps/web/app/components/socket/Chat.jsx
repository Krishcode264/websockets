import React from 'react'
import ChatRoomtemplate from './ChatRoomTemplate'
import { v4 as uuidv4 } from 'uuid';
import './Chat.css'
import ChatRoomTemplate from './ChatRoomTemplate';

const Chat = () => {
const chatRooms = [
  {
    id: "01",
    title: "Tech Talk Zone",
    description: "Discuss the latest tech trends and innovations.",
    audience: ["Tech enthusiasts", "Software developers", "IT professionals"],
  },
  {
    id: "02",
    title: "Artistic Minds",
    description: "A space to share and critique various art forms.",
    audience: ["Artists", "Designers", "Art enthusiasts"],
  },
  {
    id: "03",
    title: "Bookworm Haven",
    description: "Engage in discussions about literature and favorite books.",
    audience: ["Book lovers", "Avid readers", "Literature enthusiasts"],
  },
  {
    id: "04",
    title: "Fitness Fanatics",
    description: "Share workout routines, diet tips, and fitness goals.",
    audience: ["Fitness enthusiasts", "Health-conscious individuals"],
  },
  {
    id: "05",
    title: "Travel Tales",
    description: "Exchange travel experiences and adventure stories.",
    audience: ["Travelers", "Wanderlust seekers", "Adventure enthusiasts"],
  },
];

const generateChatRooms=()=>{
  return(
    chatRooms.map((room)=>{
return (<ChatRoomTemplate key={room.id} id={room.id} title={room.title} description={room.description} audience={room.audience}/>)    })
  )
}

  return (
    <div>
      <h1>select room to enter:</h1>
      <main>{generateChatRooms()}</main>
    </div>
  );
}

export default Chat