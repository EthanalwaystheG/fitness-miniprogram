interface TemplateExercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  note: string;
}

interface CheckedExercise extends TemplateExercise {
  checked: boolean;
}

Component({
  properties: {
    templateName: { type: String, value: '' },
    templateDesc: { type: String, value: '' },
    exercises: { type: Array, value: [] as TemplateExercise[] },
  },

  data: {
    items: [] as CheckedExercise[],
    selectedCount: 0,
  },

  observers: {
    'exercises'(list: TemplateExercise[]) {
      if (!list || list.length === 0) return;
      const items: CheckedExercise[] = list.map((ex) => ({ ...ex, checked: true }));
      this.setData({ items, selectedCount: items.length });
    },
  },

  methods: {
    onToggle(e: WechatMiniprogram.TouchEvent) {
      const idx = e.currentTarget.dataset.index as number;
      const items = this.data.items;
      items[idx].checked = !items[idx].checked;
      const selectedCount = items.filter((it) => it.checked).length;
      this.setData({ items, selectedCount });
    },

    onConfirm() {
      const selected = this.data.items.filter((it) => it.checked).map(({ checked, ...ex }) => ex);
      if (selected.length === 0) {
        wx.showToast({ title: '请至少选择一个动作', icon: 'none' });
        return;
      }
      this.triggerEvent('confirm', selected);
    },

    onCancel() {
      this.triggerEvent('cancel');
    },
  },
});
