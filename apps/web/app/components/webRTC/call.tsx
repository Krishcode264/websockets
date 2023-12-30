
import { User } from "../../types/types";
import React from 'react'
import { IconBtn } from "../core_components/icon-button";
import "./Call.css";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
interface CallProps {
  handleAccept:()=>Promise<void>;
  handleReject: () => void;
  persontoHandShake?: User;
};
const Call: React.FC<CallProps> = ({
  persontoHandShake,
  handleReject,
  handleAccept,
}) => {

const handleAcceptClick = () => {
  handleAccept().catch((error) => {
    // Handle any errors from handleAccept
    console.error("Error in handleAccept:", error);
  });
};

  return (
    <div className="call_wrapper">
      <div className="caller_info">
        <h1>
          {persontoHandShake?.name &&
            `${persontoHandShake.name} is calling you...`}
        </h1>
      </div>

      <div className="accept_decline">
        <button className="accept" onClick={handleAcceptClick}>
          <IconBtn icon={CallIcon} br="50%" />
        </button>

      
        <button className="decline" onClick={handleReject}>
          <IconBtn icon={CallEndIcon} br="50%" />
        </button>
      </div>
    </div>
  );
};

export default Call;
