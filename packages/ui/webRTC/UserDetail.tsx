import { User } from "../types/types";

type UserDetailProps = {
  peerConnectionStatus: string; // Replace with the specific type for peerConnectionStatus
  persontoHandshake: string|null; // Replace with the specific type for persontoHandshake
  name: string;
  id: string;
  emitUserRequestForVideoCall: (user:User) => void;
};

export const UserDetail:React.FC<UserDetailProps> = ({
  peerConnectionStatus,
  persontoHandshake,
  name,
  id,
  emitUserRequestForVideoCall,
}) => {
console.log("user detail compont render ")
  return (
    <section key={id} className="user_detail">
      <h4>{name}</h4>
      <h2>{id}</h2>
      {/* {persontoHandshake && persontoHandshake.id == id && (
        <button onClick={() => emitUserRequestForVideoCall({ name, id })}>
          start video call
        </button>
      )} */}
      <button onClick={() => emitUserRequestForVideoCall({ name, id })}>
        {peerConnectionStatus === "connected" && persontoHandshake==id
          ? "in a call"
          : "start a video call"}
      </button>
    </section>
  );
};
