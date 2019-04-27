
import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {
    if (isSignedIn) {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <p onClick={() => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
            </nav>
        );
    } else {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <button onClick={() => onRouteChange('signin')} className='mr4 mt4 br2 signOut shadow-5 pointer'>Sign In</button>
                <button onClick={() => onRouteChange('register')} className='mr4 mt4 br2 signOut shadow-5 pointer'>Register</button>
            </nav>
        );
    }
}

export default Navigation;
