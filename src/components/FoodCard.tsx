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
          <p>{food.food_name}</p>
        </div>
        <div className='meal-card-info'>
          <p>Calories: {food.servings.serving[0].calories}</p>
          <p>Carbs (g): {food.servings.serving[0].carbohydrate}</p>
          <p>Protein (g): {food.servings.serving[0].protein}</p>
          <p>Fat (g): {food.servings.serving[0].fat}</p>
        </div>
        {children}
      </div>
    </>
  );
}

export default FoodCard;
