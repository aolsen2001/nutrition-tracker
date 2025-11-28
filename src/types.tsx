export interface Meal {
  meal_id?: number;
  // api_id: number | null; // unique identifer for food pulled from FatSecret API calls
  user_id?: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  servings: number;
  date: Date;
}

// for results from the API calls
export interface ApiFoodSearchResponse {
  foods_search: FoodsSearch;
}

export interface FoodsSearch {
  max_results: string;
  total_results: string;
  page_number: string;
  results: Food[];
}

export interface Food {
  food_id: string | null;
  food_name: string | null;
  servings: Servings;
}

export interface Servings {
  serving: Serving[];
}

export interface Serving {
  calories: number;
  carbohydrate: number;
  protein: number;
  fat: number;
}
