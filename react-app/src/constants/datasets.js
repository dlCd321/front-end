// 内置数据集定义
export const BUILTIN_DATASETS = {
    summer2021: {
        name: '夏季数据集 (2021)',
        description: '7-9月农田数据',
        data: [40, 38, 36, 35],
        humidityRange: { min: 35, max: 85 },
        dateRange: '2021-07-01 至 2021-09-30'
    },
    winter2021: {
        name: '冬季数据集 (2021-2022)',
        description: '12-2月农田数据',
        data: [32, 30, 31, 33],
        humidityRange: { min: 30, max: 65 },
        dateRange: '2021-12-01 至 2022-02-28'
    },
    spring2022: {
        name: '春季数据集 (2022)',
        description: '3-5月农田数据',
        data: [43, 40, 38, 36],
        humidityRange: { min: 36, max: 75 },
        dateRange: '2022-03-01 至 2022-05-31'
    }
};
