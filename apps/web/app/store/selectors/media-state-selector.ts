import { selector } from "recoil";
import { mediaStreamState } from "../atoms/media-stream-atom";

export const mediaState=selector<{audio:boolean,video:boolean}>({
    key:"mediaState",
    get:({get})=>{
        const {video,audio}=get(mediaStreamState)
        return {video,audio}
    },
    set:({set},media:{video:boolean,audio:boolean})=>{
        set(mediaState,(prev)=>({...prev,video:media.video,audio:media.audio}))
    }
})

export const remoteStreamState=selector<MediaStream|null>({
    key:"remote-stream-selector",
    get:({get})=>{
        const {remoteStream}=get(mediaStreamState)
        return remoteStream
    },
    set:({set},newRemoteStreat:MediaStream)=>{
        set(mediaStreamState,(prev)=>({...prev,remoteStream:newRemoteStreat}))
    }
})