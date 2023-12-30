import React, { useEffect } from "react";
import { useState } from "react";
import "./media-stream.css";
import { VideoComponent, AudioComponent } from "./media-stream-component";
const MediaStreamGuest = ({
  remoteStream,
}: {
  remoteStream: MediaStream | null;
}) => {
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);

  useEffect(() => {
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          setAudio(true);
        } else if (track.kind === "video") {
          setVideo(true);
        }
      });
    }
  }, [remoteStream]);
  return (
    <div className="media_stream_wrapper">
      <div className="video_audio">
        {remoteStream && video && <VideoComponent media={remoteStream} />}
        {remoteStream && audio && !video && (
          <AudioComponent media={remoteStream} />
        )}
      </div>
    </div>
  );
};

export default MediaStreamGuest;
