"use client";
import { User } from "core";
import { Offer } from "core";
import { Candidate } from "core";
import React, { useEffect} from "react";
import "./meet.css";
import WebrtcConnection from "../webrtc-connection";
import { UserForm } from "../user-form";
import { RenderConnectedUsers } from "../user-detail";
import Call from "../call/call";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { guestState } from "../../../store/atoms/guest-atom";
import { userInfoState } from "../../../store/selectors/user-selector";
import SocketContext from "../../../context/context";
import {
  connectedUsersState,
} from "../../../store/atoms/socket-atom";
import { showComponentState } from "../../../store/atoms/show-component";
import { offerState, pcState } from "../../../store/atoms/pc-atom";
import { useSocket } from "../hooks/useSocket";
import { usePeerConnection } from "../hooks/usePeerConnection";
import { createContext } from "react";
import { Socket } from "socket.io-client";
export interface OfferSdp {
  sdp?: string;
  type: "offer";
}
type ConnectedUsers = User[] | [];
export function Meet() {
 const socketContext=createContext<Socket|null>(null)

  const user = useRecoilValue(userInfoState);
  const [{ persontoHandshake }, setPersontoHandshake]=useRecoilState(guestState);
  const setOffer = useSetRecoilState(offerState);
  const  setConnectedUsers=useSetRecoilState(connectedUsersState);
  const [showComponent, setShowComponent] = useRecoilState(showComponentState);
  const { showCall, showform, showWebrtcConnection } = showComponent;
  const { socket } = useSocket();
  const peerConnection = usePeerConnection();
   const setPeerConnection=useSetRecoilState(pcState)
  useEffect(() => {
    if (socket && peerConnection) {
      setPeerConnection((prev)=>({...prev,peerConnection}))
      setShowComponent((prev) => ({ ...prev, showWebrtcConnection: true }));
    }
  }, [socket, peerConnection]);

  //  peerConnection.onicegatheringstatechange = () => {
  //     console.log("ICE gathering state:", peerConnection.iceGatheringState);

  //     if (peerConnection.iceGatheringState === "complete") {
  //       // ICE gathering is complete, check if any candidates were gathered
  //       const localCandidates =
  //         peerConnection.localDescription?.sdp.match(/a=candidate:(.*)/g);
  //       if (!localCandidates || localCandidates.length === 0) {
  //         console.log("No ICE candidates gathered.");
  //         // Handle the scenario where no ICE candidates were gathered
  //       } else {
  //         console.log("ICE candidates gathered:", localCandidates);
  //         // ICE candidates were gathered successfully
  //       }
  //     }
  //   };
  // useEffect(() => {
  //   console.log("peer conection status from user detail", peerConnection.connectionState);
  // }, [peerConnection.connectionState]);

  //function to make request for video call to another client

  //ice candidate exchnage
  if (peerConnection) {
    peerConnection.onicecandidate = (event) => {
      // console.log("onicecandidate event is running");
      if (peerConnection.remoteDescription) {
        // console.log("actul ice candidates shared now ");
        if (event.candidate  && socket !== null) {
          const candidate = event.candidate;
          socket.emit("candidate", { candidate, persontoHandshake, user });
          console.log("candidate  sent ");
        }
      }
    };
  }

  //   peerConnection.onconnectionstatechange=()=>{
  // console.log("peer connecvtion state change",peerConnection.connectionState)
  //   }





  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("socket connection established");
        socket.emit("newUserConnected", user);
        setShowComponent({
          showCall,
          showform,
          showWebrtcConnection: !showWebrtcConnection,
        });
        // setShowWEBrtcConnection((prev) => !prev);
        socket.on("activeUsers", (activeUsers: ConnectedUsers) => {
          setConnectedUsers((prev) => ({
            ...prev,
            connectedUsers: activeUsers,
          }));
        });
      });
      socket.on("newUserConnected", (newUserData: User) => {
        // console.log(connectedUsers, newUserData);
        setConnectedUsers(({ connectedUsers }) => {
          if (connectedUsers.length === 0) {
            return { connectedUsers: [newUserData] };
          }
          return { connectedUsers: [...connectedUsers, newUserData] };
        });
      });
      socket.on("userDisconnected", (disconncetdUserdata: User) => {
        setConnectedUsers(({ connectedUsers }) => ({
          connectedUsers: connectedUsers.filter(
            (userinconnection) => userinconnection.id !== disconncetdUserdata.id
          ),
        }));
      });

      socket.on(
        "receivedOfferForRTC",
        ({ user: receivedUser, offer: offerreceived }: Offer) => {
          console.log(
            "updatation of persontohandshake at socket event ",
            receivedUser
          );
             console.log(offerreceived,"offer from receive offer for rtc")
          setOffer({ offer: offerreceived });
          setPersontoHandshake({ persontoHandshake: receivedUser });
          setShowComponent({
            showCall: true,
            showform,
            showWebrtcConnection,
          });

          //send back localdescription.createanswer to client via socket event
        }
      );
      socket.on("receivedAnswerToRTC", async ({ answer }: Offer) => {
        await peerConnection?.setRemoteDescription(answer);
      });
      socket.on("candidate", async ({ candidate }: Candidate) => {
        console.log("candidate event running we got ice can ", candidate);
        // console.log("guest:", persontoHandshake, "user :", user);
        // if (persontoHandshake && persontoHandshake.id == guest.id) {
        console.log("id matched for ice candidate exchnage");
        if (peerConnection?.remoteDescription) {
          try {
            await peerConnection.addIceCandidate(candidate);
          } catch (error) {
            // Handle the error if the ice candidate couldn't be added
            console.error("Error adding ice candidate:", error);
          }
        }

        // }
      });
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      <div>
        <h1>Join room </h1>
        {socket === null && showform && <UserForm />}
        {showCall && <Call />}
        {socket && (
          <>
            <div className="connected_people_wrapper">
              <RenderConnectedUsers />
            </div>
            <WebrtcConnection />
          </>
        )}
      </div>
    </SocketContext.Provider>
  );
}

