import React, { useState } from "react";
import "./MediaStream.css";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import { AudioComponent, VideoComponent } from "./media-stream-component";
import { useRecoilValue } from "recoil";
import { peerConnectionState } from "../../../store/selectors/pc-selector";
import { mediaStreamState } from "../../../store/atoms/media-stream-atom";
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
        {state && <Icon />}
        {!state && <OppoIcon />}
      </button>
    </>
  );
};
const MediaStream = () => {
  const peerConnection = useRecoilValue(peerConnectionState);
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);
  const { mediaStream } = useRecoilValue(mediaStreamState);

  const toggleTracks = (type: string) => {
    peerConnection?.getSenders().forEach((sender: RTCRtpSender) => {
      if (sender.track?.kind === type) {
        sender.track.enabled = !sender.track.enabled;
        type === "audio"
          ? setAudio((prev) => !prev)
          : setVideo((prev) => !prev);
      }
    });
  };
  return (
    <>
      <div className="media_stream_wrapper">
        <div className="video_audio">
          {mediaStream && <VideoComponent media={mediaStream} />}
          {/* {mediaStream && audio && !video && (
            <AudioComponent media={mediaStream} />
          )} */}
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
