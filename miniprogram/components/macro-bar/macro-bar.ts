Component({
  properties: {
    protein: { type: Number, value: 0 },
    carbs: { type: Number, value: 0 },
    fat: { type: Number, value: 0 },
    mini: { type: Boolean, value: false },
  },

  data: {
    proteinPct: 0,
    carbsPct: 0,
    fatPct: 0,
  },

  observers: {
    'protein, carbs, fat'(p: number, c: number, f: number) {
      const total = p + c + f || 1;
      this.setData({
        proteinPct: Math.round((p / total) * 100),
        carbsPct: Math.round((c / total) * 100),
        fatPct: Math.round((f / total) * 100),
      });
    },
  },
});
