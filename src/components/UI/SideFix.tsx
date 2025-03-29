import { useUser } from '../../Context/UserContext';
import { useNavigate,Link } from 'react-router-dom';
import "./SideFix.css";

export default function SideFix() {
    const { setUserMail } = useUser();
    const nav = useNavigate();

    const handleLogOut = () => {
        localStorage.setItem("userMail", '');
        setUserMail('');
        nav('/login');
    }; 

    return (
        <div className='sidefix'>
            <nav>
                <ul>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                        <Link to="/postblog">Post a Blog</Link>
                    </li>
                    <li>
                        <Link to="/studymaterial">Study Material</Link>
                    </li>
                    <li>
                        <button onClick={handleLogOut}>Logout</button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}