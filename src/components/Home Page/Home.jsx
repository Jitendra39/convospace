import React from 'react'
import PostCard from './PostCard'
import Sidebar from '../Sidebar'
import '../../styles/Home.css'
function Home() {
  return (
     <>
     <div className="Home-container">
      <div className="Home-header">
        <Sidebar/>
      </div>  
      <div className="Home-content">
        
     <PostCard/>
     </div>
     <div className='Recommoded-Friends'>
   
     </div>
     </div>  
     </>
  )
}

export default Home;