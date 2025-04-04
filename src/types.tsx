export interface Meal {
  id: number;
  api_id: number | null; // unique identifer for food pulled from FatSecret API calls
  user_id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  servings: number;
  date: Date;
}

interface ApiMealServing {
  calories: string;
  carbohydrate: string;
  protein: string;
  fat: string;
}

// for food results from FatSecret API calls
export interface ApiMeal {
  food_id: number;
  food_name: string;
  servings: {
    serving: ApiMealServing[];
  };
}
