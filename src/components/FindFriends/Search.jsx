import React from "react";
import "./Search.css";
import { useContext } from "react";
import { ChatContext } from "../../store/ChatContext";
import { useState } from "react";
import { SocialMediaContext } from "../../store/GeneralStore";
function Search2() {
  const { handleSearchUser } = useContext(SocialMediaContext);
  const { temporaryResult } = useContext(ChatContext);
  const [username, setUserName] = useState("");

  const handleSearch = async () => {
    handleSearchUser(username).then((data) => {
      temporaryResult(data);
    });
  };

  // const handleSearch = async () => {
  // 	if(!username) return;
  //   const q = query(
  //     collection(db, "users"),
  //     where("displayName", "==", username),
  //   );

  //   const q2 = query(
  //     collection(db, "users"),
  //     where("uid", "==", username),
  //   );

  //   try {
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //      temporaryResult(doc.data());
  //     });
  //   } catch (err) {

  //   }

  //   try {
  //     const querySnapshot = await getDocs(q2);
  //     querySnapshot.forEach((doc) => {
  //      temporaryResult(doc.data());
  //     });
  //   } catch (err) {

  //   }
  // };
  return (
    <>
      <div id="search" onClick={handleSearch}>
        <svg viewBox="0 0 420 60" xmlns="http://www.w3.org/2000/svg">
          <rect className="bar" />

          <g className="magnifier">
            <circle className="glass" />
            <line className="handle" x1="32" y1="32" x2="44" y2="44"></line>
          </g>

          <g className="sparks">
            <circle className="spark" />
            <circle className="spark" />
            <circle className="spark" />
          </g>

          <g className="burst pattern-one">
            <circle className="particle circle" />
            <path className="particle triangle" />
            <circle className="particle circle" />
            <path className="particle plus" />
            <rect className="particle rect" />
            <path className="particle triangle" />
          </g>
          <g className="burst pattern-two">
            <path className="particle plus" />
            <circle className="particle circle" />
            <path className="particle triangle" />
            <rect className="particle rect" />
            <circle className="particle circle" />
            <path className="particle plus" />
          </g>
          <g className="burst pattern-three">
            <circle className="particle circle" />
            <rect className="particle rect" />
            <path className="particle plus" />
            <path className="particle triangle" />
            <rect className="particle rect" />
            <path className="particle plus" />
          </g>
        </svg>
        <input
          type="search"
          name="q"
          aria-label="Search for inspiration"
          onChange={(e) => {
            handleSearch();
            setUserName(e.target.value);
          }}
        />
      </div>
    </>
  );
}

export default Search2;
