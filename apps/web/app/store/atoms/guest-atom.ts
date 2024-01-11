"use client"
import { User } from "core"
import { atom } from "recoil"
type GuestState = {
  persontoHandshake: User;
};
export const guestState = atom<GuestState>({
  key: "guest-state",
  default: {
    persontoHandshake: {
      name: "",
      id: "",
    },
  },
});