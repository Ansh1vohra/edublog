import './App.css';
import { Routes, Route} from 'react-router-dom';
import Header from './components/Header.tsx';
import Home from './components/Home.tsx';
import Login from './components/Login.tsx';

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
