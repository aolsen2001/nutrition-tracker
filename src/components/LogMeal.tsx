import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Food } from '../types';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useNavigate } from 'react-router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import ModalContent from './ModalContent.tsx';
import MealCard from './MealCard';
import '../styles.css';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const fetchMealsFromQuery = async (query: string, pageNumber: number) => {
  const res = await fetch(
    `${apiUrl}/food/search?query=${query}&pageNumber=${pageNumber}`
  );
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
  const [pageNumber, setPageNumber] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [showFormModal, setShowFormModal] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ['meals', submittedQuery, pageNumber],
    queryFn: async () => fetchMealsFromQuery(submittedQuery, pageNumber),
    enabled: submittedQuery.length > 0,
    refetchOnWindowFocus: false,
  });

  function handleSearch() {
    setSubmittedQuery(query);
    setPageNumber(0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  function handlePrevClick() {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  }

  function handleNextClick() {
    // max results per page is 20
    if (pageNumber < Math.ceil(totalResults / 20) - 1) {
      setPageNumber(pageNumber + 1);
    }
  }

  useEffect(() => {
    if (data?.foods_search?.total_results) {
      setTotalResults(data.foods_search.total_results);
    }
    console.log(totalResults);
  }, [data, totalResults]);

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
      {data && (
        <div className='card-container'>
          {data?.foods_search.results &&
          data?.foods_search.results.food.length > 0
            ? data.foods_search.results.food.map((meal: Food) => (
                <MealCard
                  mealName={meal.food_name}
                  calories={meal.servings.serving[0].calories}
                  carbs={meal.servings.serving[0].carbohydrate}
                  protein={meal.servings.serving[0].protein}
                  fat={meal.servings.serving[0].fat}
                  onLogMeal={() => setShowFormModal(true)}
                />
              ))
            : !isLoading &&
              submittedQuery.length > 0 && (
                <p>No meals found for search term "{submittedQuery}".</p>
              )}
          <button onClick={handlePrevClick} disabled={pageNumber <= 0}>
            Prev
          </button>
          <button
            onClick={handleNextClick}
            disabled={pageNumber >= Math.ceil(totalResults / 20) - 1}
          >
            Next
          </button>
        </div>
      )}
      {showFormModal &&
        createPortal(
          <ModalContent onClose={() => setShowFormModal(false)} />,
          document.body
        )}
      <Outlet />
    </>
  );
}

export default LogMeal;
