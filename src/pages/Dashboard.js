import DashboardLayout from '../components/DashboardLayout';
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router';

const dummyMeals = [
  { id: 1, name: 'Chicken Breast', calories: 400, protein: 30, servings: 1 },
  { id: 2, name: 'Greek Yogurt', calories: 200, protein: 12, servings: 2 },
  { id: 3, name: 'Pepperoni Pizza', calories: 100, protein: 8, servings: 3 },
];

function MealTable({ dummyMeals }) {
  const [tableFilter, setFilter] = useState(200);

  const handleFilter = (e) => {
    if (!isNaN(e.target.value)) {
      setFilter(e.target.value);
    }
  };

  const filteredMeals = dummyMeals.filter(
    (meal) => meal.calories >= tableFilter
  );

  return (
    <>
      <div>
        <input
          type='text'
          placeholder='Set filter'
          value={tableFilter}
          onChange={handleFilter}
        />
      </div>
      <table>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Calories (Per Serving)</th>
          <th>Protein (Per Serving)</th>
          <th>Servings</th>
          <th>Total Calories</th>
          <th>Total Protein</th>
        </tr>
        {filteredMeals.map((meal) => (
          <tr>
            <td>{meal.id}</td>
            <td>{meal.name}</td>
            <td>{meal.calories}</td>
            <td>{meal.protein}</td>
            <td>{meal.servings}</td>
            <td>{meal.calories * meal.servings}</td>
            <td>{meal.protein * meal.servings}</td>
          </tr>
        ))}
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
