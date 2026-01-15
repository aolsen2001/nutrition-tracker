import { useState, useEffect } from 'react';
import { Food, Meal } from '../types';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useNavigate, useSearchParams } from 'react-router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import FoodCard from './FoodCard';
import ModalFormContainer from './ModalFormContainer';
import MealForm from './MealForm';
import '../styles.css';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const fetchMealsFromQuery = async (query: string, pageNumber: number) => {
  const res = await fetch(
    `${apiUrl}/foods/search?query=${query}&pageNumber=${pageNumber}`
  );
  if (!res.ok) throw new Error('Failed to fetch foods');
  const data = await res.json();
  return data;
};

const logMeal = async (newMeal: Meal) => {
  console.log(JSON.stringify(newMeal));
  const res = await fetch(`${apiUrl}/meals/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newMeal),
  });
  if (!res.ok) throw new Error('Failed to log meal');
  const data = await res.json();
  console.log(`Successfully posted meal with ID: ${data.meal_id}`);
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

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('query');
  const pageParam = searchParams.get('pageNumber');
  // validate that the page number from the URL parameters is a valid number and is not negative
  const urlPageNumber =
    pageParam && !isNaN(Number(pageParam)) && Number(pageParam) >= 0
      ? Number(pageParam)
      : 0;

  const [query, setQuery] = useState(queryParam ? queryParam : '');
  const [submittedQuery, setSubmittedQuery] = useState(
    queryParam ? queryParam : ''
  );
  const [pageNumber, setPageNumber] = useState(urlPageNumber);
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [mealToLog, setMealToLog] = useState<Meal>({
      name: '',
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      servings: 1,
      date: new Date()
    });
  const [totalResults, setTotalResults] = useState(0);

  const { data, error, isLoading } = useQuery({
    queryKey: ['meals', submittedQuery, pageNumber],
    queryFn: async () => fetchMealsFromQuery(submittedQuery, pageNumber),
    enabled: submittedQuery.length > 0,
    refetchOnWindowFocus: false,
  });

  function handleSearch() {
    setSubmittedQuery(query);
    setPageNumber(0);
    setSearchParams({ query: query, pageNumber: String(0) });
  }

  function handleFormSubmit(
    e: React.FormEvent<HTMLFormElement>,
    isNewMeal: boolean,
    newMeal: Meal
  ) {
    e.preventDefault();
    newMeal.user_id = user?.uid;
    logMeal(newMeal);
    setFormIsOpen(false);
  }

  function handleLogMealClick(apiFoodItem: Food | null) {
    const meal: Meal = {
      name: apiFoodItem?.food_name ?? '',
      calories: apiFoodItem?.servings?.serving[0]?.calories ?? 0,
      protein: apiFoodItem?.servings?.serving[0]?.protein ?? 0,
      fat: apiFoodItem?.servings?.serving[0]?.fat ?? 0,
      carbs: apiFoodItem?.servings?.serving[0]?.carbohydrate ?? 0,
      servings: 1,
      date: new Date()
    }
    setMealToLog(meal);
    setFormIsOpen(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  function handlePrevClick() {
    if (pageNumber > 0) {
      const prevPageNumber = pageNumber - 1;
      setPageNumber(prevPageNumber);
      setSearchParams({
        query: submittedQuery,
        pageNumber: String(prevPageNumber),
      });
    }
  }

  function handleNextClick() {
    // max results per page is 20
    if (pageNumber < Math.ceil(totalResults / 20) - 1) {
      const nextPageNumber = pageNumber + 1;
      setPageNumber(nextPageNumber);
      setSearchParams({
        query: submittedQuery,
        pageNumber: String(nextPageNumber),
      });
    }
  }

  function handleDialogClose() {
    setFormIsOpen(false);
  }

  useEffect(() => {
    if (data?.foods_search?.total_results) {
      setTotalResults(data.foods_search.total_results);
    }
    console.log(totalResults);
  }, [data, totalResults]);

  return (
    <>
      <div className='flex-column'>
        Search for a meal
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>Search</button>
        OR
        Log your own
        <button onClick={() => handleLogMealClick(null)}>Log Meal</button>
        {isLoading && <p>Loading...</p>}
        {error && (
          <p style={{ color: 'red' }}>Error: {(error as Error).message}</p>
        )}
      </div>
      {data && (
        <div className='card-container'>
          {data?.foods_search.results &&
          data?.foods_search.results.food.length > 0
            ? data.foods_search.results.food.map((apiFoodItem: Food) => (
                <FoodCard
                  food={apiFoodItem}
                  children={
                    <button onClick={() => handleLogMealClick(apiFoodItem)}>
                      Log Meal
                    </button>
                  }
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
      {formIsOpen && (
        <ModalFormContainer
          isOpen={formIsOpen}
          onClose={handleDialogClose}
          children={
            <MealForm
              mealToLog={mealToLog}
              isNewMeal={true}
              onFormSubmit={handleFormSubmit}
            />
          }
        />
      )}
      <Outlet />
    </>
  );
}

export default LogMeal;
