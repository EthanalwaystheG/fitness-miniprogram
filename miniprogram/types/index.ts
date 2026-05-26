export type Gender = 'male' | 'female';

export type ActivityLevel = 1.2 | 1.375 | 1.55 | 1.725 | 1.9;

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface UserProfile {
  height: number;
  weight: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  updatedAt: string;
}

export interface WeightRecord {
  id: string;
  date: string;
  weight: number;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  note: string;
}

export interface WorkoutRecord {
  id: string;
  date: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  amount: number;
  unit: string;
}

export interface Meal {
  id: string;
  type: MealType;
  foods: FoodItem[];
}

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietRecord {
  id: string;
  date: string;
  meals: Meal[];
  createdAt: string;
  updatedAt: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}
