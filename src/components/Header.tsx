import React, { useState } from 'react';
import "./Header.css";
import Logo from './Images/Logo.png';
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
                <img src={Logo} alt="Logo" width='180px' />
            </Link>
            {!userMail ? (
                <nav className="flex gap-4 mx-4">
                    <Link to="/about" className="text hover:underline">About</Link>
                    <Link to="/login" className="text hover:underline">Login</Link>
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
