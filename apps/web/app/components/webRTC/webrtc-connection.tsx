
import React, { useEffect } from "react";
import { useState } from "react";
import "./meet.css";
import './MediaStream/MediaStream.css'
import { User } from "core/types/types";
import MediaStream from "./MediaStream/media-stream";
import MediaStreamGuest from "./MediaStream/media-stream-guest";
import CameraIcon from "@mui/icons-material/Camera";
import MicIcon from "@mui/icons-material/Mic";
interface WebrtcConnectionProps {
  persontoHandshake: User | null;
  peerConnection: RTCPeerConnection|null;
  peerConnectionStatus: string|undefined;
};

const WebrtcConnection: React.FC<WebrtcConnectionProps> = ({
  persontoHandshake,
  peerConnection,
  peerConnectionStatus,
}) => {
  const [remoteStream, setRemoteStream] = useState<null | MediaStream>(null);
  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(false);
  const [mediaStreamAll, setMediaStreamAll] = useState<MediaStream | null>(
    null
  );
  const [tracksAdded, setTracksAdded] = useState(false);

  const toggleTracks = (type: string) => {
    peerConnection?.getSenders().forEach((sender: RTCRtpSender) => {
      if (sender.track?.kind === type) {
        sender.track.enabled = !sender.track.enabled;
        type === "audio"
          ? setAudio((prev) => !prev)
          : setVideo((prev) => !prev);
      }
      // console.log(peerConnection.getSenders(), "senderes");
    });
  };

  const setDefaultdisabledTracks = (stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      track.enabled = false;

      peerConnection?.addTrack(track, stream);
      setAudio(() => false);
      setVideo(() => false);
    });
    // console.log(peerConnection.getSenders());
    console.log("stream after track.enable=false ",stream.getTracks())
    setMediaStreamAll(() => stream);
  };

  const getUserMediaStream = () => {
    if (tracksAdded) {
      return; // Already added tracks
    }

    // console.log("getuser media runnig ");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setDefaultdisabledTracks(stream);
        setTracksAdded(() => true);
      })
      .catch((err) =>{
        // console.log(err)
        throw(err);
      } );
  };

  useEffect(() => {
    // console.log("peer status chn aged and webrtc componet render happen");

    if(peerConnection){
    peerConnection.ontrack = (e: RTCTrackEvent) => {
      const rm = e.streams[0];
      console.log("remote strem ontract event",rm)
      if (rm) {
        setRemoteStream(() => rm);
        // console.log(rm.getTracks(), "tracks from webrtc newly got");
      }
    };

    // return () => {
    //   peerConnection.ontrack = null;
    // };
    }

  }, [peerConnectionStatus, peerConnection]);

  return (
    <div className="webrtc_template max_mode">
      {tracksAdded ? (
        <div className="video_wrappers">
          <MediaStream
            mediaStreamAll={mediaStreamAll}
            video={video}
            audio={audio}
            toggleTracks={toggleTracks}
            persontoHandshake={persontoHandshake}
            peerConnection={peerConnection}
            peerConnectionStatus={peerConnection?.connectionState}
          />

          {remoteStream && <MediaStreamGuest remoteStream={remoteStream} />}
        </div>
      ) : (
        <div className="getUser_media_btn">
          we need acces to your camera and microphone
          <div>
            <CameraIcon sx={{ fontSize: "33px" }} />
            <MicIcon sx={{ fontSize: "33px" }} />
          </div>
          <button onClick={getUserMediaStream}>Grant access</button>
        </div>
      )}
    </div>
  );
};

export default WebrtcConnection;
