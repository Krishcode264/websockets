import React, { useEffect } from "react";
import { useState } from "react";
import "./meet/meet.css";
import "./MediaStream/MediaStream.css";
import MediaStream from "./MediaStream/media-stream";
import MediaStreamGuest from "./MediaStream/media-stream-guest";
import CameraIcon from "@mui/icons-material/Camera";
import MicIcon from "@mui/icons-material/Mic";
import { useRecoilState, useRecoilValue } from "recoil";
import { peerConnectionState } from "../../store/selectors/pc-selector";
import { remoteStreamState } from "../../store/selectors/media-state-selector";

import { useSetRecoilState } from "recoil";
import { mediaStreamState } from "../../store/atoms/media-stream-atom";
import { showComponentState } from "../../store/atoms/show-component";
import { useMediaPermissionAccess } from "./hooks/useMediaPermissionAccess";

const WebrtcConnection = () => {
  const [tracksAdded, setTracksAdded] = useState(false);
  const peerConnection = useRecoilValue(peerConnectionState);
  const [remoteStream, setRemoteStream] = useRecoilState(remoteStreamState);
  const [{mediaStream}, setMediaStreamAll] = useRecoilState(mediaStreamState);
  const setShowComponent = useSetRecoilState(showComponentState);
 const {video,audio}=useMediaPermissionAccess();



  const getUserMediaStream = () => {
    const setDefaultdisabledTracks = (stream: MediaStream) => {
      stream.getTracks().forEach((track) => {
        track.enabled = false;
        peerConnection?.addTrack(track, stream);
      });
      // console.log(peerConnection.getSenders());
      console.log("stream after track.enable=false ", stream.getTracks());
      setMediaStreamAll((prev) => ({
        ...prev,
        mediaStream: stream,
        video: false,
        audio: false,
      }));

      setTracksAdded(() => true);
    };

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setDefaultdisabledTracks(stream);
      })
      .catch((err) => {
        throw err;
      });
  };
  useEffect(()=>{
    console.log(video,audio)
   if (
     audio === "granted" ||
     video === "granted" 
   ) {
     getUserMediaStream();
   }
  },[audio,video])

  useEffect(() => {
 
    if (peerConnection) {
      peerConnection.ontrack = (e: RTCTrackEvent) => {
        const rm = e.streams[0];
        console.log("remote strem ontract event", rm);
        if (rm) {
          setRemoteStream(rm);
        }
      };
    }
  }, [peerConnection]);

  return (
    <div className="webrtc_template max_mode">
      {mediaStream  ? (
        <div className="video_wrappers">
          <MediaStream />
          {remoteStream && <MediaStreamGuest />}
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
