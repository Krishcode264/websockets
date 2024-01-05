"use client"
import React from 'react'
import { useState } from 'react'
import Link from 'next/link';
import './chat.css'
import AddCircleIcon from "@mui/icons-material/AddCircle";

interface ChatRoomTemplateprops{
    id:string,
    title:string,
    description:string,
    audience:string[]
}
const ChatRoomTemplate = ({id,title,description,audience}:ChatRoomTemplateprops) => {
const [hovered,setHovered]=useState(false)
    const generateAudiance=()=>{
        return(
            audience.map((type)=>{
                return(
              <div  key={type}>{type}</div>
                )
            })
        )
    }

const handleHover=()=>{
setHovered((prev)=>!prev)
}

  return (
    <div
      className=" char_room_wrapper"
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
    >
      {hovered && (
        <Link href={`/chat-room/id=${id}`}>
          <div className="enter_button">
            <AddCircleIcon sx={{ fontSize: 40 }} />
          </div>
        </Link>
      )}
      <h2>{title}</h2>
      <section>
   
        <h4>{description}</h4>
      </section>
      <div className="audiance_type">{generateAudiance()}</div>
    </div>
  );
}

export default ChatRoomTemplate