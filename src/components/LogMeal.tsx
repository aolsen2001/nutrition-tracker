import { useState, useEffect } from 'react';
import { Meal, ApiMeal } from '../types';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useNavigate } from 'react-router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import '../styles.css';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const fetchMealsFromQuery = async (query: string) => {
  const res = await fetch(`${apiUrl}/food/search?query=${query}`);
  if (!res.ok) throw new Error('Failed to fetch foods');
  console.log(res);
  return res.json();
};

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

  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const { data, error, isLoading } = useQuery({
    queryKey: ['meals', submittedQuery],
    queryFn: async () => fetchMealsFromQuery(submittedQuery),
    enabled: submittedQuery.length > 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) console.log(typeof data[0]);
  }, [data]);

  function handleSearch() {
    setSubmittedQuery(query);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <>
      <div>
        This is the log meal page. Search functionality goes here
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>Search</button>
        {isLoading && <p>Loading...</p>}
        {error && (
          <p style={{ color: 'red' }}>Error: {(error as Error).message}</p>
        )}
      </div>
      <ul>
        {data?.length > 0
          ? data?.map((meal: ApiMeal) => <li></li>)
          : !isLoading &&
            submittedQuery.length > 0 && (
              <p>No meals found for search term {query}.</p>
            )}
      </ul>
      <Outlet />
    </>
  );
}

export default LogMeal;
