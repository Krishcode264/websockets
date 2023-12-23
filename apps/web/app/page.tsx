

import React from 'react'
import './Front.css'
import Link from "next/link";
import Call from './components/webRTC/Call';

const page = () => {

  return (
    <div>
      <h1 className='head'>welcome to world of real talks</h1>
      <section className="rooms-wrapper">
        <div className="section video-room">
          <p>Here you can have one to one video call with connected people</p>
          <Link href="/video-room">
            <button className="enter-room-btn">Video call room</button>
          </Link>
        </div>
        <div className="section chat-room">
          <p>Here you can have conversation with joined community</p>

          <Link href="/chat-room">
            <button className="enter-room-btn">Open chat room</button>
          </Link>
        </div>
      </section>

    </div>
  );
}

export default page