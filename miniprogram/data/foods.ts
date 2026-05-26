export type FoodCategory = 'meat' | 'vegetable' | 'carbs' | 'fruit' | 'drink' | 'snack';

export const FOOD_CATEGORIES: Record<FoodCategory, string> = {
  meat: '肉类',
  vegetable: '蔬菜',
  carbs: '碳水主食',
  fruit: '水果',
  drink: '饮品',
  snack: '零食',
};

export interface PresetFood {
  name: string;
  category: FoodCategory;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const FOODS_BY_CATEGORY: Record<FoodCategory, PresetFood[]> = {
  meat: [
    { name: '鸡胸肉', category: 'meat', calories: 133, protein: 31.0, carbs: 0, fat: 1.2 },
    { name: '鸡腿肉', category: 'meat', calories: 181, protein: 20.0, carbs: 0, fat: 11.0 },
    { name: '鸡翅', category: 'meat', calories: 222, protein: 18.3, carbs: 0, fat: 16.5 },
    { name: '猪瘦肉', category: 'meat', calories: 143, protein: 20.3, carbs: 1.5, fat: 6.2 },
    { name: '牛肉（瘦）', category: 'meat', calories: 125, protein: 22.3, carbs: 0.2, fat: 4.2 },
    { name: '鸡蛋（煮）', category: 'meat', calories: 155, protein: 13.1, carbs: 1.1, fat: 10.9 },
    { name: '三文鱼', category: 'meat', calories: 208, protein: 20.4, carbs: 0, fat: 13.4 },
    { name: '虾仁', category: 'meat', calories: 99, protein: 20.3, carbs: 0.2, fat: 1.7 },
    { name: '羊肉（瘦）', category: 'meat', calories: 143, protein: 20.5, carbs: 0.1, fat: 6.8 },
    { name: '鸭肉', category: 'meat', calories: 240, protein: 15.5, carbs: 0.2, fat: 19.7 },
  ],
  vegetable: [
    { name: '西兰花', category: 'vegetable', calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
    { name: '菠菜', category: 'vegetable', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    { name: '番茄', category: 'vegetable', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
    { name: '黄瓜', category: 'vegetable', calories: 16, protein: 0.7, carbs: 2.9, fat: 0.1 },
    { name: '胡萝卜', category: 'vegetable', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2 },
    { name: '生菜', category: 'vegetable', calories: 15, protein: 1.4, carbs: 2.8, fat: 0.2 },
    { name: '芹菜', category: 'vegetable', calories: 14, protein: 0.7, carbs: 3.0, fat: 0.1 },
    { name: '青椒', category: 'vegetable', calories: 20, protein: 0.9, carbs: 4.5, fat: 0.2 },
  ],
  carbs: [
    { name: '米饭（熟）', category: 'carbs', calories: 116, protein: 2.6, carbs: 25.9, fat: 0.3 },
    { name: '面条（煮）', category: 'carbs', calories: 110, protein: 3.5, carbs: 22.0, fat: 0.5 },
    { name: '馒头', category: 'carbs', calories: 223, protein: 7.0, carbs: 44.2, fat: 1.1 },
    { name: '全麦面包', category: 'carbs', calories: 247, protein: 10.0, carbs: 41.3, fat: 3.4 },
    { name: '红薯', category: 'carbs', calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1 },
    { name: '土豆', category: 'carbs', calories: 77, protein: 2.0, carbs: 17.5, fat: 0.1 },
    { name: '燕麦', category: 'carbs', calories: 377, protein: 13.5, carbs: 66.3, fat: 6.9 },
    { name: '玉米', category: 'carbs', calories: 112, protein: 4.0, carbs: 22.8, fat: 1.2 },
  ],
  fruit: [
    { name: '香蕉', category: 'fruit', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
    { name: '苹果', category: 'fruit', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2 },
    { name: '橙子', category: 'fruit', calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1 },
    { name: '葡萄', category: 'fruit', calories: 69, protein: 0.7, carbs: 18.1, fat: 0.2 },
    { name: '西瓜', category: 'fruit', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2 },
    { name: '草莓', category: 'fruit', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
    { name: '蓝莓', category: 'fruit', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
    { name: '猕猴桃', category: 'fruit', calories: 61, protein: 1.1, carbs: 14.7, fat: 0.5 },
  ],
  drink: [
    { name: '全脂牛奶', category: 'drink', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
    { name: '脱脂牛奶', category: 'drink', calories: 34, protein: 3.4, carbs: 5.0, fat: 0.1 },
    { name: '豆浆', category: 'drink', calories: 31, protein: 3.0, carbs: 1.2, fat: 1.6 },
    { name: '酸奶（原味）', category: 'drink', calories: 63, protein: 3.5, carbs: 7.0, fat: 2.5 },
    { name: '蛋白粉（乳清）', category: 'drink', calories: 380, protein: 75.0, carbs: 8.0, fat: 4.0 },
  ],
  snack: [
    { name: '黑巧克力（70%）', category: 'snack', calories: 598, protein: 7.8, carbs: 45.9, fat: 42.6 },
    { name: '坚果混合', category: 'snack', calories: 607, protein: 20.0, carbs: 21.0, fat: 50.0 },
    { name: '能量棒', category: 'snack', calories: 380, protein: 15.0, carbs: 50.0, fat: 12.0 },
    { name: '苏打饼干', category: 'snack', calories: 428, protein: 8.0, carbs: 72.0, fat: 11.0 },
    { name: '牛肉干', category: 'snack', calories: 300, protein: 45.0, carbs: 5.0, fat: 10.0 },
  ],
};

export function getPresetFood(name: string): PresetFood | undefined {
  for (const foods of Object.values(FOODS_BY_CATEGORY)) {
    const found = foods.find((f) => f.name === name);
    if (found) return found;
  }
  return undefined;
}
