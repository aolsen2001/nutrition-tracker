import { useState, useEffect } from 'react';
import { Meal } from '../types';
import { Outlet, useNavigate } from 'react-router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import '../styles.css';

interface MealTableProps {
  meals: Meal[];
  onDelete: (id: number) => void;
}

function MealTable({ meals, onDelete }: MealTableProps) {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
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
                <td>{m.user_id}</td>
                <td>{m.name}</td>
                <td>{m.calories}</td>
                <td>{m.protein}</td>
                <td>{m.fat}</td>
                <td>{m.carbs}</td>
                <td>{m.servings}</td>
                <td>{m.date.toLocaleDateString()}</td>
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

  const meals: Meal[] = [
    {
      meal_id: 1,
      user_id: '1',
      name: 'Chicken Breast',
      calories: 300,
      protein: 30,
      fat: 5,
      carbs: 10,
      servings: 1,
      date: new Date(),
    },
    {
      meal_id: 2,
      user_id: '2',
      name: 'Greek Yogurt',
      calories: 200,
      protein: 15,
      fat: 5,
      carbs: 10,
      servings: 2,
      date: new Date(),
    },
    {
      meal_id: 3,
      user_id: '3',
      name: 'Cheeseburger',
      calories: 500,
      protein: 22,
      fat: 5,
      carbs: 10,
      servings: 1,
      date: new Date(),
    },
    {
      meal_id: 4,
      user_id: '4',
      name: 'Mixed Nuts',
      calories: 200,
      protein: 12,
      fat: 5,
      carbs: 10,
      servings: 3,
      date: new Date(),
    },
    {
      meal_id: 5,
      user_id: '5',
      name: 'Protein Shake',
      calories: 400,
      protein: 40,
      fat: 5,
      carbs: 10,
      servings: 1,
      date: new Date(),
    },
  ];

  const [userMeals, setUserMeals] = useState<Meal[]>(meals);
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [totalProtein, setTotalProtein] = useState<number>(0);
  const [totalFat, setTotalFat] = useState<number>(0);
  const [totalCarbs, setTotalCarbs] = useState<number>(0);

  useEffect(() => {
    const newTotals = userMeals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories * meal.servings;
        acc.protein += meal.protein * meal.servings;
        acc.fat += meal.fat * meal.servings;
        acc.carbs += meal.carbs * meal.servings;
        return acc;
      },
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
    setTotalCalories(newTotals.calories);
    setTotalProtein(newTotals.protein);
    setTotalFat(newTotals.fat);
    setTotalCarbs(newTotals.carbs);
  }, [userMeals]);

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

  const deleteMeal = (meal_id: number) => {
    const filteredUserMeals = userMeals.filter((m) => m.meal_id !== meal_id);
    setUserMeals(filteredUserMeals);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMealFormData((prev) => ({
      ...prev,
      [name]: Number(value) || value,
    }));
  };

  const addNewMeal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newMeal: Meal = {
      meal_id: userMeals.length + 1,
      user_id: user?.uid ?? '',
      date: new Date(),
      ...mealFormData,
    };

    setUserMeals([...userMeals, newMeal]);

    setMealFormData({
      name: '',
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      servings: 1,
    });
  };

  // for debugging purposes
  useEffect(() => {
    console.log(userMeals);
  }, [userMeals]);

  return (
    <>
      {userMeals?.length > 0 ? (
        <MealTable meals={userMeals} onDelete={deleteMeal} />
      ) : (
        <div>No Meals Logged for Today ({new Date().toLocaleDateString()})</div>
      )}
      <div>
        <div>Total Calories: {totalCalories}</div>
        <div>Total Protein: {totalProtein}</div>
        <div>Total Fat: {totalFat}</div>
        <div>Total Carbs: {totalCarbs}</div>
      </div>
      <Outlet />
    </>
  );
}

export default Dashboard;
