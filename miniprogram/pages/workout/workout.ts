import { getWorkoutByDate, saveWorkoutRecord, deleteWorkoutRecord, generateId } from '../../utils/storage';
import { today, formatDisplay } from '../../utils/date';
import type { WorkoutRecord, Exercise } from '../../types/index';

Component({
  data: {
    selectedDate: today(),
    displayDate: '',
    exercises: [] as Exercise[],
    recordId: '',
    showEditor: false,
    isNewExercise: true,
    currentExercise: { name: '', sets: 3, reps: 10, weight: 0, note: '' } as Exercise,
    editIndex: -1,
    totalSets: 0,
  },

  lifetimes: {
    attached() {
      this.setData({ displayDate: formatDisplay(this.data.selectedDate) });
      this.loadWorkout();
    },
  },

  pageLifetimes: {
    show() {
      this.loadWorkout();
    },
  },

  methods: {
    loadWorkout() {
      const record = getWorkoutByDate(this.data.selectedDate);
      if (record) {
        const totalSets = record.exercises.reduce((sum, e) => sum + e.sets, 0);
        this.setData({
          exercises: record.exercises,
          recordId: record.id,
          totalSets,
        });
      } else {
        this.setData({ exercises: [], recordId: '', totalSets: 0 });
      }
    },

    onDateChange(e: WechatMiniprogram.PickerChange) {
      const date = e.detail.value as string;
      this.setData({ selectedDate: date, displayDate: formatDisplay(date) });
      this.loadWorkout();
    },

    onAddExercise() {
      this.setData({
        showEditor: true,
        isNewExercise: true,
        editIndex: -1,
        currentExercise: { name: '', sets: 3, reps: 10, weight: 0, note: '' } as unknown as Exercise,
      });
    },

    onEditExercise(e: WechatMiniprogram.TouchEvent) {
      const index = e.currentTarget.dataset.index as number;
      const exercise = this.data.exercises[index];
      this.setData({
        showEditor: true,
        isNewExercise: false,
        editIndex: index,
        currentExercise: { ...exercise },
      });
    },

    onDeleteExercise(e: WechatMiniprogram.TouchEvent) {
      const index = e.currentTarget.dataset.index as number;
      wx.showModal({
        title: '删除确认',
        content: '确定要删除这个训练动作吗？',
        success: (res) => {
          if (res.confirm) {
            this.removeExercise(index);
          }
        },
      });
    },

    onSaveExercise(e: WechatMiniprogram.CustomEvent) {
      const exercise = e.detail as Exercise;
      const { selectedDate, recordId, isNewExercise, editIndex } = this.data;

      let record: WorkoutRecord;
      const existing = getWorkoutByDate(selectedDate);

      if (existing) {
        record = existing;
      } else {
        record = {
          id: recordId || generateId(),
          date: selectedDate,
          exercises: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      if (isNewExercise) {
        record.exercises.push({ ...exercise, id: generateId() });
      } else {
        record.exercises[editIndex] = { ...exercise, id: record.exercises[editIndex].id };
      }

      record.updatedAt = new Date().toISOString();
      saveWorkoutRecord(record);
      this.setData({ showEditor: false });
      this.loadWorkout();
    },

    onCloseEditor() {
      this.setData({ showEditor: false });
    },

    removeExercise(index: number) {
      const record = getWorkoutByDate(this.data.selectedDate);
      if (!record) return;
      record.exercises.splice(index, 1);
      record.updatedAt = new Date().toISOString();

      if (record.exercises.length === 0) {
        deleteWorkoutRecord(record.id);
      } else {
        saveWorkoutRecord(record);
      }
      this.loadWorkout();
    },
  },
});
