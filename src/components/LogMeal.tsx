import { useState, useEffect } from 'react';
import { Meal } from '../types';
import { Outlet, useNavigate } from 'react-router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import '../styles.css';

function LogMeal() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  return (
    <>
      <div>This is the log meal page. Search functionality goes here.</div>
      <Outlet />
    </>
  );
}

export default LogMeal;
