import { useState, useEffect } from 'react';
import { Food, Meal } from '../types';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useNavigate, useSearchParams } from 'react-router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import MealCard from './MealCard';
import ModalFormContainer from './ModalFormContainer';
import MealForm from './MealForm';
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

const logMeal = async (newMeal: Meal) => {
  console.log(newMeal);
  const res = await fetch(`${apiUrl}/api/meal/create-meal?meal=${newMeal}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newMeal),
  });
  console.log(JSON.stringify(newMeal));
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
  const [selectedMeal, setSelectedMeal] = useState<Food | null>(null);
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

  function handleLogMealClick(meal: Food) {
    setSelectedMeal(meal);
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
    console.log('Closed dialog.');
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
                  children={
                    <button onClick={() => handleLogMealClick(meal)}>
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
      {formIsOpen && selectedMeal && (
        <ModalFormContainer
          isOpen={formIsOpen}
          onClose={handleDialogClose}
          children={
            <MealForm
              name={selectedMeal.food_name}
              calories={selectedMeal.servings.serving[0].calories}
              carbs={selectedMeal.servings.serving[0].carbohydrate}
              protein={selectedMeal.servings.serving[0].protein}
              fat={selectedMeal.servings.serving[0].protein}
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
