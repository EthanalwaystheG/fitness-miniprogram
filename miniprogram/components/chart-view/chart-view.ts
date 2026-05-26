import type { ChartDataPoint } from '../../types/index';

interface ChartPoint {
  date: string;
  value: number;
  x: number;
  y: number;
}

Component({
  properties: {
    data: {
      type: Array,
      value: [] as ChartDataPoint[],
    },
    width: {
      type: Number,
      value: 650,
    },
    height: {
      type: Number,
      value: 400,
    },
    lineColor: {
      type: String,
      value: '#07C160',
    },
    showGrid: {
      type: Boolean,
      value: true,
    },
    pointRadius: {
      type: Number,
      value: 6,
    },
  },

  data: {
    points: [] as ChartPoint[],
    lines: [] as Array<{ x1: number; y1: number; x2: number; y2: number; w: number; angle: number }>,
    yLabels: [] as string[],
    minVal: 0,
    maxVal: 0,
    paddingLeft: 80,
    paddingRight: 24,
    paddingTop: 24,
    paddingBottom: 48,
    chartW: 0,
    chartH: 0,
  },

  observers: {
    'data, width, height'(data: ChartDataPoint[], w: number, h: number) {
      if (!data || data.length === 0) {
        this.setData({ points: [], lines: [], yLabels: [] });
        return;
      }
      this.computeChart(data, w, h);
    },
  },

  methods: {
    computeChart(rawData: ChartDataPoint[], width: number, height: number) {
      const padL = this.data.paddingLeft;
      const padR = this.data.paddingRight;
      const padT = this.data.paddingTop;
      const padB = this.data.paddingBottom;
      const chartW = width - padL - padR;
      const chartH = height - padT - padB;

      const values = rawData.map((d) => d.value);
      let minVal = Math.min(...values);
      let maxVal = Math.max(...values);
      const range = maxVal - minVal || 1;
      minVal = Math.floor(minVal - range * 0.1);
      maxVal = Math.ceil(maxVal + range * 0.1);
      const valRange = maxVal - minVal;

      // Map points
      const count = rawData.length;
      const points: ChartPoint[] = rawData.map((d, i) => ({
        date: d.date,
        value: d.value,
        x: count === 1 ? chartW / 2 : (i / (count - 1)) * chartW,
        y: chartH - ((d.value - minVal) / valRange) * chartH,
      }));

      // Compute line segments
      const lines: Array<{ x1: number; y1: number; x2: number; y2: number; w: number; angle: number }> = [];
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const w = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, w, angle });
      }

      // Y-axis labels
      const ySteps = 4;
      const yLabels: string[] = [];
      for (let i = 0; i <= ySteps; i++) {
        yLabels.push((maxVal - (valRange / ySteps) * i).toFixed(1));
      }

      this.setData({
        points,
        lines,
        yLabels,
        minVal,
        maxVal,
        chartW,
        chartH,
        paddingLeft: padL,
        paddingRight: padR,
        paddingTop: padT,
        paddingBottom: padB,
      });
    },

    formatDateLabel(dateStr: string): string {
      const parts = (dateStr || '').split('-');
      return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : '';
    },
  },
});
