import { getWorkoutByDate, saveWorkoutRecord, deleteWorkoutRecord, generateId, getCustomTemplates, saveCustomTemplate, deleteCustomTemplate } from '../../utils/storage';
import { today, formatDisplay } from '../../utils/date';
import { PPL_TEMPLATES } from '../../data/templates';
import type { WorkoutRecord, Exercise, CustomTemplate, TemplateExercise } from '../../types/index';

interface TemplateItem {
  key: string;
  name: string;
  description: string;
  exercises: TemplateExercise[];
  isCustom: boolean;
}

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
    allTemplates: [] as TemplateItem[],
    // template picker
    showPicker: false,
    pickerName: '',
    pickerDesc: '',
    pickerExercises: [] as TemplateExercise[],
  },

  lifetimes: {
    attached() {
      this.setData({ displayDate: formatDisplay(this.data.selectedDate) });
      this.loadWorkout();
      this.loadTemplates();
    },
  },

  pageLifetimes: {
    show() {
      this.loadWorkout();
      this.loadTemplates();
    },
  },

  methods: {
    loadTemplates() {
      const presets: TemplateItem[] = PPL_TEMPLATES.map((t) => ({
        key: t.key,
        name: t.name,
        description: t.description,
        exercises: t.exercises,
        isCustom: false,
      }));
      const customs: TemplateItem[] = getCustomTemplates().map((t) => ({
        key: t.id,
        name: t.name,
        description: `${t.exercises.length} 个动作 · 自定义`,
        exercises: t.exercises,
        isCustom: true,
      }));
      this.setData({ allTemplates: [...presets, ...customs] });
    },

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
          if (res.confirm) this.removeExercise(index);
        },
      });
    },

    onClearAll() {
      if (this.data.exercises.length === 0) return;
      wx.showModal({
        title: '清空今日训练',
        content: `确定要清空全部 ${this.data.exercises.length} 个训练动作吗？此操作不可恢复。`,
        confirmColor: '#FA5151',
        success: (res) => {
          if (res.confirm) {
            deleteWorkoutRecord(this.data.recordId);
            wx.showToast({ title: '已清空', icon: 'success' });
            this.loadWorkout();
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

    // --- Template picker ---

    onLoadTemplate(e: WechatMiniprogram.TouchEvent) {
      const key = e.currentTarget.dataset.key as string;
      const template = this.data.allTemplates.find((t) => t.key === key);
      if (!template) return;
      this.setData({
        showPicker: true,
        pickerName: template.name,
        pickerDesc: template.description,
        pickerExercises: template.exercises,
      });
    },

    onPickerConfirm(e: WechatMiniprogram.CustomEvent) {
      const selected = e.detail as TemplateExercise[];
      this.setData({ showPicker: false });
      this.applyTemplate(selected);
    },

    onPickerCancel() {
      this.setData({ showPicker: false });
    },

    // --- Delete custom template ---

    onDeleteTemplate(e: WechatMiniprogram.TouchEvent) {
      const key = e.currentTarget.dataset.key as string;
      const template = this.data.allTemplates.find((t) => t.key === key);
      if (!template || !template.isCustom) return;
      wx.showModal({
        title: '删除模板',
        content: `确定要删除自定义模板"${template.name}"吗？`,
        confirmColor: '#FA5151',
        success: (res) => {
          if (res.confirm) {
            deleteCustomTemplate(key);
            wx.showToast({ title: '已删除', icon: 'success' });
            this.loadTemplates();
          }
        },
      });
    },

    applyTemplate(exercises: TemplateExercise[]) {
      const { selectedDate, recordId } = this.data;

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

      for (const ex of exercises) {
        record.exercises.push({ ...ex, id: generateId() });
      }
      record.updatedAt = new Date().toISOString();
      saveWorkoutRecord(record);
      wx.showToast({ title: `已添加 ${exercises.length} 个动作`, icon: 'success' });
      this.loadWorkout();
    },

    // --- Save custom template ---

    onSaveAsTemplate() {
      const exercises = this.data.exercises;
      if (exercises.length === 0) return;
      wx.showModal({
        title: '保存为模板',
        editable: true,
        placeholderText: '输入模板名称',
        success: (res) => {
          if (res.confirm && res.content) {
            const tpl: CustomTemplate = {
              id: generateId(),
              name: res.content.trim(),
              exercises: exercises.map((ex) => ({
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight,
                note: ex.note || '',
              })),
              createdAt: new Date().toISOString(),
            };
            saveCustomTemplate(tpl);
            wx.showToast({ title: '模板已保存', icon: 'success' });
            this.loadTemplates();
          }
        },
      });
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
