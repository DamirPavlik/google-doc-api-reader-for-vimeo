import React from 'react'
import GoogleLogin from 'react-google-login'

const clientId = import.meta.env.VITE_CLIENT_ID;

const loginButton = () => {
    const onSuccess = (res) => {
        console.log("Login success! Current user: ", res.profileObj);
    }

    const onFailure = () => {
        console.log("Login Failed! res: ", res);
    }

    return (
    <div id='singInButton' className='mr-10'>
        <GoogleLogin
            clientId={clientId}
            buttonText='Login'
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
        />
    </div>
  )
}

export default loginButton