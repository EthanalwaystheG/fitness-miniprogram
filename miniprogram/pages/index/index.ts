import { getUserProfile, getWeightHistory, getWorkoutByDate, getDietByDate } from '../../utils/storage';
import { calculateBMR, calculateTDEE } from '../../utils/bmr';
import { today, formatDisplay } from '../../utils/date';
import type { MacroTotals } from '../../types/index';

Component({
  data: {
    displayDate: '',
    hasProfile: false,
    bmr: 0,
    tdee: 0,
    latestWeight: 0,
    caloriesIn: 0,
    exerciseCount: 0,
    totalSets: 0,
    macroTotals: { calories: 0, protein: 0, carbs: 0, fat: 0 } as MacroTotals,
    hasWorkout: false,
    hasDiet: false,
  },

  lifetimes: {
    attached() {
      this.setData({ displayDate: formatDisplay(today()) });
      this.loadDashboard();
    },
  },

  pageLifetimes: {
    show() {
      this.setData({ displayDate: formatDisplay(today()) });
      this.loadDashboard();
    },
  },

  methods: {
    loadDashboard() {
      const profile = getUserProfile();
      let bmr = 0;
      let tdee = 0;

      if (profile) {
        bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
        tdee = calculateTDEE(bmr, profile.activityLevel);
      }

      const weightHistory = getWeightHistory();
      const latestWeight = weightHistory.length > 0 ? weightHistory[0].weight : 0;

      const workout = getWorkoutByDate(today());
      const exerciseCount = workout ? workout.exercises.length : 0;
      const totalSets = workout ? workout.exercises.reduce((sum, e) => sum + e.sets, 0) : 0;

      const diet = getDietByDate(today());
      let caloriesIn = 0;
      const macroTotals: MacroTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

      if (diet) {
        for (const meal of diet.meals) {
          for (const food of meal.foods) {
            caloriesIn += food.calories || 0;
            macroTotals.protein += food.protein || 0;
            macroTotals.carbs += food.carbs || 0;
            macroTotals.fat += food.fat || 0;
          }
        }
        macroTotals.calories = caloriesIn;
      }

      this.setData({
        hasProfile: !!profile,
        bmr,
        tdee,
        latestWeight,
        caloriesIn,
        exerciseCount,
        totalSets,
        macroTotals,
        hasWorkout: exerciseCount > 0,
        hasDiet: caloriesIn > 0,
      });
    },

    onGoWorkout() {
      wx.switchTab({ url: '/pages/workout/workout' });
    },

    onGoDiet() {
      wx.switchTab({ url: '/pages/diet/diet' });
    },

    onGoProfile() {
      wx.switchTab({ url: '/pages/profile/profile' });
    },

    calRemaining(): number {
      return this.data.tdee - this.data.caloriesIn;
    },
  },
});
