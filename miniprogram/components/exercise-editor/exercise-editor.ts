import { MUSCLE_GROUPS, EXERCISES_BY_GROUP } from '../../data/exercises';
import type { MuscleGroup } from '../../data/exercises';

const GROUP_KEYS: MuscleGroup[] = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];

Component({
  properties: {
    exercise: {
      type: Object,
      value: { name: '', sets: 3, reps: 10, weight: 0, note: '' },
    },
    isNew: {
      type: Boolean,
      value: true,
    },
  },

  data: {
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
    note: '',

    // preset selection
    groupKeys: GROUP_KEYS as string[],
    groupLabels: GROUP_KEYS.map((k) => MUSCLE_GROUPS[k]),
    groupIndex: 0,
    exerciseNames: [] as string[],
    exerciseIndex: 0,
  },

  lifetimes: {
    attached() {
      const ex = this.properties.exercise as Record<string, unknown>;
      this.setData({
        name: (ex.name as string) || '',
        sets: (ex.sets as number) || 3,
        reps: (ex.reps as number) || 10,
        weight: (ex.weight as number) || 0,
        note: (ex.note as string) || '',
      });
      this.updateExerciseNames(0);
    },
  },

  methods: {
    onNameInput(e: WechatMiniprogram.Input) {
      this.setData({ name: e.detail.value });
    },

    onSetsInput(e: WechatMiniprogram.Input) {
      this.setData({ sets: Number(e.detail.value) || 0 });
    },

    onRepsInput(e: WechatMiniprogram.Input) {
      this.setData({ reps: Number(e.detail.value) || 0 });
    },

    onWeightInput(e: WechatMiniprogram.Input) {
      this.setData({ weight: Number(e.detail.value) || 0 });
    },

    onNoteInput(e: WechatMiniprogram.Input) {
      this.setData({ note: e.detail.value });
    },

    onGroupChange(e: WechatMiniprogram.PickerChange) {
      const idx = Number(e.detail.value);
      this.setData({ groupIndex: idx });
      this.updateExerciseNames(idx);
    },

    updateExerciseNames(groupIdx: number) {
      const key = GROUP_KEYS[groupIdx];
      const exercises = EXERCISES_BY_GROUP[key];
      this.setData({
        exerciseNames: exercises.map((e) => e.name),
        exerciseIndex: 0,
      });
    },

    onExerciseSelect(e: WechatMiniprogram.PickerChange) {
      const idx = Number(e.detail.value);
      this.setData({ exerciseIndex: idx });

      const key = GROUP_KEYS[this.data.groupIndex];
      const exercises = EXERCISES_BY_GROUP[key];
      const preset = exercises[idx];
      if (preset) {
        this.setData({
          name: preset.name,
          note: preset.targetMuscles,
        });
      }
    },

    onSave() {
      const { name, sets, reps, weight, note } = this.data;
      if (!name.trim()) {
        wx.showToast({ title: '请输入动作名称', icon: 'none' });
        return;
      }
      if (sets <= 0) {
        wx.showToast({ title: '组数必须大于0', icon: 'none' });
        return;
      }
      this.triggerEvent('save', { name: name.trim(), sets, reps, weight, note });
    },

    onCancel() {
      this.triggerEvent('cancel');
    },
  },
});
