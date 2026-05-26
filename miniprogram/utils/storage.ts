import type { UserProfile, WeightRecord, WorkoutRecord, DietRecord, CustomTemplate } from '../types/index';

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = wx.getStorageSync(key);
    if (raw === '' || raw === undefined || raw === null) return fallback;
    return raw as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    wx.setStorageSync(key, value);
  } catch (e) {
    console.error(`Storage set failed for key: ${key}`, e);
  }
}

// --- User Profile ---

const PROFILE_KEY = 'fitness_user_profile';

export function getUserProfile(): UserProfile | null {
  const profile = safeGet<UserProfile | null>(PROFILE_KEY, null);
  if (profile && !(profile as Record<string, unknown>).goal) {
    (profile as Record<string, unknown>).goal = 'lose_fat';
  }
  return profile;
}

export function saveUserProfile(profile: UserProfile): void {
  safeSet(PROFILE_KEY, profile);
}

// --- Weight History ---

const WEIGHT_KEY = 'fitness_weight_history';

export function getWeightHistory(): WeightRecord[] {
  return safeGet<WeightRecord[]>(WEIGHT_KEY, []);
}

export function addWeightRecord(record: WeightRecord): void {
  const list = getWeightHistory();
  list.unshift(record);
  safeSet(WEIGHT_KEY, list);
}

export function deleteWeightRecord(id: string): void {
  const list = getWeightHistory();
  safeSet(
    WEIGHT_KEY,
    list.filter((r) => r.id !== id),
  );
}

// --- Workouts ---

const WORKOUT_KEY = 'fitness_workouts';

function getWorkouts(): WorkoutRecord[] {
  return safeGet<WorkoutRecord[]>(WORKOUT_KEY, []);
}

export function getWorkoutByDate(date: string): WorkoutRecord | null {
  return getWorkouts().find((w) => w.date === date) || null;
}

export function saveWorkoutRecord(record: WorkoutRecord): void {
  const list = getWorkouts();
  const idx = list.findIndex((w) => w.id === record.id);
  if (idx >= 0) {
    list[idx] = record;
  } else {
    list.push(record);
  }
  safeSet(WORKOUT_KEY, list);
}

export function deleteWorkoutRecord(id: string): void {
  const list = getWorkouts();
  safeSet(
    WORKOUT_KEY,
    list.filter((w) => w.id !== id),
  );
}

// --- Diets ---

const DIET_KEY = 'fitness_diets';

function getDiets(): DietRecord[] {
  return safeGet<DietRecord[]>(DIET_KEY, []);
}

export function getDietByDate(date: string): DietRecord | null {
  return getDiets().find((d) => d.date === date) || null;
}

export function saveDietRecord(record: DietRecord): void {
  const list = getDiets();
  const idx = list.findIndex((d) => d.id === record.id);
  if (idx >= 0) {
    list[idx] = record;
  } else {
    list.push(record);
  }
  safeSet(DIET_KEY, list);
}

export function deleteDietRecord(id: string): void {
  const list = getDiets();
  safeSet(
    DIET_KEY,
    list.filter((d) => d.id !== id),
  );
}

// --- Custom Templates ---

const TEMPLATE_KEY = 'fitness_workout_templates';

function getCustomTemplatesAll(): CustomTemplate[] {
  return safeGet<CustomTemplate[]>(TEMPLATE_KEY, []);
}

export function getCustomTemplates(): CustomTemplate[] {
  return getCustomTemplatesAll();
}

export function saveCustomTemplate(template: CustomTemplate): void {
  const list = getCustomTemplatesAll();
  list.push(template);
  safeSet(TEMPLATE_KEY, list);
}

export function deleteCustomTemplate(id: string): void {
  const list = getCustomTemplatesAll();
  safeSet(
    TEMPLATE_KEY,
    list.filter((t) => t.id !== id),
  );
}

// --- ID Generation ---

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
}
