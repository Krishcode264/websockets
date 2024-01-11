import { v4 as uuidv4 } from "uuid";
import {  useState } from "react";
import {  useSetRecoilState } from "recoil";
import { updateUser} from "../../store/selectors/user-selector";
import { showComponentState } from "../../store/atoms/show-component";
export const UserForm: React.FC = () => {
  const [name, setName] = useState("");

  const setUser = useSetRecoilState(updateUser);
  const setShowComponent = useSetRecoilState(showComponentState);


  const handleSaveUserForm = () => {
    if (name === "") {
      return;
    }

    setShowComponent((prev) => ({ ...prev, showform: false ,showWebrtcConnection:true}));
    setUser((prev) => ({ ...prev, name, id: uuidv4() }));
  };

  return (
    <div className="user_form">
      <input
        type="text"
        onChange={(e) => setName(()=> e.target.value)}
        value={name}
        placeholder="enter your name"
      />
      <button onClick={handleSaveUserForm}>join</button>
    </div>
  );
};
