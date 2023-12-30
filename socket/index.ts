import { Candidate, Offer, User } from "./types/types";
import { Socket } from "socket.io";
import http from "http";

import { Server } from "socket.io";
const httpServer = http.createServer();
import { connectMongo } from "./mongoose/connectMongo";
import dotenv from "dotenv";
import {
  deleteUserData,
  findUserById,
  saveUserData,
} from "./mongoose/model/userModel";
import { UserSchemaType } from "./types/types";
import { getAllUsers } from "./mongoose/model/userModel";
dotenv.config();

//to allow cross origin policy so that it can accept request from any url

const io = new Server(httpServer, { path: "/socket" });



function socketioConnection() {
  io.on("connection", async (socket: Socket) => {
    console.log("user connected", socket.id);
    getAllUsers().then((data) => socket.emit("activeUsers", data));

    //sending list of active users to newly connected client

    //sending data of newly connceted user to all active clients
    socket.on("newUserConnected", (newUserData: UserSchemaType) => {
      console.log(newUserData);
      //sending user to mongo db
      saveUserData({
        ...newUserData,
        socketID: socket.id,
        isConnected: true,
      }).then((data) => {
        if (data) {
          const { name, id } = data;
          socket.broadcast.emit("newUserConnected", { name, id });
        }
      });
    });

    //user disconnetion

    socket.on("disconnect", () => {
      deleteUserData(socket.id).then((data) => {
        if (data) {
          const { name, id } = data;

          console.log("user dissconnected ");
          socket.broadcast.emit("userDisconnected", { name, id });
        }
      });
    });
    //making RTCP handshake
    socket.on(
      "receivedOfferForRTC",
      async ({ offercreated:offer, requestedUser, user }: Offer) => {
        console.log("got   step 1 : got offer ", requestedUser, user);
        if (requestedUser) {
          findUserById(requestedUser.id).then((socketID) => {
            if (socketID) {
              io.to(socketID).emit("receivedOfferForRTC", {
                user,
                offer,
              });
            }
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
          findUserById(receivedUser.id).then((socketID) => {
            if (socketID) {
              io.to(socketID).emit("receivedAnswerToRTC", {
                answer,
                receivedUser,
              });

              console.log("received answer", socketID);
            }
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
        findUserById(persontoHandshake.id).then((socketID) => {
          if (socketID) {
            io.to(socketID).emit("candidate", { candidate, user });
            console.log("received  target user to send candidate");
          }
        });
      }
    );
  });
}
const uri = process.env.MONGO_URI;



httpServer.listen(8080, () => {
  console.log("server is listening on port 8080");
  socketioConnection();

  if (uri) {
    connectMongo(uri);
  }
});
