export interface TemplateExercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  note: string;
}

export interface WorkoutTemplate {
  key: string;
  name: string;
  description: string;
  exercises: TemplateExercise[];
}

export const PPL_TEMPLATES: WorkoutTemplate[] = [
  {
    key: 'push',
    name: '推日 Push',
    description: '胸、肩、肱三头肌',
    exercises: [
      { name: '杠铃卧推', sets: 4, reps: 8, weight: 60, note: '胸大肌' },
      { name: '上斜哑铃卧推', sets: 3, reps: 10, weight: 20, note: '胸大肌上部' },
      { name: '哑铃飞鸟', sets: 3, reps: 12, weight: 10, note: '胸大肌、胸小肌' },
      { name: '哑铃推举', sets: 4, reps: 10, weight: 16, note: '三角肌前束、中束' },
      { name: '侧平举', sets: 3, reps: 15, weight: 6, note: '三角肌中束' },
      { name: '三头绳索下压', sets: 3, reps: 12, weight: 15, note: '肱三头肌外侧头' },
    ],
  },
  {
    key: 'pull',
    name: '拉日 Pull',
    description: '背、肱二头肌',
    exercises: [
      { name: '硬拉', sets: 3, reps: 5, weight: 80, note: '竖脊肌、腘绳肌、臀大肌' },
      { name: '引体向上', sets: 4, reps: 8, weight: 0, note: '背阔肌、肱二头肌（自重）' },
      { name: '杠铃划船', sets: 4, reps: 8, weight: 50, note: '背阔肌、斜方肌' },
      { name: '高位下拉', sets: 3, reps: 12, weight: 40, note: '背阔肌、大圆肌' },
      { name: '面拉', sets: 3, reps: 15, weight: 10, note: '三角肌后束、斜方肌' },
      { name: '杠铃弯举', sets: 3, reps: 12, weight: 20, note: '肱二头肌' },
    ],
  },
  {
    key: 'legs',
    name: '腿日 Legs',
    description: '腿、核心',
    exercises: [
      { name: '杠铃深蹲', sets: 4, reps: 8, weight: 70, note: '股四头肌、臀大肌、核心' },
      { name: '罗马尼亚硬拉', sets: 3, reps: 10, weight: 60, note: '腘绳肌、臀大肌' },
      { name: '腿举', sets: 3, reps: 12, weight: 100, note: '股四头肌、臀大肌' },
      { name: '腿弯举', sets: 3, reps: 12, weight: 30, note: '腘绳肌' },
      { name: '站姿提踵', sets: 4, reps: 15, weight: 40, note: '腓肠肌、比目鱼肌' },
      { name: '平板支撑', sets: 3, reps: 60, weight: 0, note: '腹横肌、核心稳定性（秒）' },
    ],
  },
];
