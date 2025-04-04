import { useState, useEffect } from 'react';
import { Food } from '../types';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useNavigate } from 'react-router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import '../styles.css';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const fetchMealsFromQuery = async (query: string) => {
  const res = await fetch(`${apiUrl}/food/search?query=${query}`);
  if (!res.ok) throw new Error('Failed to fetch foods');
  const data = await res.json();
  return data;
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

  function handleSearch() {
    setSubmittedQuery(query);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  useEffect(() => {
    if (data) console.log(data.foods_search.results.food);
  }, [data]);

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
        {data?.foods_search.results.food.length > 0
          ? data.foods_search.results.food.map((meal: Food) => (
              <li key={meal.food_id}>
                <h3>{meal.food_name}</h3>
                <p>Calories: {meal.servings.serving[0].calories}</p>
                <p>Carbohydrates: {meal.servings.serving[0].carbohydrate}g</p>
                <p>Protein: {meal.servings.serving[0].protein}g</p>
                <p>Fat: {meal.servings.serving[0].fat}g</p>
              </li>
            ))
          : !isLoading &&
            submittedQuery.length > 0 && (
              <p>No meals found for search term "{query}".</p>
            )}
      </ul>
      <Outlet />
    </>
  );
}

export default LogMeal;
