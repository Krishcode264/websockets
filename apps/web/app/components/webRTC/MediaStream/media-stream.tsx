import React from "react";
import { User } from "core";

import "./mediaStream.css";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import { AudioComponent,VideoComponent } from "./media-stream-component";


interface ToggleButtonsProps {
  state: boolean;
  Icon: React.FC;
  OppoIcon: React.FC;
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
        {state && <Icon  />}
        {!state && <OppoIcon />}
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
  peerConnection?: RTCPeerConnection|null; // Replace with the appropriate type
  peerConnectionStatus?: string; // Replace with the appropriate type
}
const MediaStream: React.FC<MediaStreamProps> = ({
  // persontoHandshake,
  // peerConnection,
  mediaStreamAll,
  video,audio,
  toggleTracks,
  // peerConnectionStatus,
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
          {mediaStreamAll && audio && !video && (
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
