"use client";
import { User } from "core";
import { Offer } from "core";
import { Candidate } from "core";
import React, { useEffect } from "react";
import "./Meet.css";
import { useState } from "react";
import io from "socket.io-client";
import WebrtcConnection from "./webrtc-connection";
import { UserForm } from "./user-form";
import { UserDetail } from "./user-detail";
import Call from "./call";
import { Socket } from "socket.io-client";

export interface OfferSdp {
  sdp?: string;
  type: "offer";
}
export const Meet = () => {
  type ConnectedUsers = User[] | [];
  const [showform, setShowForm] = useState<boolean>(false);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUsers>([]);
  const [user, setUser] = useState<User>({ name: "", id: "" });
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showWEBrtcConnection, setShowWEBrtcConnection] = useState(false);
  const [persontoHandshake, setPersontoHandshake] = useState<User | null>(null);
  const [showCall, setShowCall] = useState(false);
  const [offer, setOffer] = useState<OfferSdp | null | undefined>(null);
  const configForPeerconnection = {
    echoCancellation: true,
    iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
  };
  const [peerConnection] = useState<RTCPeerConnection|null>(()=>{
      if (typeof window !== 'undefined') {
            return new RTCPeerConnection(configForPeerconnection);
       }
       return null
    }
  );

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

  //function to create offer

  const createOffer = async () => {
    try {
      const createdOffer = await peerConnection?.createOffer();
      await peerConnection?.setLocalDescription(createdOffer);
      return createdOffer;
    } catch (error) {
      // Handle the error if needed
      console.error("Error creating offer:", error);
      throw error; // Optional: rethrow the error to propagate it
    }
  };

  const createAnswer = async () => {
    try {
      const createdanswer = await peerConnection?.createAnswer();
     await  peerConnection?.setLocalDescription(createdanswer);
      console.log("offer created on peerconnection");
      return createdanswer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error; // Optionally rethrow the error to propagate it
    }
  };
  //function to make request for video call to another client
  const emitUserRequestForVideoCall = async (
    requestedUser: User
  ): Promise<void> => {
    const offercreated = await createOffer();
    setPersontoHandshake(() => requestedUser);
    // console.log("guest from emituserrequest", persontoHandshake);
    if (socket !== null) {
      socket.emit("receivedOfferForRTC", { offercreated, requestedUser, user });
    }
  };

  //updates user from user form component
  const updateUser = (usertoupdate: User) => {
    setUser(usertoupdate);
  };

  const renderConnectedUsers = () => {
    return connectedUsers.map((connecteduser: User): JSX.Element => {
      return (
        <UserDetail
          persontoHandshake={persontoHandshake?.id}
          peerConnectionStatus={peerConnection?.connectionState}
          id={connecteduser.id}
          key={connecteduser.id}
          name={connecteduser.name}
          emitUserRequestForVideoCall={emitUserRequestForVideoCall}
        />
      );
    });
  };

  //ice candidate exchnage
if(peerConnection){
 peerConnection.onicecandidate = (event) => {
   // console.log("onicecandidate event is running");
   if (peerConnection.remoteDescription) {
     // console.log("actul ice candidates shared now ");
     if (event.candidate && persontoHandshake && socket !== null) {
       const candidate = event.candidate;
       socket.emit("candidate", { candidate, persontoHandshake, user });
       console.log("candidate  sent ");
     }
   }
 };
}
 

  const handleSocketConnection = (newUser: User): Promise<void> => {
    return new Promise((resolve, rejecet) => {
      try {
        const newsocket = io("http://13.53.177.68", {
          path: "/socket",
          transports: ["websocket"],
        });
        setSocket(newsocket);

        newsocket.emit("welcomeUser", newUser);
        // console.log("promise resolved ");
        resolve();
      } catch (err) {
        console.log("error in connect to socket", err);
        rejecet(err);
      }
    });
  };

  //   peerConnection.onconnectionstatechange=()=>{
  // console.log("peer connecvtion state change",peerConnection.connectionState)
  //   }

  const handleAccept = async (): Promise<void> => {
    setShowCall(() => false);
    console.log(offer);
    if (offer) {
      await new Promise<void>((resolve, reject) => {
        peerConnection
          ?.setRemoteDescription(offer)
          .then(async () => {
            const answer = await createAnswer();
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

      // try {
      //   peerConnection.setRemoteDescription(offer);
      //   const answer = await createAnswer();
      //   socket?.emit("getCreateAnswerFromRequestedUser", {
      //     answer,
      //     receivedUser: persontoHandshake,
      //   });
      //   console.log(
      //     "created  and sent sdp answer after getting offer  , both local and remote : done "
      //   );
      // } catch (err) {
      //   console.log(err, "error in accepting call");
      // }
    }
  };

  const handleReject = (): void => {
    setPersontoHandshake(() => null);
    setOffer(() => null);
  };

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("socket connection established");
        socket.emit("newUserConnected", user);
        setShowWEBrtcConnection((prev) => !prev);
        socket.on("activeUsers", (activeUsers: ConnectedUsers) => {
          setConnectedUsers(activeUsers);
        });
      });
      socket.on("newUserConnected", (newUserData: User) => {
        // console.log(connectedUsers, newUserData);
        setConnectedUsers((prevUsers) => {
          if (prevUsers.length === 0) {
            return [newUserData];
          }
          return [...prevUsers, newUserData];
        });
      });
      socket.on("userDisconnected", (disconncetdUserdata: User) => {
        setConnectedUsers((prevUser) =>
          prevUser.filter(
            (userinconnection) => userinconnection.id !== disconncetdUserdata.id
          )
        );
      });

      socket.on(
        "receivedOfferForRTC",
        ({ user: receivedUser, offer: offerreceived }: Offer) => {
          console.log(
            "updatation of persontohandshake at socket event ",
            receivedUser
          );

          setOffer(() => offerreceived);
          setPersontoHandshake(() => receivedUser);
          setShowCall(true);

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
    <div>
      <h1>Join room </h1>
      {socket === null && (
        <button
          className="join_room"
          onClick={() => {
            setShowForm(true);
          }}
        >
          Join
        </button>
      )}

      {showform && (
        <UserForm
          handleSocketConnection={handleSocketConnection}
          setShowForm={setShowForm}
          updateUser={updateUser}
          socket={socket}
        />
      )}

      {showCall && persontoHandshake && (
        <Call
          handleAccept={handleAccept}
          handleReject={handleReject}
          persontoHandShake={persontoHandshake}
        />
      )}
      {socket && (
        <>
          <h2>connected people</h2>
          <div className="connected_people_wrapper">
            {connectedUsers.length > 0 ? (
              renderConnectedUsers()
            ) : (
              <h3>there is no one joined this room</h3>
            )}
          </div>
        </>
      )}

      {showWEBrtcConnection && (
        <WebrtcConnection
          persontoHandshake={persontoHandshake}
          peerConnection={peerConnection && peerConnection}
          peerConnectionStatus={peerConnection?.connectionState}
        />
      )}
    </div>
  );
};
