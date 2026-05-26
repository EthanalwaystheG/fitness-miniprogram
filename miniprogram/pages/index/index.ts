import { getUserProfile, getWeightHistory, getWorkoutByDate, getDietByDate } from '../../utils/storage';
import { calculateBMR, calculateTDEE } from '../../utils/bmr';
import { today, formatDisplay } from '../../utils/date';
import type { MacroTotals, Goal } from '../../types/index';

const GAIN_SURPLUS = 300;

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
    // Goal mode
    goal: 'lose_fat' as Goal,
    goalTarget: 2000,
    goalLabel: '热量缺口',
    goalValue: 0,
    goalStatus: 'green',
    barPct: 0,
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
      let goal: Goal = 'lose_fat';

      if (profile) {
        bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
        tdee = calculateTDEE(bmr, profile.activityLevel);
        goal = profile.goal || 'lose_fat';
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

      // Goal-aware calculations
      const goalTarget = goal === 'lose_fat' ? tdee : tdee + GAIN_SURPLUS;
      let goalLabel: string;
      let goalValue: number;
      let goalStatus: string;

      if (goal === 'lose_fat') {
        goalLabel = '热量缺口';
        goalValue = tdee - caloriesIn;
        goalStatus = goalValue > 0 ? 'green' : 'red';
      } else {
        goalLabel = '还需摄入';
        goalValue = goalTarget - caloriesIn;
        goalStatus = goalValue <= 0 ? 'green' : 'yellow';
      }

      const barPct = goalTarget > 0 ? Math.min(100, (caloriesIn / goalTarget) * 100) : 0;

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
        goal,
        goalTarget,
        goalLabel,
        goalValue,
        goalStatus,
        barPct,
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
  },
});
