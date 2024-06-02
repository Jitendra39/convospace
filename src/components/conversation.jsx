import React, { useState } from 'react'
import "../index.css"
import ConversationHeader from './ConversationHeader'
function Conversation() {
 const [text, setText] = useState("");
 const [img, setImg] = useState(null);


  return (<>
   <div  class="conversation " id="conversation-1">
        <ConversationHeader/>

        <div class="conversation-main">
               
                        <ul class="conversation-wrapper">
                            <div class="coversation-divider"><span>Today</span></div>
                            <li class="conversation-item me">
                                <div class="conversation-item-side">
                                    <img class="conversation-item-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt=""/>
                                </div>
                                <div class="conversation-item-content">
                                    <div class="conversation-item-wrapper">
                                        <div class="conversation-item-box">
                                           
                                            <div class="conversation-item-dropdown">
                                                <button type="button" class="conversation-item-dropdown-toggle"><i class="ri-more-2-line"></i></button>
                                                <ul class="conversation-item-dropdown-list">
                                                    <li><a href="#"><i class="ri-share-forward-line"></i> Forward</a></li>
                                                    <li><a href="#"><i class="ri-delete-bin-line"></i> Delete</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="conversation-item-wrapper">
                                        <div class="conversation-item-box">
                                            <div class="conversation-item-text">
                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, tenetur!</p>
                                                <div class="conversation-item-time">12:30</div>
                                            </div>
                                            <div class="conversation-item-dropdown">
                                                <button type="button" class="conversation-item-dropdown-toggle"><i class="ri-more-2-line"></i></button>
                                                <ul class="conversation-item-dropdown-list">
                                                    <li><a href="#"><i class="ri-share-forward-line"></i> Forward</a></li>
                                                    <li><a href="#"><i class="ri-delete-bin-line"></i> Delete</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li class="conversation-item">
                                <div class="conversation-item-side">
                                    <img class="conversation-item-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt=""/>
                                </div>
                                <div class="conversation-item-content">
                                    
                                  
                                    <div class="conversation-item-wrapper">
                                        <div class="conversation-item-box">
                                           
                                            <div class="conversation-item-text">
                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint, debitis. Iste natus est aliquam ipsum doloremque fugiat, quidem eos autem? Dolor quisquam laboriosam enim cum laborum suscipit perferendis adipisci praesentium.</p>
                                                <div class="conversation-item-time">12:30</div>
                                            </div>
                                            
                                            <div class="conversation-item-dropdown">
                                                <button type="button" class="conversation-item-dropdown-toggle">.....</button>
                                                <ul class="conversation-item-dropdown-list">
                                                    <li><a href="#"><i class="ri-share-forward-line"></i> Forward</a></li>
                                                    <li><a href="#"><i class="ri-delete-bin-line"></i> Delete</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </li>
                            <li class="conversation-item">
                                <div class="conversation-item-side">
                                    <img class="conversation-item-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt=""/>
                                </div>
                                <div class="conversation-item-content">
                                    
                                  
                                    <div class="conversation-item-wrapper">
                                        <div class="conversation-item-box">
                                           
                                            <div class="conversation-item-text">
                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint, debitis. Iste natus est aliquam ipsum doloremque fugiat, quidem eos autem? Dolor quisquam laboriosam enim cum laborum suscipit perferendis adipisci praesentium.</p>
                                                <div class="conversation-item-time">12:30</div>
                                            </div>
                                            
                                            <div class="conversation-item-dropdown active">
                                                <button type="button" class="conversation-item-dropdown-toggle">.....</button>
                                                <ul class="conversation-item-dropdown-list">
                                                    <li><a href="#"><i class="ri-share-forward-line"></i> Forward</a></li>
                                                    <li><a href="#"><i class="ri-delete-bin-line"></i> Delete</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </li>
                           
                        </ul>
                    </div>
                  
                    <div class="conversation-form">
                        <button type="button" class="conversation-form-button"><i class="ri-emotion-line"></i></button>
                        <div class="conversation-form-group">
                            <textarea class="conversation-form-input" rows="1" placeholder="Type here..."></textarea>
                            <input type="file" style={{display: "none"}}  id='file'/>
                            <button type="button" class="conversation-form-record"><i class="ri-mic-line"></i></button>
                           
                        </div>
                        <button type="button" class="conversation-form-button conversation-form-submit"><i class="ri-send-plane-2-line"></i></button>
                    </div>
              



                </div>
              
                  
      
      </>
  )
}

export default Conversation;