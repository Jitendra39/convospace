import React from 'react'
import Search2 from './Search'
import './FindFriends.css'
import FriendList from './FriendList'
import Sidebar from '../Sidebar'
import { SocialMediaContextProvider } from '../../store/GeneralStore'
function FindFriends() {
  return (
    <>
        <SocialMediaContextProvider> 
    <Sidebar/>
    <div className='find-friend-main'>
       <div className='search-component'>
       <Search2/>
       </div>
       <div className='friend-list'>
              <FriendList/>
       </div>
    </div>
    </SocialMediaContextProvider> 
    </>
  )
}

export default FindFriends