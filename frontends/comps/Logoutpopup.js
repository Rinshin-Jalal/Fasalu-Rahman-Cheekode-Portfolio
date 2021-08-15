import { logoutUser } from '../api/auth';
import { useContext } from 'react';
import { UserContext } from '../contexts/userContext';

const LogoutPopup = (props) => {
    const {user, setUser, isUserLoggedIn} = useContext(UserContext)
    const logout = () => {
        logoutUser()
        setUser(null);
        props.handleClose()
    }

    return ( 
        <div className="popup">
            <div className="popup-box">
                <div className="box">
                    <span className="close-icon" onClick={props.handleClose}>x</span>
                    <h1>Logout</h1>
                    <h2>Do you really want to Logout</h2>
                    <button onClick={logout} className="btn">Logout</button>
                </div>
            </div>
        </div>
     );
}
 
export default LogoutPopup;