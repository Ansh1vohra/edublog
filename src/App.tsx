import React from 'react';
import './App.css';
import { Routes, Route} from 'react-router-dom';
import { UserProvider } from './Context/UserContext';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import CreatePost from './components/CreatePost';
import SingleBlog from './components/SingleBlog';
import StudyMaterials from './components/StudyMaterials';
import Profile from './components/Profile';
import About from './components/About';
import Footer from './components/Footer';
import NotFound from './components/NotFound';

function App() {
  return (
    <UserProvider>
      <div className='mainContent'>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/postblog' element={<CreatePost />} />
            <Route path="/blog/:id" element={<SingleBlog />} />
            <Route path='/studymaterial' element={<StudyMaterials />} />
            <Route path='/about' element={<About />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
          <Footer />
      </div>
    </UserProvider>
  );
}

export default App;
