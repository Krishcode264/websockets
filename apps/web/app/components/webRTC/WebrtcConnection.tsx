import React, { useEffect } from "react";
import { useState } from "react";
import "./Meet.css";
import './MediaStream/MediaStream.css'
import { User } from "core/types/types";
import MediaStream from "./MediaStream/MediaStream";
import MediaStreamGuest from "./MediaStream/MediaStreamGuest";
import { Button } from "ui";
import { dividerClasses } from "@mui/material";
type WebrtcConnectionProps = {
  persontoHandshake: User | null;
  peerConnection: RTCPeerConnection;
  peerConnectionStatus: string;
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
    peerConnection.getSenders().forEach((sender: RTCRtpSender) => {
      if (sender.track?.kind === type) {
        sender.track.enabled = !sender.track.enabled;
        type === "audio"
          ? setAudio((prev) => !prev)
          : setVideo((prev) => !prev);
      }
      console.log(peerConnection.getSenders(), "senderes");
    });
  };

  const setDefaultdisabledTracks = (stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      track.enabled = false;

      peerConnection.addTrack(track, stream);
      setAudio(() => false);
      setVideo(() => false);
    });
    console.log(peerConnection.getSenders());
    setMediaStreamAll(() => stream);
  };

  const getUserMediaStream = () => {
    if (tracksAdded) {
      return; // Already added tracks
    }

    console.log("getuser media runnig ");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setDefaultdisabledTracks(stream);
        setTracksAdded(() => true);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    console.log("peer status chn aged and webrtc componet render happen");
    peerConnection.ontrack = (e: RTCTrackEvent) => {
      const rm = e.streams[0];
      if (rm) {
        setRemoteStream(() => rm);
        console.log(rm.getTracks(), "tracks from webrtc newly got");
      }
    };

    return () => {
      peerConnection.ontrack = null;
    };
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
            peerConnectionStatus={peerConnection.connectionState}
          />

          <MediaStreamGuest remoteStream={remoteStream} />
        </div>
      ) : (
        <div className="getUser_media_btn">
      
          <button onClick={getUserMediaStream}>
           click to give Permissions for audio video
          </button>
        </div>
      )}
    </div>
  );
};

export default WebrtcConnection;
