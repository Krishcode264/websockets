import { IconBtn } from "ui";
import React from "react";
import "./call.css";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { useRecoilState, useRecoilValue } from "recoil";
import { guestState } from "../../../store/atoms/guest-atom";
import { peerConnectionState } from "../../../store/selectors/pc-selector";
import { offerState } from "../../../store/atoms/pc-atom";
import { useContext } from "react";
import SocketContext from "../../../context/context";
const Call = () => {
  const [{ persontoHandshake }, setPersontoHandshake] =
    useRecoilState(guestState);
  const peerConnection = useRecoilValue(peerConnectionState);
  const [{offer}, setOffer] = useRecoilState(offerState);
    const socket=useContext(SocketContext)


  const createAnswer = async () => {
    try {
      const createdanswer = await peerConnection?.createAnswer();
      await peerConnection?.setLocalDescription(createdanswer);
      console.log("offer created on peerconnection");
      return createdanswer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error; // Optionally rethrow the error to propagate it
    }
  };

  const handleAccept = async (): Promise<void> => {
 
    if (offer) {
      await new Promise<void>((resolve, reject) => {
        peerConnection
          ?.setRemoteDescription(offer)
          .then(async () => {
            const answer = await createAnswer();
            console.log(answer,"answer from handle accesspt")
            socket?.emit("getCreateAnswerFromRequestedUser", {
              answer,
              receivedUser: persontoHandshake,
            });

            resolve(); // Resolve the outer promise when setRemoteDescription completes
          })
          .catch((error) => {
            reject(error); // Reject the outer promise if there's an error
          });
      });

      try {
        peerConnection?.setRemoteDescription(offer);
        const answer = await createAnswer();
        socket?.emit("getCreateAnswerFromRequestedUser", {
          answer,
          receivedUser: persontoHandshake,
        });
        console.log(
          "created  and sent sdp answer after getting offer  , both local and remote : done "
        );
      } catch (err) {
        console.log(err, "error in accepting call");
      }
    }
  };

  const handleAcceptClick = () => {
    handleAccept().catch((error) => {
      // Handle any errors from handleAccept
      console.error("Error in handleAccept:", error);
    });
  };
  const handleReject = (): void => {
    setPersontoHandshake({ persontoHandshake: { name: "", id: "" } });
    setOffer({ offer: null });
  };

  return (
    <div className="call_wrapper">
      <div className="caller_info">
        <h1>
          {persontoHandshake?.name &&
            `${persontoHandshake.name} is calling you...`}
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
