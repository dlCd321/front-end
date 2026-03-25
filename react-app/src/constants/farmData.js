// 农田地块列表 (1-24号地块)
export const FARM_PLOTS = Array.from({ length: 24 }, (_, i) => (i + 1).toString());

// 土壤参数数据
export const SOIL_PARAMS = {
    '1': { temperature: 21.9, humidity: 78, deficiency: 22, ph: 6.6, nitrogen: 18 },
    '2': { temperature: 22.4, humidity: 74, deficiency: 28, ph: 6.5, nitrogen: 17 },
    '3': { temperature: 22.8, humidity: 69, deficiency: 39, ph: 6.7, nitrogen: 16 },
    '4': { temperature: 21.7, humidity: 66, deficiency: 44, ph: 6.8, nitrogen: 15 },
    '5': { temperature: 23.1, humidity: 61, deficiency: 52, ph: 6.4, nitrogen: 14 },
    '6': { temperature: 22.5, humidity: 57, deficiency: 56, ph: 6.5, nitrogen: 14 },
    '7': { temperature: 23.3, humidity: 48, deficiency: 68, ph: 6.3, nitrogen: 12 },
    '8': { temperature: 22.2, humidity: 51, deficiency: 63, ph: 6.2, nitrogen: 13 },
    '9': { temperature: 21.8, humidity: 55, deficiency: 58, ph: 6.6, nitrogen: 14 },
    '10': { temperature: 22.6, humidity: 60, deficiency: 49, ph: 6.7, nitrogen: 15 },
    '11': { temperature: 23.0, humidity: 64, deficiency: 43, ph: 6.8, nitrogen: 16 },
    '12': { temperature: 22.1, humidity: 72, deficiency: 31, ph: 6.5, nitrogen: 17 },
    '13': { temperature: 22.9, humidity: 58, deficiency: 54, ph: 6.4, nitrogen: 13 },
    '14': { temperature: 23.4, humidity: 46, deficiency: 71, ph: 6.2, nitrogen: 12 },
    '15': { temperature: 22.7, humidity: 49, deficiency: 67, ph: 6.3, nitrogen: 12 },
    '16': { temperature: 21.6, humidity: 62, deficiency: 46, ph: 6.6, nitrogen: 15 },
    '17': { temperature: 22.0, humidity: 76, deficiency: 24, ph: 6.7, nitrogen: 18 },
    '18': { temperature: 22.8, humidity: 73, deficiency: 27, ph: 6.8, nitrogen: 18 },
    '19': { temperature: 23.2, humidity: 59, deficiency: 53, ph: 6.4, nitrogen: 13 },
    '20': { temperature: 22.4, humidity: 54, deficiency: 59, ph: 6.3, nitrogen: 13 },
    '21': { temperature: 22.9, humidity: 47, deficiency: 69, ph: 6.1, nitrogen: 11 },
    '22': { temperature: 21.9, humidity: 65, deficiency: 41, ph: 6.6, nitrogen: 15 },
    '23': { temperature: 22.3, humidity: 71, deficiency: 29, ph: 6.7, nitrogen: 17 },
    '24': { temperature: 23.1, humidity: 52, deficiency: 61, ph: 6.2, nitrogen: 12 }
};

// 灌溉处方数据（L）
export const IRRIGATION_PRESCRIPTION = {
    '1': { water: 0.24, priority: '低', note: '墒情稳定，维持巡检' },
    '2': { water: 0.31, priority: '低', note: '短时补水即可' },
    '3': { water: 0.38, priority: '中低', note: '建议傍晚补水' },
    '4': { water: 0.43, priority: '中低', note: '保持现有轮灌节奏' },
    '5': { water: 0.57, priority: '中高', note: '先滴灌后复测' },
    '6': { water: 0.61, priority: '中高', note: '建议与 5 号地块联动' },
    '7': { water: 0.82, priority: '高', note: '根层干燥，优先灌溉' },
    '8': { water: 0.74, priority: '高', note: '需立即补水并观察回渗' },
    '9': { water: 0.67, priority: '中高', note: '当前灌溉中，继续监控' },
    '10': { water: 0.49, priority: '中低', note: '常规补水即可' },
    '11': { water: 0.36, priority: '中低', note: '轻度失墒，建议补水' },
    '12': { water: 0.28, priority: '低', note: '保持现状' },
    '13': { water: 0.59, priority: '中高', note: '建议今日完成灌溉' },
    '14': { water: 0.84, priority: '高', note: '严重缺水，置顶处理' },
    '15': { water: 0.77, priority: '高', note: '建议两段式补水' },
    '16': { water: 0.46, priority: '中低', note: '适量滴灌' },
    '17': { water: 0.25, priority: '低', note: '墒情良好，无需额外操作' },
    '18': { water: 0.22, priority: '低', note: '保持巡检频率' },
    '19': { water: 0.63, priority: '中高', note: '与 20 号地块同步调度' },
    '20': { water: 0.69, priority: '中高', note: '建议晚间灌溉' },
    '21': { water: 0.81, priority: '高', note: '优先级高，尽快执行' },
    '22': { water: 0.41, priority: '中低', note: '分次补水更稳妥' },
    '23': { water: 0.33, priority: '低', note: '轻度缺水，低频补水' },
    '24': { water: 0.72, priority: '高', note: '建议联动施灌设备' }
};

// 产量质量数据
export const YIELD_QUALITY_DATA = {
    '1': { yield: 918, sugar: 14.2 },
    '2': { yield: 904, sugar: 14.0 },
    '3': { yield: 876, sugar: 13.4 },
    '4': { yield: 860, sugar: 13.1 },
    '5': { yield: 828, sugar: 12.6 },
    '6': { yield: 816, sugar: 12.3 },
    '7': { yield: 748, sugar: 10.8 },
    '8': { yield: 772, sugar: 11.2 },
    '9': { yield: 801, sugar: 12.0 },
    '10': { yield: 842, sugar: 12.7 },
    '11': { yield: 858, sugar: 13.0 },
    '12': { yield: 892, sugar: 13.6 },
    '13': { yield: 824, sugar: 12.4 },
    '14': { yield: 731, sugar: 10.4 },
    '15': { yield: 754, sugar: 10.9 },
    '16': { yield: 838, sugar: 12.5 },
    '17': { yield: 926, sugar: 14.3 },
    '18': { yield: 936, sugar: 14.5 },
    '19': { yield: 819, sugar: 12.2 },
    '20': { yield: 798, sugar: 11.9 },
    '21': { yield: 742, sugar: 10.6 },
    '22': { yield: 871, sugar: 13.2 },
    '23': { yield: 903, sugar: 13.9 },
    '24': { yield: 786, sugar: 11.5 }
};

// 默认常量
export const DEFAULT_REASON = '此时温度适宜（24°C），蒸散压力较低，适合进行节水灌溉。';
export const DEFAULT_API_URL = 'http://localhost:8000/predict';
