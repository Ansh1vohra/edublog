import React from 'react';
import './App.css';
import { Routes, Route} from 'react-router-dom';
import { UserProvider } from './Context/UserContext';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import CreatePost from './components/CreatePost';
import SingleBlog from './components/SingleBlog';
import NotFound from './components/NotFound';

function App() {
  return (
    <UserProvider>
      <div className='mainContent h-screen bg-[#FFF9EF]'>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/postblog' element={<CreatePost />} />
            <Route path="/blog/:id" element={<SingleBlog />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
