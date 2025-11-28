import { useState } from 'react';
import { Meal } from '../types';
import { clsx } from 'clsx';

interface MealFormProps {
  name: string | null;
  calories: number | null;
  carbs: number | null;
  protein: number | null;
  fat: number | null;
  meal_id?: string;
  isNewMeal: boolean; // determines if the user is logging a new meal or editing an existing one
  onFormSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    isNewMeal: boolean,
    newMeal: Meal
  ) => void;
}

function MealForm({
  name,
  calories,
  carbs,
  protein,
  fat,
  isNewMeal,
  onFormSubmit,
}: MealFormProps) {
  const [mealFormData, setMealFormData] = useState<
    Omit<Meal, 'meal_id' | 'user_id' | 'date'>
  >({
    name: name ? name : '',
    calories: calories ? calories : 0,
    protein: protein ? protein : 0,
    fat: fat ? fat : 0,
    carbs: carbs ? carbs : 0,
    servings: 1,
  });
  const [errors, setErrors] = useState(new Map<string, string[]>());

  const formKeys = Object.keys(mealFormData);

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
      validateAndSubmit(e as React.FormEvent<HTMLFormElement>);
    }
  }

  function hasErrors(fieldKey: string) {
    return (errors.get(fieldKey)?.length ?? 0) > 0;
  }

  function validateAndSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors = new Map();
    formKeys.forEach((key) => {
      newErrors.set(key, []);
    });

    const calories = Number(mealFormData.calories);
    if (isNaN(calories)) {
      newErrors.get('calories')?.push('Value for calories must be a number');
    } else {
      if (calories < 0) {
        newErrors.get('calories')?.push('Calories cannot be negative');
      }
    }

    const carbs = Number(mealFormData.carbs);
    if (isNaN(carbs)) {
      newErrors.get('carbs')?.push('Value for carbs must be a number');
    } else {
      if (carbs < 0) {
        newErrors.get('carbs')?.push('Carbs cannot be negative');
      }
    }

    const protein = Number(mealFormData.protein);
    if (isNaN(protein)) {
      newErrors.get('protein')?.push('Value for protein must be a number');
    } else {
      if (protein < 0) {
        newErrors.get('protein')?.push('Protein cannot be negative');
      }
    }

    const fat = Number(mealFormData.fat);
    if (isNaN(fat)) {
      newErrors.get('fat')?.push('Value for fat content must be a number');
    } else {
      if (fat < 0) {
        newErrors.get('fat')?.push('Fat content cannot be negative');
      }
    }

    const servings = Number(mealFormData.servings);
    if (isNaN(servings)) {
      newErrors.get('servings')?.push('Value for servings must be a number');
    } else {
      if (servings < 0) {
        newErrors
          .get('servings')
          ?.push('Number of servings cannot be negative');
      }
    }

    setErrors(newErrors);

    for (const key of formKeys) {
      const keyErrors = newErrors.get(key);
      if (keyErrors?.length) {
        console.log('Errors present');
        return;
      }
    }

    console.log('No errors present');

    const newMeal: Meal = {
      name: name as string,
      calories: calories,
      carbs: carbs,
      protein: protein,
      fat: fat,
      servings: servings,
      date: new Date(),
    };

    onFormSubmit(e, isNewMeal, newMeal);
  }

  return (
    <>
      <form noValidate onSubmit={validateAndSubmit} onKeyDown={handleKeyDown}>
        <label htmlFor='name'>Name</label>
        <input
          className={clsx({
            'form-input': mealFormData.name === '',
            'form-input invalid-form-input':
              mealFormData.name !== '' && errors.get('name')?.length,
            'form-input valid-form-input':
              mealFormData.name !== '' && !errors.get('name')?.length,
          })}
          type='text'
          name='name'
          value={mealFormData.name}
          onChange={handleInputChange}
          placeholder='Meal Name'
        ></input>
        <label htmlFor='calories'>Calories</label>
        <input
          className={clsx({
            'form-input': !mealFormData.calories,
            'form-input invalid-form-input':
              mealFormData.calories && errors.get('calories')?.length,
            'form-input valid-form-input':
              mealFormData.calories && !errors.get('calories')?.length,
          })}
          type='text'
          pattern='(?:0|[1-9]\d*)(?:\.\d+)?'
          name='calories'
          value={mealFormData.calories}
          onChange={handleInputChange}
          placeholder='Calories'
        ></input>
        {hasErrors('calories') && (
          <ul className='error-list'>
            {errors.get('calories')?.map((errorMsg, index) => (
              <li className='error-msg' key={index}>
                {errorMsg}
              </li>
            ))}
          </ul>
        )}
        <label htmlFor='protein'>Protein (g)</label>
        <input
          className={clsx({
            'form-input': !mealFormData.protein,
            'form-input invalid-form-input':
              mealFormData.protein && errors.get('protein')?.length,
            'form-input valid-form-input':
              mealFormData.protein && !errors.get('protein')?.length,
          })}
          type='text'
          pattern='(?:0|[1-9]\d*)(?:\.\d+)?'
          name='protein'
          value={mealFormData.protein}
          onChange={handleInputChange}
          placeholder='Protein (g)'
        ></input>
        {hasErrors('protein') && (
          <ul className='error-list'>
            {errors.get('protein')?.map((errorMsg, index) => (
              <li className='error-msg' key={index}>
                {errorMsg}
              </li>
            ))}
          </ul>
        )}
        <label htmlFor='fat'>Fat (g)</label>
        <input
          className={clsx({
            'form-input': !mealFormData.fat,
            'form-input invalid-form-input':
              mealFormData.fat && errors.get('fat')?.length,
            'form-input valid-form-input':
              mealFormData.fat && !errors.get('fat')?.length,
          })}
          type='text'
          pattern='(?:0|[1-9]\d*)(?:\.\d+)?'
          name='fat'
          value={mealFormData.fat}
          onChange={handleInputChange}
          placeholder='Fat (g)'
        ></input>
        {hasErrors('fat') && (
          <ul className='error-list'>
            {errors.get('fat')?.map((errorMsg, index) => (
              <li className='error-msg' key={index}>
                {errorMsg}
              </li>
            ))}
          </ul>
        )}
        <label htmlFor='carbs'>Carbs (g)</label>
        <input
          className={clsx({
            'form-input': !mealFormData.carbs,
            'form-input invalid-form-input':
              mealFormData.carbs && errors.get('carbs')?.length,
            'form-input valid-form-input':
              mealFormData.carbs && !errors.get('carbs')?.length,
          })}
          type='text'
          pattern='(?:0|[1-9]\d*)(?:\.\d+)?'
          name='carbs'
          value={mealFormData.carbs}
          onChange={handleInputChange}
          placeholder='Carbs (g)'
        ></input>
        {hasErrors('carbs') && (
          <ul className='error-list'>
            {errors.get('carbs')?.map((errorMsg, index) => (
              <li className='error-msg' key={index}>
                {errorMsg}
              </li>
            ))}
          </ul>
        )}
        <label htmlFor='servings'>Servings</label>
        <input
          className={clsx({
            'form-input': !mealFormData.servings,
            'form-input invalid-form-input':
              mealFormData.servings && errors.get('servings')?.length,
            'form-input valid-form-input':
              mealFormData.servings && !errors.get('servings')?.length,
          })}
          type='text'
          pattern='(?:0|[1-9]\d*)(?:\.\d+)?'
          name='servings'
          value={mealFormData.servings}
          onChange={handleInputChange}
          placeholder='Servings'
        ></input>
        {hasErrors('servings') && (
          <ul className='error-list'>
            {errors.get('servings')?.map((errorMsg, index) => (
              <li className='error-msg' key={index}>
                {errorMsg}
              </li>
            ))}
          </ul>
        )}
        <button type='submit'>{isNewMeal ? 'Log Meal' : 'Edit Meal'}</button>
      </form>
    </>
  );
}

export default MealForm;
