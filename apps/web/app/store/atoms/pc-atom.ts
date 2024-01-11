
"use client"
import { atom } from "recoil";
import type { OfferSdp } from "../../components/webRTC/meet/meet";

interface PCState{
  peerConnection: RTCPeerConnection | null;
  peerConnectionStatus: string;
};
export const pcState=atom<PCState>({
    key:"pc-state",
    default:{
        peerConnection:null,
        peerConnectionStatus:'',
        
    }
});

interface OfferState {
  offer: RTCSessionDescriptionInit|null|undefined;
}

export const offerState= atom<OfferState>({
  key: "offer-state",
  default: {
   offer:null,
  },
});