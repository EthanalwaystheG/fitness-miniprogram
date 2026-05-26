import type { Gender, ActivityLevel } from '../types/index';

export function calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return Math.round(gender === 'male' ? base + 5 : base - 161);
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * activityLevel);
}

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  1.2: '久坐不动',
  1.375: '轻度活动 (每周1-3天)',
  1.55: '中度活动 (每周3-5天)',
  1.725: '高度活跃 (每周6-7天)',
  1.9: '极度活跃 (运动员/体力劳动者)',
};

export const ACTIVITY_OPTIONS: ActivityLevel[] = [1.2, 1.375, 1.55, 1.725, 1.9];
