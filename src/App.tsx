import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import './App.css';

function App() {
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
