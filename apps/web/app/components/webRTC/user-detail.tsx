import { User } from "core";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  connectedUsersState,
} from "../../store/atoms/socket-atom";
import { guestState } from "../../store/atoms/guest-atom";
import { peerConnectionState } from "../../store/selectors/pc-selector";
import { userInfoState } from "../../store/selectors/user-selector";
import { useContext } from "react";
import SocketContext from "../../context/context";
const UserDetail = ({ id, name }: User) => {
  const [{persontoHandshake}, setPersontoHandshake] = useRecoilState(guestState);
   const socket=useContext(SocketContext)
  const peerConnection = useRecoilValue(peerConnectionState);
  const user = useRecoilValue(userInfoState);
  const createOffer = async () => {
    try {
      const createdOffer = await peerConnection?.createOffer();
      await peerConnection?.setLocalDescription(createdOffer);
      return createdOffer;
    } catch (error) {
      // Handle the error if needed
      console.error("Error creating offer:", error);
      throw error; // Optional: rethrow the error to propagate it
    }
  };

  const emitUserRequestForVideoCall = async (
    requestedUser: User
  ): Promise<void> => {
  console.log(socket,'soxket from emit user req ')

    const createdOffer = await createOffer();
    setPersontoHandshake(() =>({persontoHandshake: requestedUser}));
    // console.log("guest from emituserrequest", persontoHandshake);
    if (socket !== null && createdOffer) {
        console.log("socket is preset here is offer ",createdOffer)
      socket.emit("receivedOfferForRTC", { createdOffer, requestedUser, user });
    }
  };

  return (
    <section key={id} className="user_detail">
      <h2>{name}</h2>

      <button
     
        onClick={() => {
          emitUserRequestForVideoCall({ name, id });
        }}
      >
        {persontoHandshake.id === id ? "in a call" : "start a video call"}
      </button>
    </section>
  );
};

export const RenderConnectedUsers = () => {
  const { connectedUsers } = useRecoilValue(connectedUsersState);

  return connectedUsers.map((connecteduser: User): JSX.Element => {
    return <UserDetail name={connecteduser.name} id={connecteduser.id} />;
  });
};
