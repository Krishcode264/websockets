import React, { useEffect, useState } from "react";


import "./mediaStream.css";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import { IconButton } from "@mui/material";
import { AudioComponent,VideoComponent } from "./MediaStreamComponent";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import { User } from "core";

interface ToggleButtonsProps {
  state: boolean;
  Icon: any;
  OppoIcon: any;
  toggleTracks: (type: string) => void;
  type: string;
}
const ToggleButtons: React.FC<ToggleButtonsProps> = ({
  state,
  Icon,
  OppoIcon,
  toggleTracks,
  type,
}) => {
  return (
    <>
      <button
        className="toggle_btns"
        onClick={() => {
          toggleTracks(type);
        }}
      >
        {state && <Icon sx={{ fontSize: 35, color: "blue" }} />}
        {state === false && <OppoIcon sx={{ fontSize: 35, color: "red" }} />}
      </button>
    </>
  );
};
interface MediaStreamProps {
  persontoHandshake: User|null;
  mediaStreamAll: MediaStream | null;
  video: boolean;
  toggleTracks:(n:string)=>void;
  audio: boolean;
  // Replace with the appropriate type
  peerConnection: any; // Replace with the appropriate type
  peerConnectionStatus: any; // Replace with the appropriate type
}
const MediaStream: React.FC<MediaStreamProps> = ({
  persontoHandshake,
  peerConnection,
  mediaStreamAll,
  video,audio,
  toggleTracks,
  peerConnectionStatus,
}) => {
    
    

  // useEffect(() => {
  //   getUserMediaStream();
  // }, [peerConnection]);
  // <button onClick={getUserMediaStream}>get ready for calll</button>;

  return (
    <>
      <div className="media_stream_wrapper">
       
        <div className="video_audio">
          {mediaStreamAll && video && <VideoComponent media={mediaStreamAll} />}
          {mediaStreamAll && audio && video === false && (
            <AudioComponent media={mediaStreamAll} />
          )}
        </div>
        <div className="toggle_btns_wrapper">
          <ToggleButtons
            state={video}
            Icon={VideocamIcon}
            OppoIcon={VideocamOffIcon}
            toggleTracks={toggleTracks}
            type="video"
          />
          <ToggleButtons
            state={audio}
            Icon={MicIcon}
            toggleTracks={toggleTracks}
            OppoIcon={MicOffIcon}
            type="audio"
          />
        </div>
      </div>
    </>
  );
};

export default MediaStream;
