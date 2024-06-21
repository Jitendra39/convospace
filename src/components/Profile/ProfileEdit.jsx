import React, { useContext, useState, useRef } from "react";
import "./Profile.css";
import { FaLocationDot } from "react-icons/fa6";
import { BsFillSendFill } from "react-icons/bs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { TiEdit } from "react-icons/ti";
import { SocialMediaContext } from "../../store/GeneralStore";
import { db, storage } from "../../store/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

function ProfileEdit({ setDoneProfile, doneProfile }) {
  const { currentUser } = useContext(SocialMediaContext);
  const inputFileRef = useRef(null);
  const inputNameRef = useRef(null);

  const [newPhoto, setNewPhoto] = useState(null);
  const [tempPhoto, setTempPhoto] = useState(
    "https://t4.ftcdn.net/jpg/05/65/22/41/240_F_565224180_QNRiRQkf9Fw0dKRoZGwUknmmfk51SuSS.jpg"
  );
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(currentUser.displayName);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhotoClick = () => {
    inputFileRef.current.click();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];

    if (file && file.type.includes("image")) {
      setNewPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDoneProfile = async () => {
    if (name === currentUser.displayName && !newPhoto) {
      setDoneProfile(!doneProfile);
    }
    const date = new Date().getTime();
    const storageRef = ref(storage, `${name + date}`);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (newPhoto) {
        const uploadTaskSnapshot = await uploadBytesResumable(
          storageRef,
          newPhoto
        );

        const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
        "downloadURL =", downloadURL;
  
        if (user) {
          updateProfile(user, {
            displayName: name,
            photoURL: downloadURL,
          });
          await updateDoc(doc(db, "users", user.uid), {
            displayName: name,
            photoURL: downloadURL,
          });
          setDoneProfile(!doneProfile);
        }
      } else if (user) {
         updateProfile(user, {
            displayName: name,
          });

          await updateDoc(doc(db, "users", user.uid), {
            displayName: name,
          });

          setDoneProfile(!doneProfile);
        }
      
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <>
      <div className="row py-5 px-4 profile-main">
        <div className="col-xl-4 col-md-6 col-sm-10 mx-auto sub-profile-main">
          <div className="bg-white shadow rounded overflow-hidden">
            <div className="px-4 pt-0 pb-4 bg-dark">
              <div className="media align-items-end profile-header">
                <div className="profile mr-3 Profile-Photo">
                  <img
                    onClick={handlePhotoClick}
                    src={tempPhoto && tempPhoto}
                    alt="Profile"
                    width="130"
                    className="rounded mb-2 img-thumbnail"
                  />
                  <a
                    onClick={handleDoneProfile}
                    className="btn btn-dark btn-sm btn-block"
                  >
                    Done profile
                  </a>
                </div>
                <div className="media-body mb-5 text-white">
                  {!editName ? (
                    <div className="name-edit">
                      <h4 className="mt-0 mb-0">{name}</h4>
                      <h4>
                        <TiEdit onClick={() => setEditName(!editName)} />
                      </h4>
                    </div>
                  ) : (
                    <div className="name-edit2">
                      <input
                        ref={inputNameRef}
                        onChange={handleNameChange}
                        type="text"
                        placeholder="Enter Your Name"
                        value={name}
                      />
                      <h4>
                        <CheckCircleIcon
                          onClick={() => setEditName(!editName)}
                        />
                      </h4>
                    </div>
                  )}
                  <p className="small mb-4 profile-location">
                    <FaLocationDot className="profile-location-icon" />
                    India
                  </p>
                </div>
              </div>
            </div>
            <input
              type="file"
              ref={inputFileRef}
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />
            <div className="bg-light p-4 d-flex justify-content-end text-center">
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <h5 className="font-weight-bold mb-0 d-block send-icon">
                    <BsFillSendFill />
                  </h5>
                  <small className="text-muted">
                    <i className="fa fa-picture-o mr-1"></i>Send
                  </small>
                </li>
                <li className="list-inline-item">
                  <h5 className="font-weight-bold mb-0 d-block">241</h5>
                  <small className="text-muted">
                    {" "}
                    <i className="fa fa-picture-o mr-1"></i>Photos
                  </small>
                </li>
                <li className="list-inline-item">
                  <h5 className="font-weight-bold mb-0 d-block">84K</h5>
                  <small className="text-muted">
                    {" "}
                    <i className="fa fa-user-circle-o mr-1"></i>Followers
                  </small>
                </li>
              </ul>
            </div>
            <div className="py-4 px-4">
              <div className="py-4">
                <h5 className="mb-3">Recent posts</h5>
                <div className="p-4 bg-light rounded shadow-sm">
                  <p className="font-italic mb-0"> Not Available </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileEdit;
