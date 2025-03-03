import { useState, useEffect } from 'react';
import { Meal } from '../types';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import DashboardLayout from './DashboardLayout';
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
              <tr key={m.id}>
                <td>{m.user_id}</td>
                <td>{m.name}</td>
                <td>{m.calories}</td>
                <td>{m.protein}</td>
                <td>{m.fat}</td>
                <td>{m.carbs}</td>
                <td>{m.servings}</td>
                <td>{m.date.toLocaleDateString()}</td>
                <td>
                  <button onClick={() => onDelete(m.id)}>Delete</button>
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
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Current user: ', user.email);
    } else {
      console.log('No user currently signed in.');
    }
  });

  const meals: Meal[] = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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

  const [mealFormData, setMealFormData] = useState<
    Omit<Meal, 'id' | 'user_id' | 'date'>
  >({
    name: '',
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    servings: 1,
  });

  const deleteMeal = (id: number) => {
    const filteredUserMeals = userMeals.filter((m) => m.id !== id);
    setUserMeals(filteredUserMeals);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'date') console.log(new Date(value + 'T00:00:00'));
    setMealFormData((prev) => ({
      ...prev,
      [name]: Number(value) || value,
    }));
  };

  const addNewMeal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newMeal: Meal = {
      id: userMeals.length + 1,
      user_id: auth.currentUser?.uid ?? '',
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
    <DashboardLayout>
      <form onSubmit={addNewMeal}>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          name='name'
          value={mealFormData.name}
          onChange={handleInputChange}
          placeholder='Meal Name'
        ></input>
        <label htmlFor='calories'>Calories</label>
        <input
          type='text'
          pattern='(?:0|[1-9]\d*)'
          name='calories'
          value={mealFormData.calories}
          onChange={handleInputChange}
          placeholder='Calories'
        ></input>
        <label htmlFor='protein'>Protein (g)</label>
        <input
          type='text'
          pattern='(?:0|[1-9]\d*)'
          name='protein'
          value={mealFormData.protein}
          onChange={handleInputChange}
          placeholder='Protein (g)'
        ></input>
        <label htmlFor='fat'>Fat (g)</label>
        <input
          type='text'
          pattern='(?:0|[1-9]\d*)'
          name='fat'
          value={mealFormData.fat}
          onChange={handleInputChange}
          placeholder='Fat (g)'
        ></input>
        <label htmlFor='carbs'>Carbs (g)</label>
        <input
          type='text'
          pattern='(?:0|[1-9]\d*)'
          name='carbs'
          value={mealFormData.carbs}
          onChange={handleInputChange}
          placeholder='Carbs (g)'
        ></input>
        <label htmlFor='servings'>Servings</label>
        <input
          type='text'
          pattern='(?:0|[1-9]\d*)'
          name='servings'
          value={mealFormData.servings}
          onChange={handleInputChange}
          placeholder='Servings'
        ></input>
        <button type='submit'>Add Meal</button>
      </form>
      <h1>Meal Table</h1>
      <MealTable meals={userMeals} onDelete={deleteMeal} />
    </DashboardLayout>
  );
}

export default Dashboard;
