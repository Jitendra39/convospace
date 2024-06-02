import React, { useContext, useState } from 'react'
import './Profile.css'
import { FaLocationDot } from "react-icons/fa6";
import { BsFillSendFill } from "react-icons/bs";
import Sidebar from '../Sidebar';
import { SocialMediaContext } from '../../store/LogicStore';
import ProfileEdit from './ProfileEdit';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
 const [doneProfile, setDoneProfile] = useState(false);
    const {currentUser} = useContext(SocialMediaContext);


  return (
   <>


    <Sidebar/>
{!doneProfile ? (
<div className="row py-5 px-4 ">
    <div className="col-xl-4 col-md-6 col-sm-10 mx-auto profile-main">

        {/* <!-- Profile widget --> */}
        <div className="bg-white shadow rounded overflow-hidden">
            <div className="px-4 pt-0 pb-4 bg-dark">
                <div className="media align-items-end profile-header">
                    <div className="profile mr-3 Profile-Photo">
                      <img src={currentUser.photoURL ? currentUser.photoURL : "https://bootstrapious.com/i/snippets/sn-profile/teacher.jpg"} alt=".." width="130" className="rounded mb-/2 img-thumbnail"/>
                      <a onClick={() => setDoneProfile(!doneProfile)} className="btn btn-dark btn-sm btn-block">Edit profile</a>
                      </div>
                    <div className="media-body mb-5 text-white">
                        <h4 className="mt-0 mb-0">{currentUser.displayName}</h4>
                        <p className="small mb-4 profile-locaton"> <FaLocationDot className="profile-location-icon"/>India</p>
                    </div>
                </div>
            </div>

            <div className="bg-light p-4 d-flex justify-content-end text-center">
                <ul className="list-inline mb-0">
                <li className="list-inline-item">
                      
                      <h5 className="font-weight-bold mb-0 d-block send-Icon"><BsFillSendFill /></h5>
                      <small className="text-muted"> 
                      <i className="fa fa-picture-o mr-1"></i>Send
                      </small>
                  </li>
                    <li className="list-inline-item">

                        <h5 className="font-weight-bold mb-0 d-block">241</h5><small className="text-muted"> <i className="fa fa-picture-o mr-1"></i>Photos</small>
                    </li>
                    <li className="list-inline-item">
                        <h5 className="font-weight-bold mb-0 d-block">84K</h5><small className="text-muted"> <i className="fa fa-user-circle-o mr-1"></i>Followers</small>
                    </li>
                </ul>
            </div>

            <div className="py-4 px-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="mb-0">Recent photos</h5><a href="#" className="btn btn-link text-muted">Show all</a>
                </div>
                {/* <div className="row">
                    {/* <div className="col-lg-6 mb-2 pr-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-3.jpg" alt="" className="img-fluid rounded shadow-sm"/></div>
                    <div className="col-lg-6 mb-2 pl-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-4.jpg" alt="" className="img-fluid rounded shadow-sm"/></div>
                    <div className="col-lg-6 pr-lg-1 mb-2"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-5.jpg" alt="" className="img-fluid rounded shadow-sm"/></div>
                    <div className="col-lg-6 pl-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-6.jpg" alt="" className="img-fluid rounded shadow-sm"/></div> 
                    Not Available
                </div> */}
                <div className='image-not-available'>
                  Image Not Available
                </div>
                <div className="py-4">
                    <h5 className="mb-3">Recent posts</h5>
                    <div className="p-4 bg-light rounded shadow-sm">
                        <p className="font-italic mb-0"> Not Available </p>
                        {/* <ul className="list-inline small text-muted mt-3 mb-0">
                            <li className="list-inline-item"><i className="fa fa-comment-o mr-2"></i>12 Comments</li>
                            <li className="list-inline-item"><i className="fa fa-heart-o mr-2"></i>200 Likes</li>
                        </ul> */}
                    </div>
                </div>
            </div>
          </div>
        {/* End profile widget  */}

    </div>
</div>
):(
    <ProfileEdit doneProfile={doneProfile} setDoneProfile={setDoneProfile} />
)}
   </>
  )
}

export default Profile