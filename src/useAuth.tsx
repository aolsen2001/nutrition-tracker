import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { User } from 'firebase/auth';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const userChange = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => userChange();
  }, []);

  return currentUser;
};

export default useAuth;
