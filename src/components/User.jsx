import React, { useContext, useEffect } from 'react';
import { SocialMediaContext } from '../store/GeneralStore';
import { Outlet, useNavigate } from 'react-router-dom';

function User() {
  const navigate = useNavigate();
  const { currentUser } = useContext(SocialMediaContext);

  useEffect(() => {
    if (!currentUser) {
      navigate('/SignUp');
    }
  }, [currentUser, navigate]);  

  return currentUser ? <Outlet /> : null; 
}

export default User;
