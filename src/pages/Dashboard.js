import DashboardLayout from '../components/DashboardLayout';
import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router';

const dummyMeals = [
  { id: 1, name: 'Chicken Breast', calories: 400, protein: 30, servings: 1 },
  { id: 2, name: 'Greek Yogurt', calories: 200, protein: 12, servings: 2 },
  { id: 3, name: 'Pepperoni Pizza', calories: 100, protein: 8, servings: 3 },
];

function MealTable({ dummyMeals }) {
  const [inputValue, setInputValue] = useState('');
  const [tableFilter, setTableFilter] = useState('');

  const handleFilter = (e) => {
    setInputValue(e.target.value);
  };

  // use debounce so tableFilter doesn't update after every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue === '' || !isNaN(inputValue)) {
        setTableFilter(inputValue === '' ? '' : Number(inputValue));
      }
      console.log(inputValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  const filteredMeals = dummyMeals.filter(
    (meal) => meal.calories >= tableFilter
  );

  return (
    <>
      <div>
        <input
          type='text'
          placeholder='Set filter'
          value={inputValue}
          onChange={handleFilter}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Calories (Per Serving)</th>
            <th>Protein (Per Serving)</th>
            <th>Servings</th>
            <th>Total Calories</th>
            <th>Total Protein</th>
          </tr>
        </thead>
        <tbody>
          {filteredMeals.map((meal) => (
            <tr key={meal.id}>
              <td>{meal.id}</td>
              <td>{meal.name}</td>
              <td>{meal.calories}</td>
              <td>{meal.protein}</td>
              <td>{meal.servings}</td>
              <td>{meal.calories * meal.servings}</td>
              <td>{meal.protein * meal.servings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function MealList() {
  const listItems = dummyMeals.map((meal) => (
    <li>
      <p>Id: {meal.id}</p>
      <p>Name: {meal.name}</p>
      <p>Calories: {meal.calories}</p>
      <p>Protein: {meal.protein}</p>
      <p>Servings: {meal.servings}</p>
      <p>Total Calories: {meal.calories * meal.servings}</p>
      <p>Total Protein: {meal.protein * meal.servings}</p>
    </li>
  ));
  return <ul>{listItems}</ul>;
}

export default function Dashboard() {
  return (
    <>
      <DashboardLayout>
        <h1>This is the dashboard page</h1>
        <Link to='/'>Return to Login</Link>
        <Outlet />
        {/* <MealList /> */}
        <MealTable dummyMeals={dummyMeals} />
      </DashboardLayout>
    </>
  );
}
