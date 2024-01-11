"use client"
import { atom } from "recoil";
import { User } from "core";

interface connectedusersState {
  connectedUsers:User[]|[]
}

export const connectedUsersState = atom<connectedusersState>({
  key: "connectedUsersState",
  default: {
    connectedUsers: [],
  },
});