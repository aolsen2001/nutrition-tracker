import React from 'react';
import '../styles.css';

interface MealCardProps {
  mealName: string | null;
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
  onLogMeal: () => void;
}

function MealCard({
  mealName,
  calories,
  carbs,
  protein,
  fat,
  onLogMeal,
}: MealCardProps) {
  return (
    <>
      <div className='meal-card'>
        <div className='meal-card-name'>
          <p>{mealName}</p>
        </div>
        <div className='meal-card-info'>
          <p>Calories: {calories},</p>
          <p>Carbs (g): {carbs},</p>
          <p>Protein (g): {protein},</p>
          <p>Fat (g): {fat}</p>
        </div>
        <button onClick={onLogMeal}>Log Meal</button>
      </div>
    </>
  );
}

export default MealCard;
