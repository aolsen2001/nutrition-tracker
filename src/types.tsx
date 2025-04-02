export type Meal = {
  id: number;
  fatsecret_id: number | null;
  user_id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  servings: number;
  date: Date;
};
