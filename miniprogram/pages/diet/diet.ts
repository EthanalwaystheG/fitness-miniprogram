import { getDietByDate, saveDietRecord, deleteDietRecord, generateId, getUserProfile } from '../../utils/storage';
import { calculateBMR, calculateTDEE } from '../../utils/bmr';
import { today, formatDisplay } from '../../utils/date';
import type { DietRecord, Meal, FoodItem, MealType, MacroTotals } from '../../types/index';

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
};

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

function emptyMeals(): Meal[] {
  return MEAL_ORDER.map((type) => ({ id: generateId(), type, foods: [] }));
}

function calcTotals(meals: Meal[]): MacroTotals {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  for (const meal of meals) {
    for (const food of meal.foods) {
      calories += food.calories || 0;
      protein += food.protein || 0;
      carbs += food.carbs || 0;
      fat += food.fat || 0;
    }
  }
  return { calories, protein, carbs, fat };
}

function calcMealCalories(meal: Meal): number {
  return meal.foods.reduce((sum, f) => sum + (f.calories || 0), 0);
}

Component({
  data: {
    selectedDate: today(),
    displayDate: '',
    meals: emptyMeals() as Meal[],
    mealLabels: MEAL_LABELS as Record<string, string>,
    totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } as MacroTotals,
    mealCalories: {} as Record<string, number>,
    // editor state
    showEditor: false,
    isNewFood: true,
    currentFood: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, amount: 100, unit: 'g' } as FoodItem,
    currentMealType: 'breakfast' as MealType,
    editMealIndex: -1,
    editFoodIndex: -1,
    calorieTarget: 2000,
  },

  lifetimes: {
    attached() {
      this.setData({ displayDate: formatDisplay(this.data.selectedDate) });
      this.loadDiet();
    },
  },

  pageLifetimes: {
    show() {
      this.loadDiet();
    },
  },

  methods: {
    loadDiet() {
      // Load TDEE target
      const profile = getUserProfile();
      let calorieTarget = 2000;
      if (profile) {
        const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
        calorieTarget = calculateTDEE(bmr, profile.activityLevel);
      }

      const record = getDietByDate(this.data.selectedDate);
      let meals = emptyMeals();

      if (record) {
        // Merge stored meals into the ordered template
        for (const storedMeal of record.meals) {
          const idx = meals.findIndex((m) => m.type === storedMeal.type);
          if (idx >= 0) {
            meals[idx] = storedMeal;
          }
        }
      }

      const totals = calcTotals(meals);
      const mealCalories: Record<string, number> = {};
      for (const meal of meals) {
        mealCalories[meal.type] = calcMealCalories(meal);
      }

      this.setData({
        meals,
        totals,
        mealCalories,
        calorieTarget,
      });
    },

    onDateChange(e: WechatMiniprogram.PickerChange) {
      const date = e.detail.value as string;
      this.setData({ selectedDate: date, displayDate: formatDisplay(date) });
      this.loadDiet();
    },

    onAddFood(e: WechatMiniprogram.TouchEvent) {
      const mealType = e.currentTarget.dataset.type as MealType;
      this.setData({
        showEditor: true,
        isNewFood: true,
        editMealIndex: -1,
        editFoodIndex: -1,
        currentMealType: mealType,
        currentFood: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, amount: 100, unit: 'g' } as FoodItem,
      });
    },

    onEditFood(e: WechatMiniprogram.TouchEvent) {
      const { mealIndex, foodIndex } = e.currentTarget.dataset;
      const food = this.data.meals[mealIndex].foods[foodIndex];
      this.setData({
        showEditor: true,
        isNewFood: false,
        editMealIndex: mealIndex,
        editFoodIndex: foodIndex,
        currentMealType: this.data.meals[mealIndex].type,
        currentFood: { ...food },
      });
    },

    onDeleteFood(e: WechatMiniprogram.TouchEvent) {
      const { mealIndex, foodIndex } = e.currentTarget.dataset;
      wx.showModal({
        title: '删除确认',
        content: '确定要删除这个食物吗？',
        success: (res) => {
          if (res.confirm) {
            this.removeFood(mealIndex, foodIndex);
          }
        },
      });
    },

    onSaveFood(e: WechatMiniprogram.CustomEvent) {
      const food = e.detail as FoodItem;
      const { selectedDate, meals, currentMealType, isNewFood, editMealIndex, editFoodIndex } = this.data;

      const mealIdx = meals.findIndex((m) => m.type === currentMealType);
      if (mealIdx < 0) return;

      if (isNewFood) {
        meals[mealIdx].foods.push({ ...food, id: generateId() });
      } else {
        meals[editMealIndex].foods[editFoodIndex] = { ...food, id: meals[editMealIndex].foods[editFoodIndex].id };
      }

      // Save
      const existing = getDietByDate(selectedDate);
      const record: DietRecord = existing || {
        id: generateId(),
        date: selectedDate,
        meals: emptyMeals(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      record.meals = meals;
      record.updatedAt = new Date().toISOString();
      saveDietRecord(record);

      this.setData({ showEditor: false });
      this.loadDiet();
    },

    onCloseEditor() {
      this.setData({ showEditor: false });
    },

    removeFood(mealIndex: number, foodIndex: number) {
      const { selectedDate } = this.data;
      const record = getDietByDate(selectedDate);
      if (!record) return;

      record.meals[mealIndex].foods.splice(foodIndex, 1);
      record.updatedAt = new Date().toISOString();

      const hasAnyFood = record.meals.some((m) => m.foods.length > 0);
      if (!hasAnyFood) {
        deleteDietRecord(record.id);
      } else {
        saveDietRecord(record);
      }
      this.loadDiet();
    },
  },
});
