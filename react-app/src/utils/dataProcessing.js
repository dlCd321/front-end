/**
 * 数据处理工具函数
 */

import { BUILTIN_DATASETS, DEFAULT_REASON } from '../constants';

/**
 * 从数据集构建图表序列数据
 * @param {string} datasetId - 数据集ID
 * @returns {Object} 包含历史数据、预测数据、统计信息等
 */
export function buildSeriesFromDataset(datasetId) {
    const dataset = BUILTIN_DATASETS[datasetId];
    if (!dataset) {
        return {
            historical: [45, 43, 41, 40],
            predicted: [40, 38, 36, 35],
            stats: { current: 40, min:
                    35, max: 78 },
            waterAmount: '15.0m³',
            reason: DEFAULT_REASON
        };
    }

    const baseValue = dataset.data[0];
    const historical = [baseValue + 5, baseValue + 3, baseValue + 1, baseValue];
    const predicted = dataset.data;
    const waterAmount = `${((100 - baseValue) * 0.3).toFixed(1)}m³`;

    return {
        historical,
        predicted,
        stats: {
            current: baseValue,
            min: dataset.humidityRange.min,
            max: dataset.humidityRange.max
        },
        waterAmount,
        reason: `基于${dataset.name}分析，数据范围：${dataset.dateRange}`
    };
}

/**
 * 标准化预测序列数据
 * @param {Array} predictionCurve - 预测曲线数据
 * @param {number} baseValue - 基准值
 * @returns {Array} 标准化后的预测序列（4个点）
 */
export function normalizePredictedSeries(predictionCurve, baseValue) {
    if (Array.isArray(predictionCurve) && predictionCurve.length >= 4) {
        const tail = predictionCurve.slice(-4);
        return tail.map((value, index) => {
            const numeric = Number(value);
            return Number.isFinite(numeric) ? numeric : baseValue - index * 2;
        });
    }

    return [baseValue, baseValue - 2, baseValue - 4, baseValue - 5];
}
