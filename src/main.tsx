import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { auth } from './firebase.tsx';
import { onAuthStateChanged, User } from 'firebase/auth';
import SignUp from './SignUp.tsx';
import Login from './Login.tsx';
import Dashboard from './components/Dashboard.tsx';
import DashboardLayout from './components/DashboardLayout.tsx';
import Landing from './components/Landing.tsx';
import LogMeal from './components/LogMeal.tsx';

function Main() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<DashboardLayout user={user} />}>
            <Route index element={<Dashboard />} />
            <Route path='/dashboard/logmeal' element={<LogMeal />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Main />);
