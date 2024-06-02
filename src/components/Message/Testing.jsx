import React, { useState } from 'react'
import ToastNotification from './Notification';

function Testing() {

  const [notification, setNotification] = useState(false);
  return (
    <>
    <div onClick={() => setNotification(true)}>
      hello
    </div>
  {notification && <ToastNotification message="Hello"  />}
  </>
  )
}

export default Testing