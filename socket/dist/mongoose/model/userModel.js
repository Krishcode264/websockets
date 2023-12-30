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
exports.findUserById = exports.getAllUsers = exports.deleteUserData = exports.saveUserData = exports.UserData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema_1 = require("../schemas/userSchema");
exports.UserData = mongoose_1.default.model("SocketUsers", userSchema_1.userSchema);
const saveUserData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new exports.UserData(Object.assign({}, data));
        const savedUser = yield newUser.save();
        return savedUser;
    }
    catch (err) {
        console.log(err, "err saving connected socket user");
        return null;
    }
});
exports.saveUserData = saveUserData;
const deleteUserData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield exports.UserData.findOneAndDelete({ socketID: id });
        return deletedUser;
    }
    catch (err) {
        console.log(err, "err deleting user ");
        return null;
    }
});
exports.deleteUserData = deleteUserData;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connectedUsers = yield exports.UserData.find();
        return connectedUsers;
    }
    catch (_a) {
        return null;
    }
});
exports.getAllUsers = getAllUsers;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const targetUser = yield exports.UserData.findOne({ id });
        if (!targetUser) {
            return null; // Return null when user is not found
        }
        return targetUser.socketID;
    }
    catch (error) {
        console.error("Error finding user by ID:", error);
        throw error; // Handle the error or rethrow for higher-level handling
    }
});
exports.findUserById = findUserById;
