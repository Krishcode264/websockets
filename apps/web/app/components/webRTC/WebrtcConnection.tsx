import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import "./Meet.css";
import { User } from "ui/types/types";
import { Button } from "ui";

import { Label } from "ui";

type WebrtcConnectionProps = {
  persontoHandshake: User | null;
  peerConnection: RTCPeerConnection;
  peerConnectionStatus: string;
};
type VideoTypeRef = React.RefObject<HTMLVideoElement>;

const WebrtcConnection: React.FC<WebrtcConnectionProps> = ({
  persontoHandshake,
  peerConnection,
  peerConnectionStatus,
}) => {
  const myvideo: VideoTypeRef = useRef(null);
  const theirVideo: VideoTypeRef = useRef(null);
  console.log("web socket is running ");
  const addStreamToVideoElement = (
    ref: VideoTypeRef,
    stream: MediaStream | null
  ) => {
    if (ref.current && stream) {
      try {
        // ref.current.pause();

        // For the first stream, set the srcObject and play it
        ref.current.srcObject = stream;
        ref.current.addEventListener("loadedmetadata", () => {
          ref.current
            ?.play()
            .catch((err: any) =>
              console.log("error while playing video on loaded metatdata", err)
            );
        });
      } catch (err) {
        console.log("Error in adding stream to video element: ", err);
      }
    }
  };
  const getUserMedia = async () => {
    // console.log("get user media is running");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediastream) => {
        addStreamToVideoElement(myvideo, mediastream);
        mediastream.getTracks().forEach((track) => {
          // console.log("adding track to peer connection");
          peerConnection.addTrack(track, mediastream);
        });
      })
      .catch((err) => console.log("err adding strem to video element ", err));
  };

  // peerConnection.onconnectionstatechange = () => {
  //   console.log(
  //     "peer connecvtion state change",
  //     peerConnection.connectionState
  //   );
  //   if (peerConnection.connectionState == "connected" && peerConnection) {
  //     console.log(peerConnectionStatus, "connected blovk running ");

  //     peerConnection.ontrack = (e) => {
  //       getStream()
  //       console.log("egtiig n remote stream", e.streams);
  //       console.log(e.streams[0]);
  //       const remoteStream = e.streams[0];
  //       addStreamToVideoElement(theirVideo, remoteStream);
  //     };
  //   }
  // };

  useEffect(() => {
    getUserMedia();
    console.log("peer status chn aged and webrtc componet render happen");
    peerConnection.ontrack = (e: RTCTrackEvent) => {
      // console.log("egtiig n remote stream", e.streams);
      // console.log(e.streams[0]);
      const remoteStream = e.streams[0];
      console.log(remoteStream);
      console.log("we got remote stream")
      if (theirVideo.current && remoteStream) {
              console.log("we got remote stream adding to srcobject elelemt ");
        theirVideo.current.srcObject = remoteStream;
            
      }
      
  if (theirVideo.current) {
    theirVideo.current.addEventListener("loadedmetadata", () => {
      theirVideo.current
        ?.play()
        .catch((err) =>
          console.log(
            "error while playing video on loaded  from remote side",
            err
          )
        );
    });
  }
    };

    return () => {
      peerConnection.ontrack = null;
    };
  }, [peerConnectionStatus]);

  return (
    <div className="webrtc_template max_mode">
      <div className="video_wrappers">
        <section className="name_video">
      
          <video className="video" id="v1" ref={myvideo} src=""></video>
        </section>

        <section>

          <video
            className="video"
            id="v2"
            ref={theirVideo}
            muted={true}
            autoPlay={true}
            src=""
          ></video>
        </section>
      </div>
      <Button text="view in Max mode "/>
    </div>
  );
};

export default WebrtcConnection;