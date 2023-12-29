
import { User } from "core";

interface UserDetailProps {
  peerConnectionStatus: string; // Replace with the specific type for peerConnectionStatus
  persontoHandshake: string|null|undefined; // Replace with the specific type for persontoHandshake
  name: string;
  id: string;
  emitUserRequestForVideoCall: (user:User) =>Promise<void>;
};

export const UserDetail:React.FC<UserDetailProps> = ({
  // peerConnectionStatus,
  persontoHandshake,
  name,
  id,
  emitUserRequestForVideoCall,
}) => {
// console.log("user detail compont render ")

// useEffect(()=>{

// },[peerConnectionStatus])

  return (
    <section key={id} className="user_detail">
      <h1>{name}</h1>

      <button
        disabled={persontoHandshake===id}
        onClick={async()=>{ await emitUserRequestForVideoCall({ name, id })}}
      >
        { persontoHandshake === id
          ? "in a call"
          : "start a video call"}
      </button>
    </section>
  );
};
