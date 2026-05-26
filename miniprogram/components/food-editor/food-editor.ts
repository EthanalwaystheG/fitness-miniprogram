import { FOOD_CATEGORIES, FOODS_BY_CATEGORY } from '../../data/foods';
import type { FoodCategory } from '../../data/foods';

const CATEGORY_KEYS: FoodCategory[] = ['meat', 'vegetable', 'carbs', 'fruit', 'drink', 'snack'];
const UNIT_OPTIONS = ['g', 'ml', '份', '个', '碗', '杯'];

Component({
  properties: {
    food: {
      type: Object,
      value: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, amount: 100, unit: 'g' },
    },
    isNew: {
      type: Boolean,
      value: true,
    },
  },

  data: {
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    amount: 100,
    unit: 'g',
    unitOptions: UNIT_OPTIONS,
    unitIndex: 0,

    // preset selection
    categoryKeys: CATEGORY_KEYS as string[],
    categoryLabels: CATEGORY_KEYS.map((k) => FOOD_CATEGORIES[k]),
    categoryIndex: 0,
    foodNames: [] as string[],
    foodNameIndex: 0,
    selectedPreset: '',
  },

  lifetimes: {
    attached() {
      const food = this.properties.food as Record<string, unknown>;
      const unit = (food.unit as string) || 'g';
      const unitIndex = UNIT_OPTIONS.indexOf(unit);
      this.setData({
        name: (food.name as string) || '',
        calories: (food.calories as number) || 0,
        protein: (food.protein as number) || 0,
        carbs: (food.carbs as number) || 0,
        fat: (food.fat as number) || 0,
        amount: (food.amount as number) || 100,
        unit,
        unitIndex: unitIndex >= 0 ? unitIndex : 0,
      });
      this.updateFoodNames(0);
    },
  },

  methods: {
    onNameInput(e: WechatMiniprogram.Input) {
      this.setData({ name: e.detail.value, selectedPreset: '' });
    },

    onCaloriesInput(e: WechatMiniprogram.Input) {
      this.setData({ calories: Number(e.detail.value) || 0 });
    },

    onProteinInput(e: WechatMiniprogram.Input) {
      this.setData({ protein: Number(e.detail.value) || 0 });
    },

    onCarbsInput(e: WechatMiniprogram.Input) {
      this.setData({ carbs: Number(e.detail.value) || 0 });
    },

    onFatInput(e: WechatMiniprogram.Input) {
      this.setData({ fat: Number(e.detail.value) || 0 });
    },

    onAmountInput(e: WechatMiniprogram.Input) {
      const newAmount = Number(e.detail.value) || 0;
      const presetName = this.data.selectedPreset;
      if (presetName && newAmount > 0) {
        this.scaleFromPreset(presetName, newAmount);
      } else {
        this.setData({ amount: newAmount });
      }
    },

    onUnitChange(e: WechatMiniprogram.PickerChange) {
      const idx = Number(e.detail.value);
      this.setData({ unitIndex: idx, unit: UNIT_OPTIONS[idx] });
    },

    onCategoryChange(e: WechatMiniprogram.PickerChange) {
      const idx = Number(e.detail.value);
      this.setData({ categoryIndex: idx });
      this.updateFoodNames(idx);
    },

    updateFoodNames(catIdx: number) {
      const key = CATEGORY_KEYS[catIdx];
      const foods = FOODS_BY_CATEGORY[key];
      this.setData({
        foodNames: foods.map((f) => f.name),
        foodNameIndex: 0,
      });
    },

    onFoodSelect(e: WechatMiniprogram.PickerChange) {
      const idx = Number(e.detail.value);
      this.setData({ foodNameIndex: idx });
      const foodName = this.data.foodNames[idx];
      if (foodName) {
        this.scaleFromPreset(foodName, this.data.amount || 100);
        this.setData({ selectedPreset: foodName });
      }
    },

    scaleFromPreset(presetName: string, currentAmount: number) {
      const catKey = CATEGORY_KEYS[this.data.categoryIndex];
      const foods = FOODS_BY_CATEGORY[catKey];
      const preset = foods.find((f) => f.name === presetName);
      if (!preset) return;

      const ratio = currentAmount / 100;
      this.setData({
        name: preset.name,
        calories: Math.round(preset.calories * ratio),
        protein: Math.round(preset.protein * ratio * 10) / 10,
        carbs: Math.round(preset.carbs * ratio * 10) / 10,
        fat: Math.round(preset.fat * ratio * 10) / 10,
        amount: currentAmount,
      });
    },

    onSave() {
      const { name, calories, protein, carbs, fat, amount, unit } = this.data;
      if (!name.trim()) {
        wx.showToast({ title: '请输入食物名称', icon: 'none' });
        return;
      }
      if (amount <= 0) {
        wx.showToast({ title: '份量必须大于0', icon: 'none' });
        return;
      }
      this.triggerEvent('save', {
        name: name.trim(),
        calories: Math.round(calories),
        protein: Math.round(protein * 10) / 10,
        carbs: Math.round(carbs * 10) / 10,
        fat: Math.round(fat * 10) / 10,
        amount,
        unit,
      });
    },

    onCancel() {
      this.triggerEvent('cancel');
    },
  },
});
