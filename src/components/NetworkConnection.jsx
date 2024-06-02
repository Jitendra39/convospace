import React, { useState } from 'react'

function NetworkConnection() {


  const [notify, setNotify] = useState('Please check your internet connection and try again.')
  const [status, setStatus] = useState(navigator.onLine);
  const[notificationType,setNotificationType] = useState('error');
  const setOnline = () => setStatus(true);
  const setOffline = () => setStatus(false);

  React.useEffect(() => {
      window.addEventListener('online', setOnline);
      window.addEventListener('offline', setOffline);

      return () => {
          window.removeEventListener('online', setOnline);
          window.removeEventListener('offline', setOffline);
      };
  }, []);

  return (
    <>  
    {!status && ( 
    <Notification notify={notify} 
                   setNotify={setNotify} 
                   notificationType={notificationType}
                   setNotificationType={setNotificationType} />
     ) 
    }
     </>
  )
}

export default NetworkConnection