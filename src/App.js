import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { Routes, Route } from 'react-router';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
