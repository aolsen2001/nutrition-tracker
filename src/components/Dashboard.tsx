import { useState, useEffect } from 'react';
import { Meal } from '../types';
import { Outlet, useNavigate } from 'react-router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import '../styles.css';

interface MealTableProps {
  meals: Meal[];
  onDelete: (id: string | undefined) => void;
}

function MealTable({ meals, onDelete }: MealTableProps) {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Calories</th>
            <th>Protein (g)</th>
            <th>Fat (g)</th>
            <th>Carbs (g)</th>
            <th>Servings</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meals.map((m) => {
            return (
              <tr key={m.meal_id}>
                <td>{m.name}</td>
                <td>{m.calories}</td>
                <td>{m.protein}</td>
                <td>{m.fat}</td>
                <td>{m.carbs}</td>
                <td>{m.servings}</td>
                <td>{new Date(m.date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => onDelete(m.meal_id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const [authLoading, setAuthLoading] = useState<Boolean>(true);
  const queryClient = useQueryClient();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        navigate('/login');
      }
      setAuthLoading(false);
      console.log('Auth loading is false');
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [totalProtein, setTotalProtein] = useState<number>(0);
  const [totalFat, setTotalFat] = useState<number>(0);
  const [totalCarbs, setTotalCarbs] = useState<number>(0);

  // useEffect(() => {
  //   const newTotals = userMeals.reduce(
  //     (acc, meal) => {
  //       acc.calories += meal.calories * meal.servings;
  //       acc.protein += meal.protein * meal.servings;
  //       acc.fat += meal.fat * meal.servings;
  //       acc.carbs += meal.carbs * meal.servings;
  //       return acc;
  //     },
  //     { calories: 0, protein: 0, fat: 0, carbs: 0 }
  //   );
  //   setTotalCalories(newTotals.calories);
  //   setTotalProtein(newTotals.protein);
  //   setTotalFat(newTotals.fat);
  //   setTotalCarbs(newTotals.carbs);
  // }, [userMeals]);

  const [mealFormData, setMealFormData] = useState<
    Omit<Meal, 'meal_id' | 'user_id' | 'date'>
  >({
    name: '',
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    servings: 1,
  });

  // const deleteMeal = (meal_id: number | undefined) => {
  //   if (meal_id === undefined) {
  //     return;
  //   }
  //   const filteredUserMeals = userMeals.filter((m) => m.meal_id !== meal_id);
  //   setUserMeals(filteredUserMeals);
  // };

  // const deleteMeal = async (mealId: string | undefined) => {
  //   if (!mealId) {
  //     console.log('mealId is undefined');
  //   }
  //   const res = await fetch(`${apiUrl}/meals/delete-meal?mealId=${mealId}`, {
  //     method: 'DELETE'
  //   });
  //   if (res.status !== 204) {
  //     console.log(`Failed to delete meal: ${res.statusText}`);
  //   }
  //   console.log(`Successfully deleted meal with id ${mealId}`);
  //   return mealId;
  // };

  const fetchMealsFromUserId = async (userId: string | undefined) => {
    if (!userId) {
      console.log('userId is undefined!');
      return;
    }
    console.log(`Fetching meals for user with userId: ${userId}`);
    const res = await fetch(`${apiUrl}/meals?userId=${userId}`);
    if (!res.ok) throw new Error(`fetchMealsFromUserId failed with code: ${res.status}`);
    const data = await res.json();
    console.log(data);
    return data;
  };

  console.log('query key uid (render):', user?.uid);

  const {data, error, isLoading} = useQuery({
    queryKey: ['dbUserMeals', user?.uid],
    queryFn: async() => fetchMealsFromUserId(user?.uid),
    enabled: !!user?.uid && !authLoading,
  });

  const deleteMealMutation = useMutation({
    mutationFn: async (mealId: string) => {
      const res = await fetch(`${apiUrl}/meals/delete/${mealId}`, {
        method: 'DELETE'
      });
      if (res.status !== 204) {
        console.log(`Failed to delete meal: ${res.statusText}`);
      }
      console.log(`Successfully deleted meal with id ${mealId}`);
      return mealId;
    },
    onMutate: async (mealId: string) => {
      console.log(`User uid in mutate: ${user?.uid}`);
      await queryClient.cancelQueries({ queryKey: ['dbUserMeals', user?.uid]});
      const previousUserMeals = queryClient.getQueryData(['dbUserMeals', user?.uid]) ?? [];
      console.log(previousUserMeals);
      queryClient.setQueryData(['dbUserMeals', user?.uid], (old: Meal[] = []) => old?.filter((meal) => meal.meal_id !== mealId));
      console.log(`Deleted mealId (mutate): ${mealId}`);
      return { previousUserMeals };
    },
    onError: (err, mealId, context) => {
      if (context?.previousUserMeals) {
        queryClient.setQueryData(['dbUserMeals', user?.uid], context.previousUserMeals);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['dbUserMeals', user?.uid]});
    }
  });

  const handleDeleteMeal = (mealId: string | undefined) => {
    if (!mealId) {
      console.warn('Failed to delete meal: mealId is undefined');
      return;
    }
    if (!user?.uid) {
      console.warn('User uid is undefined');
    }
    deleteMealMutation.mutate(mealId);
  }

  // for debugging purposes
  // useEffect(() => {
  //   console.log(userMeals);
  // }, [userMeals]);

  return (
    // <>
    //   {userMeals?.length > 0 ? (
    //     <MealTable meals={userMeals} onDelete={deleteMeal} />
    //   ) : (
    //     <div>No Meals Logged for Today ({new Date().toLocaleDateString()})</div>
    //   )}
    //     <div>
    //   <div>Total Calories: {totalCalories}</div>
    //   <div>Total Protein: {totalProtein}</div>
    //   <div>Total Fat: {totalFat}</div>
    //   <div>Total Carbs: {totalCarbs}</div>
    // </div>
    //   <Outlet />
    // </>
    <>
      {isLoading && <p>Loading...</p>}
      {error && (
        <p style={{ color: 'red' }}>Error: {(error as Error).message}</p>
      )}
      {data?.length > 0 ? (
        <MealTable meals={data} onDelete={handleDeleteMeal}></MealTable>
      ): (<div>No Meals Logged for Today ({new Date().toLocaleDateString()})</div>)}
      <Outlet />
    </>
  );
}

export default Dashboard;
