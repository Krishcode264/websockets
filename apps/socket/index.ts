import { Candidate, Offer, User } from "ui/types/types";
import { Socket } from "socket.io";
import http from "http";
import  socketIO from "socket.io";
import cors from "cors";
import { Server } from "socket.io";
const httpServer = http.createServer();
//to allow cross origin policy so that it can accept request from any url

const io = new Server(httpServer, { path: "/socket" });

let activeUsers = new Map();

const getTargetUser = (requestedUser: User) => {
  console.log(requestedUser);
  console.log(activeUsers);
  for (const [key, value] of activeUsers.entries()) {
    console.log(value.id, requestedUser.id);
    if (value.id === requestedUser.id) {
      console.log("found target user");
      return key;
    }
  }
  console.log("target user not found ");
  return null;
};

function socketioConnection() {
  io.on("connection", (socket: Socket) => {
    console.log("user connected", socket.id);

    //sending list of active users to newly connected client
    socket.emit("activeUsers", Array.from(activeUsers.values()));
    //sending data of newly connceted user to all active clients
    socket.on("newUserConnected", (newUserData: User) => {
      console.log(newUserData);
      activeUsers.set(socket.id, newUserData);
      socket.broadcast.emit("newUserConnected", newUserData);
    });

    //user disconnetion

    socket.on("disconnect", () => {
      const disconnectedUserData = activeUsers.get(socket.id);
      activeUsers.delete(socket.id);
      console.log("user dissconnected ");
      socket.broadcast.emit("userDisconnected", disconnectedUserData);
    });
    //making RTCP handshake
    socket.on(
      "receivedOfferForRTC",
      async ({ offer, requestedUser, user }: Offer) => {
        console.log("got ", requestedUser, user);
        if (requestedUser) {
          const targetUserSocketId = await getTargetUser(requestedUser);
          console.log("received request offer", targetUserSocketId);
          io.to(targetUserSocketId).emit("receivedOfferForRTC", {
            user,
            offer,
          });
        }
      }
    );

    socket.on("handshaketoRTC", (data: User) => {
      console.log(data, "data from ahndshake with create answer from client ");
    });
    socket.on(
      "getCreateAnswerFromRequestedUser",
      async ({ answer, receivedUser }: Offer) => {
        console.log("getting create answer from req user", receivedUser);
        if (receivedUser) {
          const targetUserSocketId = await getTargetUser(receivedUser);
          console.log("received answer", targetUserSocketId);
          io.to(targetUserSocketId).emit("receivedAnswerToRTC", {
            answer,
            receivedUser,
          });
        }
      }
    );
    socket.on(
      "candidate",
      async ({ candidate, persontoHandshake, user }: Candidate) => {
        console.log(
          "got candidate",
          "person to send :",
          persontoHandshake,
          "person who sent it",
          user
        );
        const targetUserSocketId = await getTargetUser(persontoHandshake);
        console.log(
          "received  target user to send candidate",
          targetUserSocketId
        );
        io.to(targetUserSocketId).emit("candidate", { candidate, user });
      }
    );
  });
}

httpServer.listen(8080, () => {
  console.log("server is listening on port 8080");
  socketioConnection();
  // connectMongo()
});
