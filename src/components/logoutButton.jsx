import React from 'react'
import {GoogleLogout} from 'react-google-login'

const clientId = import.meta.env.VITE_CLIENT_ID;
const logoutButton = () => {
  const onSuccess = () => {
    console.log("logout success!")
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