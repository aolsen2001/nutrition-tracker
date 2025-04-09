import { useState } from 'react';
import { Meal } from '../types';

interface MealFormProps {
  name: string | null;
  calories: number | null;
  carbs: number | null;
  protein: number | null;
  fat: number | null;
  meal_id?: string;
  isNewMeal: boolean; // determines if the user is logging a new meal or editing an existing one
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

function MealForm({
  name,
  calories,
  carbs,
  protein,
  fat,
  meal_id,
  isNewMeal,
  onFormSubmit,
}: MealFormProps) {
  const [mealFormData, setMealFormData] = useState<
    Omit<Meal, 'id' | 'user_id' | 'date'>
  >({
    name: name ? name : '',
    calories: calories ? calories : 0,
    protein: protein ? protein : 0,
    fat: fat ? fat : 0,
    carbs: carbs ? carbs : 0,
    servings: 1,
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setMealFormData((prev) => ({
      ...prev,
      [name]: Number(value) || value,
    }));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onFormSubmit(e as React.FormEvent<HTMLFormElement>);
    }
  }

  return (
    <>
      <form onSubmit={onFormSubmit} onKeyDown={handleKeyDown}>
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
          pattern='(?:0|[1-9]\d*)(?:\.\d+)?'
          name='calories'
          value={mealFormData.calories}
          onChange={handleInputChange}
          placeholder='Calories'
        ></input>
        <label htmlFor='protein'>Protein (g)</label>
        <input
          type='text'
          pattern='(?:0|[1-9]\d*)(?:\.\d+)?'
          name='protein'
          value={mealFormData.protein}
          onChange={handleInputChange}
          placeholder='Protein (g)'
        ></input>
        <label htmlFor='fat'>Fat (g)</label>
        <input
          type='text'
          pattern='(?:0|[1-9]\d*)(?:\.\d+)?'
          name='fat'
          value={mealFormData.fat}
          onChange={handleInputChange}
          placeholder='Fat (g)'
        ></input>
        <label htmlFor='carbs'>Carbs (g)</label>
        <input
          type='text'
          pattern='(?:0|[1-9]\d*)(?:\.\d+)?'
          name='carbs'
          value={mealFormData.carbs}
          onChange={handleInputChange}
          placeholder='Carbs (g)'
        ></input>
        <label htmlFor='servings'>Servings</label>
        <input
          type='text'
          pattern='(?:0|[1-9]\d*)(?:\.\d+)?'
          name='servings'
          value={mealFormData.servings}
          onChange={handleInputChange}
          placeholder='Servings'
        ></input>
        <button type='submit'>{isNewMeal ? 'Log Meal' : 'Edit Meal'}</button>
      </form>
    </>
  );
}

export default MealForm;
