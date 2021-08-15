import { logoutUser } from '../api/auth';
import { useContext } from 'react';
import { UserContext } from '../contexts/userContext';



const ScorePopup = (props) => {
    const {user, setUser, isUserLoggedIn,authRequest} = useContext(UserContext)
    // const logout = () => {
    //     logoutUser()
    //     setUser(null);
    //     props.handleClose()
    // }

    authRequest.get('/quiz/score/')
    .then(res => console.log(res.data))
    .catch(err => console.log(err))


    return ( 
        <div className="popup">
            <div className="popup-box">
                <div className="box">
                    <span className="close-icon" onClick={props.handleClose}>x</span>
                    <h1>Scores</h1>
                    <h2></h2>
                    {/* <button onClick={logout} className="btn">Logout</button> */}
                </div>
            </div>
        </div>
     );
}
 
export default ScorePopup;