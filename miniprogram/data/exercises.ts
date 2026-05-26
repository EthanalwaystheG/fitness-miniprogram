export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';

export const MUSCLE_GROUPS: Record<MuscleGroup, string> = {
  chest: '胸部',
  back: '背部',
  legs: '腿部',
  shoulders: '肩部',
  arms: '手臂',
  core: '核心',
};

export interface PresetExercise {
  name: string;
  muscleGroup: MuscleGroup;
  targetMuscles: string;
}

export const EXERCISES_BY_GROUP: Record<MuscleGroup, PresetExercise[]> = {
  chest: [
    { name: '杠铃卧推', muscleGroup: 'chest', targetMuscles: '胸大肌、三角肌前束、肱三头肌' },
    { name: '哑铃卧推', muscleGroup: 'chest', targetMuscles: '胸大肌、三角肌前束、肱三头肌' },
    { name: '上斜卧推', muscleGroup: 'chest', targetMuscles: '胸大肌上部、三角肌前束' },
    { name: '下斜卧推', muscleGroup: 'chest', targetMuscles: '胸大肌下部、肱三头肌' },
    { name: '哑铃飞鸟', muscleGroup: 'chest', targetMuscles: '胸大肌、胸小肌' },
    { name: '绳索夹胸', muscleGroup: 'chest', targetMuscles: '胸大肌内侧、胸小肌' },
    { name: '俯卧撑', muscleGroup: 'chest', targetMuscles: '胸大肌、三角肌前束、肱三头肌' },
    { name: '双杠臂屈伸', muscleGroup: 'chest', targetMuscles: '胸大肌下部、肱三头肌' },
    { name: '器械推胸', muscleGroup: 'chest', targetMuscles: '胸大肌、三角肌前束' },
    { name: '斯万推胸', muscleGroup: 'chest', targetMuscles: '胸大肌内侧、胸小肌' },
  ],
  back: [
    { name: '引体向上', muscleGroup: 'back', targetMuscles: '背阔肌、大圆肌、肱二头肌' },
    { name: '杠铃划船', muscleGroup: 'back', targetMuscles: '背阔肌、斜方肌、菱形肌' },
    { name: '哑铃单臂划船', muscleGroup: 'back', targetMuscles: '背阔肌、菱形肌、肱二头肌' },
    { name: '高位下拉', muscleGroup: 'back', targetMuscles: '背阔肌、大圆肌、肱二头肌' },
    { name: '坐姿划船', muscleGroup: 'back', targetMuscles: '背阔肌、斜方肌中下部、菱形肌' },
    { name: '硬拉', muscleGroup: 'back', targetMuscles: '竖脊肌、臀大肌、腘绳肌' },
    { name: '直臂下压', muscleGroup: 'back', targetMuscles: '背阔肌、大圆肌' },
    { name: 'T杠划船', muscleGroup: 'back', targetMuscles: '背阔肌、斜方肌、菱形肌' },
    { name: '面拉', muscleGroup: 'back', targetMuscles: '三角肌后束、斜方肌中下部、菱形肌' },
    { name: '山羊挺身', muscleGroup: 'back', targetMuscles: '竖脊肌、臀大肌、腘绳肌' },
  ],
  legs: [
    { name: '杠铃深蹲', muscleGroup: 'legs', targetMuscles: '股四头肌、臀大肌、腘绳肌' },
    { name: '腿举', muscleGroup: 'legs', targetMuscles: '股四头肌、臀大肌' },
    { name: '罗马尼亚硬拉', muscleGroup: 'legs', targetMuscles: '腘绳肌、臀大肌、竖脊肌' },
    { name: '保加利亚分腿蹲', muscleGroup: 'legs', targetMuscles: '股四头肌、臀大肌、核心' },
    { name: '腿屈伸', muscleGroup: 'legs', targetMuscles: '股四头肌' },
    { name: '腿弯举', muscleGroup: 'legs', targetMuscles: '腘绳肌、腓肠肌' },
    { name: '臀推', muscleGroup: 'legs', targetMuscles: '臀大肌、腘绳肌' },
    { name: '哑铃箭步蹲', muscleGroup: 'legs', targetMuscles: '股四头肌、臀大肌、腘绳肌' },
    { name: '哈克深蹲', muscleGroup: 'legs', targetMuscles: '股四头肌、臀大肌' },
    { name: '站姿提踵', muscleGroup: 'legs', targetMuscles: '腓肠肌、比目鱼肌' },
  ],
  shoulders: [
    { name: '哑铃推举', muscleGroup: 'shoulders', targetMuscles: '三角肌前束、中束、肱三头肌' },
    { name: '杠铃推举', muscleGroup: 'shoulders', targetMuscles: '三角肌前束、中束、肱三头肌' },
    { name: '侧平举', muscleGroup: 'shoulders', targetMuscles: '三角肌中束' },
    { name: '前平举', muscleGroup: 'shoulders', targetMuscles: '三角肌前束' },
    { name: '俯身飞鸟', muscleGroup: 'shoulders', targetMuscles: '三角肌后束、菱形肌' },
    { name: '阿诺德推举', muscleGroup: 'shoulders', targetMuscles: '三角肌前束、中束、肱三头肌' },
    { name: '直立划船', muscleGroup: 'shoulders', targetMuscles: '三角肌中束、斜方肌' },
    { name: '绳索面拉', muscleGroup: 'shoulders', targetMuscles: '三角肌后束、斜方肌中下部' },
    { name: '器械推举', muscleGroup: 'shoulders', targetMuscles: '三角肌前束、中束' },
    { name: '倒立撑', muscleGroup: 'shoulders', targetMuscles: '三角肌前束、肱三头肌' },
  ],
  arms: [
    { name: '杠铃弯举', muscleGroup: 'arms', targetMuscles: '肱二头肌' },
    { name: '哑铃弯举', muscleGroup: 'arms', targetMuscles: '肱二头肌' },
    { name: '锤式弯举', muscleGroup: 'arms', targetMuscles: '肱二头肌、肱桡肌' },
    { name: '三头绳索下压', muscleGroup: 'arms', targetMuscles: '肱三头肌外侧头' },
    { name: '法式弯举', muscleGroup: 'arms', targetMuscles: '肱三头肌长头' },
    { name: '窄距卧推', muscleGroup: 'arms', targetMuscles: '肱三头肌、胸大肌内侧' },
    { name: '集中弯举', muscleGroup: 'arms', targetMuscles: '肱二头肌' },
    { name: '双杠臂屈伸', muscleGroup: 'arms', targetMuscles: '肱三头肌' },
    { name: '牧师凳弯举', muscleGroup: 'arms', targetMuscles: '肱二头肌' },
    { name: '仰卧臂屈伸', muscleGroup: 'arms', targetMuscles: '肱三头肌' },
  ],
  core: [
    { name: '平板支撑', muscleGroup: 'core', targetMuscles: '腹横肌、腹直肌、竖脊肌' },
    { name: '卷腹', muscleGroup: 'core', targetMuscles: '腹直肌上部' },
    { name: '仰卧举腿', muscleGroup: 'core', targetMuscles: '腹直肌下部、髋屈肌' },
    { name: '俄罗斯转体', muscleGroup: 'core', targetMuscles: '腹斜肌、腹直肌' },
    { name: '悬垂举腿', muscleGroup: 'core', targetMuscles: '腹直肌、髋屈肌、前锯肌' },
    { name: '侧平板支撑', muscleGroup: 'core', targetMuscles: '腹斜肌、腹横肌、臀中肌' },
    { name: '死虫式', muscleGroup: 'core', targetMuscles: '腹横肌、腹直肌、多裂肌' },
    { name: '登山者', muscleGroup: 'core', targetMuscles: '腹直肌、髋屈肌、三角肌前束' },
    { name: '健腹轮', muscleGroup: 'core', targetMuscles: '腹直肌、腹横肌、背阔肌' },
    { name: 'V字卷腹', muscleGroup: 'core', targetMuscles: '腹直肌、腹斜肌、髋屈肌' },
  ],
};
