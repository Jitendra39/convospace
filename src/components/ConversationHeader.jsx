import React, { useContext, useEffect } from 'react'
import { ChatContext } from '../store/ChatContext';
import { MdPhone } from 'react-icons/md';
import { IoVideocamOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { SocialMediaContext } from '../store/LogicStore';
import { FieldValue, arrayRemove, deleteDoc, deleteField, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../store/firebaseConfig';

function ConversationHeader({setShowConversation}) {
    const navigate = useNavigate();
    const {data} = useContext(ChatContext);
    const {currentUser} = useContext(SocialMediaContext);
    useEffect(() => {
        {console.log("data=",data.user)}
     },[data])

     
     const handleDelete = async () => {
        console.log("data=", data);
        if (data.user.uid) {
            const chatDocRef = doc(db, "userChats", currentUser.uid);
            const chatDocSnap = await getDoc(chatDocRef);
            const chatDocRef2 = doc(db, "userChats", data.user.uid)
            const chatDocSnap2 = await getDoc(chatDocRef2)
            if (chatDocSnap.exists()) {
                const chatData = chatDocSnap.data();
                const chatIdToDelete = data.chatId;
                const chatData2 = chatDocSnap2.data();
                await updateDoc(chatDocRef2, {
                    [chatIdToDelete]: deleteField()
                })

                await updateDoc(chatDocRef, {
                    [chatIdToDelete]: deleteField()
                });

                // Optionally delete the chat document from "chats" collection
                await deleteDoc(doc(db, "chats", chatIdToDelete));
                await deleteDoc(chatDocRef2)
                navigate('/');
            } else {
                console.log("No chat document found");
            }
        }
    };

  return (
   <>
   
       <div class="conversation-top">
                        <button type="button" class="conversation-back" onClick={() =>{ setShowConversation(true)}} ><IoArrowBackCircleOutline style={{fontSize: '2rem'}}/></button>
                        <div class="conversation-user">
                            <img class="conversation-user-image" src={data.user.photoURL} alt=""/>
                            <div>
                                <div class="conversation-user-name">{data.user.displayName}</div>
                                {/* <div class="conversation-user-status online">online</div> */}
                            </div>
                        </div>
                        <div class="conversation-buttons">
                            <button type="button"><MdPhone className='conversation-buttons-name'/></button>
                            <button type="button"><IoVideocamOutline className='conversation-buttons-name' /></button>
                            <button type="button"><MdDeleteForever className='conversation-buttons-name' onClick={handleDelete}/></button>
                           
                        </div>
                    </div>
   </>
  )
}

export default ConversationHeader;