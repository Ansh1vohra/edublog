import React, { useState } from 'react';
import "./Header.css";
import UserIcon from './Images/user.png';
import { Link } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import SideMenu from './UI/SideMenu';

export default function Header() {
    const { userMail } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="p-4 bg- flex justify-between items-center">
            <Link to="/">
                <h1 className='text mx-4 text-2xl font-semibold'>EduBlog</h1>
            </Link>
            {!userMail ? (
                <nav className="flex gap-4 mx-4">
                    <Link to="/login" className="text bg-purple-600 px-4 py-2 rounded hover:bg-purple-700">Login</Link>
                    
                </nav>
            ) : (
                <nav className="flex gap-4 mx-4 items-center">
                    <button onClick={handleMenuToggle}>
                        <img src={UserIcon} alt="UserIcon" width='35px' />
                    </button>
                </nav>
            )}
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    );
}
