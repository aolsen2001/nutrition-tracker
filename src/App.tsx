import { StrictMode, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { auth } from './firebase.tsx';
import { onAuthStateChanged, User } from 'firebase/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignUp from './SignUp.tsx';
import Login from './Login.tsx';
import Dashboard from './components/Dashboard.tsx';
import DashboardLayout from './components/DashboardLayout.tsx';
import Landing from './components/Landing.tsx';
import LogMeal from './components/LogMeal.tsx';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const queryClient = new QueryClient();

  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<DashboardLayout user={user} />}>
            <Route index element={<Dashboard />} />
            <Route
              path='/dashboard/logmeal'
              element={
                <QueryClientProvider client={queryClient}>
                  <LogMeal />
                </QueryClientProvider>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}

export default App;
