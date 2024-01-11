
"use client "
import { atom } from "recoil";

interface MediaStreamState{
    mediaStream:MediaStream|null,
    remoteStream:MediaStream|null,
    video:boolean,
    audio:boolean
}

export const mediaStreamState=atom<MediaStreamState>({
    key:"media-stream",
    default:{
        mediaStream:null,
        remoteStream:null,
        video:false,
        audio:false
    }
})