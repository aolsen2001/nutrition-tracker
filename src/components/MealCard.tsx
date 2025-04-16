import '../styles.css';

interface MealCardProps {
  mealName: string | null;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  children?: React.ReactNode;
}

function MealCard({
  mealName,
  calories,
  carbs,
  protein,
  fat,
  children,
}: MealCardProps) {
  return (
    <>
      <div className='meal-card'>
        <div className='meal-card-name'>
          <p>{mealName}</p>
        </div>
        <div className='meal-card-info'>
          <p>Calories: {calories}</p>
          <p>Carbs (g): {carbs}</p>
          <p>Protein (g): {protein}</p>
          <p>Fat (g): {fat}</p>
        </div>
        {children}
      </div>
    </>
  );
}

export default MealCard;
