import React from "react";
import "./Call.css";
import { User } from "ui/types/types";
import { IconBtn } from "ui";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
type CallProps = {
  handleAccept: () => void;
  handleReject: () => void;
  persontoHandShake?: User;
};
const Call:React.FC<CallProps> = ({ persontoHandShake, handleReject, handleAccept}) => {
 return (
   <div className="call_wrapper">
     <div className="caller_info">
       <h1>
         {" "}
         {persontoHandShake && persontoHandShake.name} is calling you...{" "}
       </h1>
     </div>

     <div className="accept_decline">
       <button className="accept" onClick={handleAccept}>
         <IconBtn icon={CallIcon } br="50%" />
       </button>

       <button className="decline" onClick={handleReject}>
         <IconBtn icon={CallEndIcon }  br='50%'/>
       </button>
     </div>
   </div>
 );
};

export default Call;
