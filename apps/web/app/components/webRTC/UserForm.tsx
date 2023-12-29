import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { User } from "core";
import { Socket } from "socket.io-client";
import LoginIcon from "@mui/icons-material/Login";
import { IconBtn } from "ui";
type HandleSocketConnection = (newUser: User) => Promise<void>;

interface UserFormprops {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  handleSocketConnection: HandleSocketConnection;
  updateUser: (user: User) => void;
  socket: Socket | null;
}
export const UserForm: React.FC<UserFormprops> = ({
  setShowForm,
  handleSocketConnection,
  updateUser,
  socket,
}) => {
  const [user, setUser] = useState<User>({ name: "", id: uuidv4() });

  const handleSaveUserForm = () => {
    // console.log("handle save user form is running ");

    if (!user.name) {
      // window.alert("enter name ");
      return;
    }
    // console.log(socket ,"running from start bfunction to initiallize the ")
    // if(socket){
    updateUser(user);
    handleSocketConnection(user)
      .then(() => {
        setShowForm((prev) => !prev);
        setUser({ name: "", id: uuidv4() });
      })
      .catch((err) => {
        throw err;
        //  console.error("error connecting to socket", err);
      });

    // } else{
    // //   console.log(socket)
    // //     setShowForm(false)
    // //     window.alert("there is some issue connecting ... try after some time ")
    // //    }
  };
  useEffect(() => {
    // console.log(socket,"socket from uiser form")
    return () => {
      // setUser("")
    };
  }, [socket]);
  return (
    <div className="user_form">
      <input
        type="text"
        // autoFocus={true}
        onChange={(e) => {
          setUser((prevUser: User) => ({
            ...prevUser,
            name: e.target.value,
          }));
        }}
        value={user.name}
        placeholder="enter your name"
      />
      <button onClick={handleSaveUserForm}>
        <p>save</p>
        <IconBtn icon={LoginIcon} br="50%" color="green" />
      </button>
    </div>
  );
};
