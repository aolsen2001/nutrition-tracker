// import { useState } from "react";
import { Meal } from '../types';

function MealList(meals: Meal[]) {
  const mealListItems = meals.map((meal: Meal) => (
    <li key={meal.id}>
      <p>
        {meal.name} - {meal.calories} - {meal.protein} - {meal.servings} -
        {meal.date.toLocaleString().split(',')[0]} -
        {meal.date.toLocaleString().split(',')[1]}
      </p>
    </li>
  ));

  return mealListItems;
}

function Dashboard() {
  const meals: Meal[] = [
    {
      id: 1,
      name: 'Chicken Breast',
      calories: 300,
      protein: 30,
      servings: 1,
      date: new Date(),
    },
    {
      id: 2,
      name: 'Greek Yogurt',
      calories: 200,
      protein: 15,
      servings: 2,
      date: new Date(),
    },
    {
      id: 3,
      name: 'Cheeseburger',
      calories: 500,
      protein: 22,
      servings: 1,
      date: new Date(),
    },
    {
      id: 4,
      name: 'Mixed Nuts',
      calories: 200,
      protein: 12,
      servings: 3,
      date: new Date(),
    },
    {
      id: 5,
      name: 'Protein Shake',
      calories: 400,
      protein: 40,
      servings: 1,
      date: new Date(),
    },
  ];

  const mealList = MealList(meals);

  return <ul>{mealList}</ul>;
}

export default Dashboard;
