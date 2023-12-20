"use client";
import React, { useEffect } from "react";
import "./Meet.css";
import { useState } from "react";
import io from "socket.io-client";
import WebrtcConnection from "./WebrtcConnection";
import { UserDetail } from "./UserDetail";
import { UserForm } from "./UserForm";
import { User } from "../types/types";
import { Offer } from "../types/types";
import { Candidate } from "../types/types";
import { Socket } from "socket.io-client";

export const Meet = () => {

  type ConnectedUsers=User[]|[];
  const [showform, setShowForm] = useState<boolean>(false);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUsers>([]);
  const [user, setUser] = useState<User>({ name: "", id: "", socketID: null });
  const [socket, setSocket] = useState<Socket|null>(
    null
  );
  const [showWEBrtcConnection, setShowWEBrtcConnection] = useState(false);

  const [persontoHandshake, setPersontoHandshake] = useState<User | null>(null);
  const configForPeerconnection = {
    echoCancellation: true,
    iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
  };
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>(
    new RTCPeerConnection(configForPeerconnection)
  );

  peerConnection.onicegatheringstatechange = () => {
    console.log("ICE gathering state:", peerConnection.iceGatheringState);

    if (peerConnection.iceGatheringState === "complete") {
      // ICE gathering is complete, check if any candidates were gathered
      const localCandidates =
        peerConnection.localDescription?.sdp.match(/a=candidate:(.*)/g);
      if (!localCandidates || localCandidates.length === 0) {
        console.log("No ICE candidates gathered.");
        // Handle the scenario where no ICE candidates were gathered
      } else {
        console.log("ICE candidates gathered:", localCandidates);
        // ICE candidates were gathered successfully
      }
    }
  };
  // useEffect(() => {
  //   console.log("peer conection status from user detail", peerConnection.connectionState);
  // }, [peerConnection.connectionState]);

  //function to create offer

  const createOffer = async () => {
    let offer = await peerConnection.createOffer();
    peerConnection.setLocalDescription(offer);

    return offer;
  };

  const createAnswer = async () => {
    let answer = await peerConnection.createAnswer();
    peerConnection.setLocalDescription(answer);

    return answer;
  };
  //function to make request for video call to another client
  const emitUserRequestForVideoCall = async (requestedUser: User) => {
    let offer = await createOffer();
    setPersontoHandshake(() => requestedUser);
    console.log("guest from emituserrequest", persontoHandshake);
    if (socket && offer) {
      socket.emit("receivedOfferForRTC", { offer, requestedUser, user });
    }
  };

  //updates user from user form component
  const updateUser = (user: User) => {
    setUser(user);
  };

  const renderConnectedUsers = () => {
    return connectedUsers.map((user: User) => {
      return (

        <UserDetail
          persontoHandshake={persontoHandshake && persontoHandshake.id}
          peerConnectionStatus={peerConnection.connectionState}
          id={user.id}
          name={user.name}
          emitUserRequestForVideoCall={emitUserRequestForVideoCall}
        />
      );
    });
  };

  //ice candidate exchnage

  peerConnection.onicecandidate = (event) => {
    console.log("onicecandidate event is running");
    if (event.candidate && persontoHandshake && socket!=null) {
      let candidate = event.candidate;
      socket.emit("candidate", { candidate, persontoHandshake, user });
      console.log("can sent ");
    }
  };

  const handleSocketConnection = (newUser: User):Promise<void> => {
    return new Promise((resolve, rejecet) => {
      try {
        const socket = io("http://localhost:8080", {
          path: "/socket",
          transports: ["websocket"],
        });
        setSocket(socket);

        socket.emit("welcomeUser", newUser);
console.log("promise resolved ")
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

  useEffect(() => {
    if (socket) {
      console.log(socket);
      socket.on("connect", () => {
        console.log("socket connection established");
        socket.emit("newUserConnected", user);
        setShowWEBrtcConnection((prev) => !prev);
        socket.on("activeUsers", (activeUsers:ConnectedUsers) => {
          setConnectedUsers(activeUsers);
        });
      });
      socket.on("newUserConnected", (newUserData:User) => {
        setConnectedUsers((prevUsers):ConnectedUsers => [...prevUsers, newUserData]);
      });
      socket.on("userDisconnected", (disconncetdUserdata:User) => {
        setConnectedUsers((prevUser) =>
          prevUser.filter((user) => user.id !== disconncetdUserdata.id)
        );
      });

      socket.on(
        "receivedOfferForRTC",
        async ({ user: receivedUser, offer }: Offer) => {
          console.log(
            "updatation of persontohandshake at socket event ",
            receivedUser
          );
          setPersontoHandshake(() => receivedUser);
          peerConnection.setRemoteDescription(offer);

          let answer = await createAnswer();

          if (answer) {
            console.log(
              "created  and sent sdp answer after getting offer  , both local and remote : done "
            );
            socket.emit("getCreateAnswerFromRequestedUser", {
              answer,
              receivedUser,
            });
          }

          //send back localdescription.createanswer to client via socket event
        }
      );
      socket.on(
        "receivedAnswerToRTC",
        async ({ answer, receivedUser }: Offer) => {
          try {
            await peerConnection.setRemoteDescription(answer);
            console.log(
              "after adding answer to peerconnection, both remote /local done "
            );
          } catch (err) {
            console.log(err, "err updating asnwer to remote staate");
          }
        }
      );
      socket.on("candidate", ({ candidate, user: guest }: Candidate) => {
        console.log(
          "candidate event running we got ice can ",
          candidate,
          guest
        );
        console.log("guest:", persontoHandshake, "user :", user);
        // if (persontoHandshake && persontoHandshake.id == guest.id) {
        console.log("id matched for ice candidate exchnage");
        peerConnection.addIceCandidate(candidate);
        // }
      });
    }
  }, [socket]);

  useEffect(() => {
    console.log("guest chnaged ", persontoHandshake);
  }, [persontoHandshake]);

  return (
    <div>
      <h1>Join room </h1>
      {socket == null && (
        <button className="join_room" onClick={() => setShowForm(true)}>
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
      {socket && (
        <>
          <h2>connected people</h2>
          {connectedUsers.length > 0 ? (
            renderConnectedUsers()
          ) : (
            <h3>there is no one joined this room</h3>
          )}
        </>
      )}

      {showWEBrtcConnection  &&  (
        <WebrtcConnection
          persontoHandshake={persontoHandshake}
          peerConnection={peerConnection}
          peerConnectionStatus={peerConnection.connectionState}
        />
      )}
    </div>
  );
};
