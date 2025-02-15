import React from 'react';
import "./Header.css";
import Logo from './Images/Logo.png';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="p-4 bg- flex justify-between items-center">
            {/* Use Link instead of Route */}
            <Link to="/">
                {/* <h1 className="text-[1.5rem] font-semibold">Edublog</h1> */}
                <img src={Logo} alt="Logo" width='180px' />
            </Link>

            <nav className="flex gap-4 mx-4">
                <Link to="/about" className="text hover:underline">About</Link>
                <Link to="/blogs" className="text hover:underline">Blogs</Link>
                <Link to="/login" className="text hover:underline">Login</Link>
            </nav>
        </header>
    );
}
