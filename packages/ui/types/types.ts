export type User = {
  name: string;
  id: string;
 
};

export type Offer = {
  user: User;
  offer: { sdp?: string; type: "offer" };
  answer: { sdp?: string; type: "answer" };
  requestedUser?: User;
  receivedUser?: User;
};
export type Candidate = {
  candidate: RTCIceCandidate;
  persontoHandshake: User;

  user: User;
};

