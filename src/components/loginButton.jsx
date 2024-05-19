import React, { useContext } from 'react'
import GoogleLogin from 'react-google-login'
import StatusContext from '../context/statusProvider';

const clientId = import.meta.env.VITE_CLIENT_ID;

const loginButton = () => {
    const { setStatus } = useContext(StatusContext);

    const onSuccess = (res) => {
        console.log("Login success! Current user: ", res.profileObj);
        setStatus("Logged In");
    };

    const onFailure = (res) => {
        console.log("Login Failed! res: ", res);
        setStatus("Logged out");
    };

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