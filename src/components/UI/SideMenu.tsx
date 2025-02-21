import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../Context/UserContext';
import './SideMenu.css'; 
import { useNavigate } from 'react-router-dom';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
    const { setUserMail } = useUser();
    const nav = useNavigate();

    const handleLogOut = () => {
        localStorage.setItem("userMail", '');
        setUserMail('');
        nav('/login');
        onClose(); 
    };

    

    return (
        <div className={`sidemenu ${isOpen ? 'open' : ''}`}>
            <button className="close-button" onClick={onClose}>
                &times;
            </button>
            <nav>
                <ul>
                    <li>
                        <Link to="/profile" onClick={onClose}>Profile</Link>
                    </li>
                    <li>
                        <Link to="/postblog" onClick={onClose}>Post a Blog</Link>
                    </li>
                    <li>
                        <button onClick={handleLogOut}>Logout</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default SideMenu;
