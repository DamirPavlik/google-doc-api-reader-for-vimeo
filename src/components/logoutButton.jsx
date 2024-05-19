import React, { useContext } from 'react'
import {GoogleLogout} from 'react-google-login'
import StatusContext from '../context/statusProvider';

const clientId = import.meta.env.VITE_CLIENT_ID;

const logoutButton = () => {
  const { setStatus } = useContext(StatusContext);

  const onSuccess = () => {
    setStatus("Logged out");
  }

  return (
    <div className='singOutButton'>
      <GoogleLogout
        clientId={clientId}
        buttonText='Logout'
        onLogoutSuccess={onSuccess}
      />
    </div>
  )
}

export default logoutButton