import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import { useState } from 'react';
import './App.css';

function App() {
  const [userMail, setUserMail] = useState<string>("");
  return (
    <div className='mainContent h-screen bg-[#FFF9EF]'>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/login' element={<Login />} />
        </Routes>
    </div>
  );
}

export default App;
