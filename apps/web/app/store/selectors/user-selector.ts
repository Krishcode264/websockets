import { userState } from "../atoms/user-atom";
import { selector } from "recoil";
import {User} from "core"
import { UserSchemaType } from "core";
export const userInfoState=selector({
    key:"user-info-selector",
    get:({get})=>{
        const {name,id}=get(userState)
        return {name,id}
    }
})

export const updateUser = selector({
  key: "updateUser",
  get: ({ get }) => get(userState),
  set:({set},newuser)=>set(userState,newuser)});