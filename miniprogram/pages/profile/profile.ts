import { getUserProfile, saveUserProfile, getWeightHistory, addWeightRecord, deleteWeightRecord, generateId } from '../../utils/storage';
import { calculateBMR, calculateTDEE, ACTIVITY_LABELS, ACTIVITY_OPTIONS } from '../../utils/bmr';
import { today, formatDisplay } from '../../utils/date';
import type { UserProfile, WeightRecord, Gender, ActivityLevel, ChartDataPoint } from '../../types/index';

const GENDER_OPTIONS: Gender[] = ['male', 'female'];
const GENDER_LABELS = ['男', '女'];

Component({
  data: {
    profile: null as UserProfile | null,
    height: 170,
    weight: 65,
    age: 25,
    genderIndex: 0,
    genderOptions: GENDER_LABELS as string[],
    activityIndex: 2,
    activityOptions: ACTIVITY_OPTIONS.map((a) => ACTIVITY_LABELS[a]) as string[],
    bmr: 0,
    tdee: 0,
    hasProfile: false,
    newWeight: '',
    weightHistory: [] as WeightRecord[],
    chartData: [] as ChartDataPoint[],
  },

  lifetimes: {
    attached() {
      this.loadData();
    },
  },

  pageLifetimes: {
    show() {
      this.loadData();
    },
  },

  methods: {
    loadData() {
      const profile = getUserProfile();
      if (profile) {
        const genderIndex = GENDER_OPTIONS.indexOf(profile.gender);
        const activityIndex = ACTIVITY_OPTIONS.indexOf(profile.activityLevel);
        this.setData({
          profile,
          height: profile.height,
          weight: profile.weight,
          age: profile.age,
          genderIndex: genderIndex >= 0 ? genderIndex : 0,
          activityIndex: activityIndex >= 0 ? activityIndex : 2,
          hasProfile: true,
        });
        this.updateBMR();
      }

      const weightHistory = getWeightHistory();
      const chartData: ChartDataPoint[] = [...weightHistory]
        .reverse()
        .map((r) => ({ date: r.date, value: r.weight }));
      this.setData({ weightHistory, chartData });
    },

    updateBMR() {
      const { height, weight, age, genderIndex } = this.data;
      const gender = GENDER_OPTIONS[genderIndex];
      const activityLevel = ACTIVITY_OPTIONS[this.data.activityIndex];
      const bmr = calculateBMR(weight, height, age, gender);
      const tdee = calculateTDEE(bmr, activityLevel);
      this.setData({ bmr, tdee });
    },

    onHeightInput(e: WechatMiniprogram.Input) {
      this.setData({ height: Number(e.detail.value) || 0 });
      this.updateBMR();
    },

    onWeightInput(e: WechatMiniprogram.Input) {
      this.setData({ weight: Number(e.detail.value) || 0 });
      this.updateBMR();
    },

    onAgeInput(e: WechatMiniprogram.Input) {
      this.setData({ age: Number(e.detail.value) || 0 });
      this.updateBMR();
    },

    onGenderChange(e: WechatMiniprogram.PickerChange) {
      this.setData({ genderIndex: Number(e.detail.value) });
      this.updateBMR();
    },

    onActivityChange(e: WechatMiniprogram.PickerChange) {
      this.setData({ activityIndex: Number(e.detail.value) });
      this.updateBMR();
    },

    onSaveProfile() {
      const { height, weight, age, genderIndex, activityIndex } = this.data;
      if (!height || !weight || !age) {
        wx.showToast({ title: '请填写完整的身体数据', icon: 'none' });
        return;
      }
      const profile: UserProfile = {
        height,
        weight,
        age,
        gender: GENDER_OPTIONS[genderIndex],
        activityLevel: ACTIVITY_OPTIONS[activityIndex],
        updatedAt: new Date().toISOString(),
      };
      saveUserProfile(profile);
      this.setData({ hasProfile: true, profile });
      wx.showToast({ title: '保存成功', icon: 'success' });
    },

    onNewWeightInput(e: WechatMiniprogram.Input) {
      this.setData({ newWeight: e.detail.value });
    },

    onRecordWeight() {
      const val = parseFloat(this.data.newWeight);
      if (!val || val <= 0 || val > 500) {
        wx.showToast({ title: '请输入有效体重', icon: 'none' });
        return;
      }
      const record: WeightRecord = {
        id: generateId(),
        date: today(),
        weight: Math.round(val * 10) / 10,
        createdAt: new Date().toISOString(),
      };
      addWeightRecord(record);
      this.setData({ newWeight: '' });
      wx.showToast({ title: '体重已记录', icon: 'success' });
      this.loadData();
    },

    onDeleteWeight(e: WechatMiniprogram.TouchEvent) {
      const id = e.currentTarget.dataset.id as string;
      wx.showModal({
        title: '删除确认',
        content: '确定要删除这条体重记录吗？',
        success: (res) => {
          if (res.confirm) {
            deleteWeightRecord(id);
            this.loadData();
          }
        },
      });
    },

    formatDate(str: string): string {
      return formatDisplay(str);
    },

    getWeightChange(index: number): string {
      const list = this.data.weightHistory;
      if (index >= list.length - 1) return '';
      const diff = list[index].weight - list[index + 1].weight;
      if (diff === 0) return '持平';
      return diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
    },
  },
});
