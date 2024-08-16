import axios from "axios";
import { useState } from "react";
import io from "socket.io-client";
import Swal from "sweetalert2";
const server = "https://groupserver-draq.onrender.com";

const socket = io("https://groupserver-draq.onrender.com", {
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("connect_error", (error) => {
  console.error("Connection Error:", error);
});

socket.on("connect_timeout", (timeout) => {
  console.error("Connection Timeout:", timeout);
});

let selectedFriends = {};

// Function to join a room
const joinRoom = (username, room) => {
  socket.emit("joinRoom", { username, room });
};

// Function to handle group name input
const handleGroupName = (setGroupName) => {
  Swal.fire({
    title: "Enter Group Name",
    input: "text",
    showCancelButton: true,
    confirmButtonText: "Create",
  }).then((result) => {
    if (result.isConfirmed) {
      setGroupName(result.value);
      joinRoom("HI new GP", result.value);
    }
  });
};

// Function to handle selection of friends
const handleSelectFriends = (name, photoURL, uid) => {
  if (!selectedFriends[uid]) {
    selectedFriends[uid] = { name, photoURL, uid };
  } else {
    delete selectedFriends[uid];
  }
};

// Function to handle group creation
const handleCreateGroup = async (
  setFetchRender,
  groupName,
  setLoadingSpinner,
  setGroupName,
  currentUser,
  addGpId,
  setAddMemberGpId
) => {
  const name = currentUser.displayName;
  const photoURL = currentUser.photoURL;
  const uid = currentUser.uid;
  let createGpRes;
  setLoadingSpinner(true);

  if (!addGpId) {
    selectedFriends[currentUser.uid] = { name, photoURL, uid };
  }

  // Emit createGroup event with selected friends and group details
  try {
    createGpRes = await axios.post(`${server}/api/createGp/`, {
      selectedFriends,
      groupName,
      uid,
      addGpId,
    });
  } catch (err) {
    console.log(err);
  }

  // Clear selectedFriends after creating the group
  selectedFriends = {};

  if (createGpRes) {
    setLoadingSpinner(false);
    setGroupName("");
    setAddMemberGpId("");
    // Clear selectedFriends after receiving new group data
    selectedFriends = {};
    setFetchRender(true);
  }
};

// Function to get group data
const handleGetGroupsData = async (uid) => {
  try {
    const response = await axios.get(`${server}/api/members/${uid}`);
    return response.data;
  } catch (err) {
    // Handle error
  }
};

// Function to handle sending a message
const handleSendMessage = (text, data, uid, photoURL) => {
  const room = data.groupUser.groupName;
  const date = Date.now();
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const groupId = data.groupUser._id;
  const member = data.groupUser.members.find((value) => value.uid === uid);
  const senderId = member ? member.uid : null;

  socket.emit("sendMessage", {
    text,
    room,
    groupId,
    senderId,
    date,
    time,
    photoURL,
  });
};

// Function to receive messages
// const receiveMessage = (setMessages) => {
//   socket.on("newMessage", (messageData) => {
//     setMessages((preData) => [...preData, messageData]);
//   });
// };

// Function to fetch messages from server
const fetchMessage = async (groupId) => {
  try {
    const response = await axios.get(`${server}/api/groupMessages/${groupId}`);
    return response.data;
  } catch (err) {}
};

// Function to delete a message
const deleteMessage = (dates, groupId) => {
  socket.emit("deleteMessage", { dates, groupId });
};

/// Exit User from Specific group

const ExitGroup = async (gpName, gpId, id) => {
  try {
    const response = await axios.post(`${server}/api/deleteGpMember/`, {
      gpName,
      gpId,
      id,
    });
  } catch (error) {}
};

export {
  joinRoom,
  handleSelectFriends,
  handleCreateGroup,
  handleGroupName,
  handleGetGroupsData,
  handleSendMessage,
  socket,
  fetchMessage,
  deleteMessage,
  ExitGroup,
};

////----- /////
// socket.emit("createGroup", {
//   selectedFriends,
//   groupName,
//   uid,
//   addGpId,
// });

// import axios from "axios";
// import io from "socket.io-client";
// import Swal from "sweetalert2";

// const socket = io("https://groupserver-draq.onrender.com", {
//   transports: ["websocket", "polling"],
// });

// socket.on("connect", () => {
//   console.log("Connected to server");
// });

// socket.on("disconnect", () => {
//   console.log("Disconnected from server");
// });

// socket.on("connect_error", (error) => {
//   console.error("Connection Error:", error);
// });

// socket.on("connect_timeout", (timeout) => {
//   console.error("Connection Timeout:", timeout);
// });

// const joinRoom = (username, room) => {
//   socket.emit("joinRoom", { username, room });
// };

// const handleGroupName = (setGroupName) => {
//   Swal.fire({
//     title: "Enter Group Name",
//     input: "text",
//     showCancelButton: true,
//     confirmButtonText: "Create",
//   }).then((result) => {
//     if (result.isConfirmed) {
//       setGroupName(result.value);
//       joinRoom("HI new GP", result.value);
//     }
//   });
// };

// const handleSelectFriends = (name, photoURL, uid) => {
//   if (!selectedFriends[uid]) {
//     selectedFriends[uid] = { name, photoURL, uid };
//   } else {
//     delete selectedFriends[uid];
//   }
// };

// const handleCreateGroup = async (
//   setFetchRender,
//   groupName,
//   setLoadingSpinner,
//   setGroupName,
//   currentUser,
//   addGpId,
//   setAddMemberGpId
// ) => {
//   const name = currentUser.displayName;
//   const photoURL = currentUser.photoURL;
//   const uid = currentUser.uid;
//   let createGpRes;
//   setLoadingSpinner(true);

//   if (!addGpId) {
//     selectedFriends[currentUser.uid] = { name, photoURL, uid };
//   }

//   try {
//     createGpRes = await axios.post(`${server}/api/createGp/`, {
//       selectedFriends,
//       groupName,
//       uid,
//       addGpId,
//     });
//   } catch (err) {
//     console.log(err);
//   }

//   selectedFriends = {};

//   if (createGpRes) {
//     setLoadingSpinner(false);
//     setGroupName("");
//     setAddMemberGpId("");
//     setFetchRender(true);
//   }
// };

// const handleGetGroupsData = async (uid) => {
//   try {
//     const response = await axios.get(`${server}/api/members/${uid}`);
//     return response.data;
//   } catch (err) {
//     console.error(err);
//   }
// };

// const handleSendMessage = (text, data, uid, photoURL) => {
//   const room = data.groupUser.groupName;
//   const date = Date.now();
//   const time = new Date().toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
//   const groupId = data.groupUser._id;
//   const member = data.groupUser.members.find((value) => value.uid === uid);
//   const senderId = member ? member.uid : null;

//   socket.emit("sendMessage", {
//     text,
//     room,
//     groupId,
//     senderId,
//     date,
//     time,
//     photoURL,
//   });
// };

// const fetchMessage = async (groupId) => {
//   try {
//     const response = await axios.get(`${server}/api/groupMessages/${groupId}`);
//     return response.data;
//   } catch (err) {
//     console.error(err);
//   }
// };

// const deleteMessage = (dates, groupId) => {
//   socket.emit("deleteMessage", { dates, groupId });
// };

// const ExitGroup = async (gpName, gpId, id) => {
//   try {
//     await axios.post(`${server}/api/deleteGpMember/`, {
//       gpName,
//       gpId,
//       id,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

// export {
//   joinRoom,
//   handleSelectFriends,
//   handleCreateGroup,
//   handleGroupName,
//   handleGetGroupsData,
//   handleSendMessage,
//   socket,
//   fetchMessage,
//   deleteMessage,
//   ExitGroup,
// };
