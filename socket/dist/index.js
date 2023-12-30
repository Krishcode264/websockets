"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const httpServer = http_1.default.createServer();
const connectMongo_1 = require("./mongoose/connectMongo");
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = require("./mongoose/model/userModel");
const userModel_2 = require("./mongoose/model/userModel");
dotenv_1.default.config();
//to allow cross origin policy so that it can accept request from any url
const io = new socket_io_1.Server(httpServer, { path: "/socket" });
function socketioConnection() {
    io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        console.log("user connected", socket.id);
        (0, userModel_2.getAllUsers)().then((data) => socket.emit("activeUsers", data));
        //sending list of active users to newly connected client
        //sending data of newly connceted user to all active clients
        socket.on("newUserConnected", (newUserData) => {
            console.log(newUserData);
            //sending user to mongo db
            (0, userModel_1.saveUserData)(Object.assign(Object.assign({}, newUserData), { socketID: socket.id, isConnected: true })).then((data) => {
                if (data) {
                    const { name, id } = data;
                    socket.broadcast.emit("newUserConnected", { name, id });
                }
            });
        });
        //user disconnetion
        socket.on("disconnect", () => {
            (0, userModel_1.deleteUserData)(socket.id).then((data) => {
                if (data) {
                    const { name, id } = data;
                    console.log("user dissconnected ");
                    socket.broadcast.emit("userDisconnected", { name, id });
                }
            });
        });
        //making RTCP handshake
        socket.on("receivedOfferForRTC", ({ offercreated: offer, requestedUser, user }) => __awaiter(this, void 0, void 0, function* () {
            console.log("got   step 1 : got offer ", requestedUser, user);
            if (requestedUser) {
                (0, userModel_1.findUserById)(requestedUser.id).then((socketID) => {
                    if (socketID) {
                        io.to(socketID).emit("receivedOfferForRTC", {
                            user,
                            offer,
                        });
                    }
                });
            }
        }));
        socket.on("handshaketoRTC", (data) => {
            console.log(data, "data from ahndshake with create answer from client ");
        });
        socket.on("getCreateAnswerFromRequestedUser", ({ answer, receivedUser }) => __awaiter(this, void 0, void 0, function* () {
            console.log("getting create answer from req user", receivedUser);
            if (receivedUser) {
                (0, userModel_1.findUserById)(receivedUser.id).then((socketID) => {
                    if (socketID) {
                        io.to(socketID).emit("receivedAnswerToRTC", {
                            answer,
                            receivedUser,
                        });
                        console.log("received answer", socketID);
                    }
                });
            }
        }));
        socket.on("candidate", ({ candidate, persontoHandshake, user }) => __awaiter(this, void 0, void 0, function* () {
            console.log("got candidate", "person to send :", persontoHandshake, "person who sent it", user);
            (0, userModel_1.findUserById)(persontoHandshake.id).then((socketID) => {
                if (socketID) {
                    io.to(socketID).emit("candidate", { candidate, user });
                    console.log("received  target user to send candidate");
                }
            });
        }));
    }));
}
const uri = process.env.MONGO_URI;
httpServer.listen(8080, () => {
    console.log("server is listening on port 8080");
    socketioConnection();
    if (uri) {
        (0, connectMongo_1.connectMongo)(uri);
    }
});
