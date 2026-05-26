Component({
  properties: {
    current: { type: Number, value: 0 },
    target: { type: Number, value: 2000 },
    goal: { type: String, value: 'lose_fat' },
    size: { type: Number, value: 240 },
    strokeWidth: { type: Number, value: 20 },
    bgColor: { type: String, value: '#F0F0F0' },
    progressColor: { type: String, value: '#07C160' },
    overColor: { type: String, value: '#FA5151' },
  },

  data: {
    pct: 0,
    ringColor: '#07C160',
    rightDeg: 0,
    leftDeg: 0,
    halfSize: 120,
    innerSize: 110,
  },

  observers: {
    'current, target, goal, size, strokeWidth'(cur: number, tgt: number, g: string, sz: number, sw: number) {
      const safeTarget = tgt || 2000;
      const pct = Math.round((cur / safeTarget) * 100);
      const halfSize = sz / 2;
      const innerSize = halfSize - sw;

      let ringColor = this.properties.progressColor as string;

      if (g === 'gain_muscle') {
        // 增肌模式: 吃不够=黄, 接近=蓝, 达标=绿
        if (pct >= 100) ringColor = '#07C160';
        else if (pct >= 80) ringColor = '#4A90D9';
        else ringColor = '#FFC300';
      } else {
        // 减脂模式: 未超标=绿, 超标=红
        if (pct >= 100) ringColor = this.properties.overColor as string;
        else ringColor = '#07C160';
      }

      const rightDeg = Math.min(pct, 50) * (180 / 50);
      const leftDeg = pct > 50 ? (pct - 50) * (180 / 50) : 0;

      this.setData({
        pct: Math.min(pct, 999),
        ringColor,
        rightDeg,
        leftDeg,
        halfSize,
        innerSize,
      });
    },
  },

  methods: {
    formatCal(n: number): string {
      if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
      return String(n);
    },
  },
});
