// import React from 'react'
// import { useState } from 'react'
// import {Link} from 'react-router-dom'
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// const ChatRoomTemplate = ({id,title,description,audience}) => {
// const [hovered,setHovered]=useState(false)
//     const generateAudiance=()=>{
//         return(
//             audience.map((type)=>{
//                 return(
//               <div  key={type}>{type}</div>
//                 )
//             })
//         )
//     }

// const handleHover=()=>{
// setHovered((prev)=>!prev)
// }

//   return (
//     <div
//       className=" char_room_wrapper"
//       onMouseEnter={handleHover}
//       onMouseLeave={handleHover}
//     >
//       {hovered && (
//         <Link to={`/chat/id=${id}`}>
//           <div className="enter_button">
//             <AddCircleIcon sx={{ fontSize: 30 }} />
//           </div>
//         </Link>
//       )}
//       <h2>{title}</h2>
//       <section>
//         <span>Description</span>
//         <h4>{description}</h4>
//       </section>
//       <div className="audiance_type">{generateAudiance()}</div>
//     </div>
//   );
// }

// export default ChatRoomTemplate