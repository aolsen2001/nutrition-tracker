import '../styles.css';
import { Food } from '../types';

interface FoodCardProps {
  // mealName: string | null;
  // calories: number;
  // carbs: number;
  // protein: number;
  // fat: number;
  food: Food;
  children?: React.ReactNode;
}

function FoodCard({
  food,
  children,
}: FoodCardProps) {
  return (
    <>
      <div className='meal-card'>
        <div className='meal-card-name'>
          <p>{food.name}</p>
        </div>
        <div className='meal-card-info'>
          <p>Calories: {food.calories}</p>
          <p>Carbs (g): {food.carbohydrate}</p>
          <p>Protein (g): {food.protein}</p>
          <p>Fat (g): {food.fat}</p>
        </div>
        {children}
      </div>
    </>
  );
}

export default FoodCard;
