"use client";
import { UserSchemaType } from "core";
import { atom } from "recoil";

export const userState = atom({
  key: "user-state",
  default: {
    name:'',
    id: "",
    isConnected: false,
    country: "",
    intrests: [],
    age: 0,
    gender: "",
  }
});
