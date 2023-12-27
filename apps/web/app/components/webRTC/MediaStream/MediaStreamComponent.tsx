import { useEffect } from "react";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import { useRef } from "react";

interface MediaProps {
  media: MediaStream;
}

export const VideoComponent: React.FC<MediaProps> = ({
  media,
}) => {
  const videoref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoref.current) {
      videoref.current.srcObject = media;

      videoref.current.addEventListener("loadedmetadata", () => {
        videoref.current
          ?.play()
          .catch((err) =>
            console.log("error while playing video on loaded metatdata", err)
          );
      });
    }
  }, []);
  return <video ref={videoref} className="video_container"></video>;
};

export const AudioComponent: React.FC<MediaProps> = ({ media }) => {
const audioref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (audioref.current) {
      audioref.current.srcObject = media;
      audioref.current.addEventListener("loadedmetadata", () => {
        audioref.current
          ?.play()
          .catch((err) =>
            console.log("error while playing video on loaded metatdata", err)
          );
      });
    }
  }, []);
  return (
    <div className="audio_container">
      <RecordVoiceOverIcon sx={{ fontSize: 85, color: "white" }} />
      <audio ref={audioref}></audio>
    </div>
  );
};
