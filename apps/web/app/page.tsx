"use client "
import { IconBtn } from "ui";
import React from 'react'
import './Front.css'
import Link from "next/link";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import logo from './images/logo.png'
import Image from "next/image";

const page = () => {

  return (
    <div>
      <header className="header_top_section">
        <span className="logo_">
          <Image src={logo} alt="logo" className="logo" />
          <h3>RealMeet</h3>
        </span>
        {/* <h1 className="head">welcome to world of real talks</h1> */}
        <Link href="/profile">
          <IconBtn
            icon={Person2RoundedIcon}
            br="20px"
            size={40}
            color="#22032de9"
          />
        </Link>
      </header>

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