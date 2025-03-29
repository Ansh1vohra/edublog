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
                <h1 className='text mx-4 text-2xl font-semibold flex gap-2'>
                    <span className='bg-white rounded text-blue-600 px-2'>MIS</span>
                     Connect</h1>
            </Link>

            {!userMail ? (
                <nav className="flex gap-4 mx-4 items-center">
                    <div className='text-white flex gap-3 middle mx-4'>
                        <Link to="/">Blogs</Link>
                        <Link to="/studymaterial">Study-Material</Link>
                    </div>
                    <Link to="/login" className="text bg-green-600 px-4 py-2 rounded hover:bg-green-700">Login</Link>

                </nav>
            ) : (
                <nav className="flex gap-4 mx-4 items-center">
                    <div className='text-white flex gap-3 middle mx-4'>
                        <Link to="/">Blogs</Link>
                        <Link to="/studymaterial">Study-Material</Link>
                    </div>
                    <button onClick={handleMenuToggle}>
                        <img src={UserIcon} alt="UserIcon" width='35px' />
                    </button>
                </nav>
            )}
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    );
}
