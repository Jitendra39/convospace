import React from 'react'
import './Search.css'
import { useContext } from 'react'
import { ChatContext } from '../../store/ChatContext'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../store/firebaseConfig';
import { useState } from 'react';
function Search2() {

	const {temporaryResult} = useContext(ChatContext);
  const [username, setUserName] = useState("");
	const handleSearch = async () => {
		if(!username) return;
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username),
    );
 
    const q2 = query(
      collection(db, "users"),
      where("uid", "==", username),
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
       temporaryResult(doc.data());
      });
    } catch (err) {
     
    }

    try {
      const querySnapshot = await getDocs(q2);
      querySnapshot.forEach((doc) => {
       temporaryResult(doc.data());
      });
    } catch (err) {
       
    }
  };
  return (
   <>
   
<div id="search" onClick={handleSearch}>
	<svg viewBox="0 0 420 60" xmlns="http://www.w3.org/2000/svg">
		<rect class="bar" />
		
		<g class="magnifier" >
			<circle class="glass" />
			<line class="handle" x1="32" y1="32" x2="44" y2="44"></line>
		</g>

		<g class="sparks">
			<circle class="spark"/>
			<circle class="spark"/>
			<circle class="spark"/>
		</g>

		<g class="burst pattern-one">
			<circle class="particle circle"/>
			<path class="particle triangle"/>
			<circle class="particle circle"/>
			<path class="particle plus"/>
			<rect class="particle rect"/>
			<path class="particle triangle"/>
		</g>
		<g class="burst pattern-two">
			<path class="particle plus"/>
			<circle class="particle circle"/>
			<path class="particle triangle"/>
			<rect class="particle rect"/>
			<circle class="particle circle"/>
			<path class="particle plus"/>
		</g>
		<g class="burst pattern-three">
			<circle class="particle circle"/>
			<rect class="particle rect"/>
			<path class="particle plus"/>
			<path class="particle triangle"/>
			<rect class="particle rect"/>
			<path class="particle plus"/>
		</g>
	</svg>
	<input type="search" name="q" aria-label="Search for inspiration" onChange={(e) => {
		handleSearch();
		setUserName(e.target.value);
	}}/>
</div>

   </>
  )
}

export default Search2