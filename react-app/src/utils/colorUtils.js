/**
 * 颜色工具函数
 */

/**
 * 根据数值获取对应的颜色
 * @param {number} value - 当前值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {string} colorType - 颜色类型 ('blue' | 'orange' | 'green' | 'purple')
 * @returns {string} 颜色值
 */
export function getColorByValue(value, min, max, colorType = 'blue') {
    const normalized = (value - min) / (max - min || 1);

    if (colorType === 'blue') {
        if (normalized < 0.25) return '#BBDEFB';
        if (normalized < 0.5) return '#64B5F6';
        if (normalized < 0.75) return '#1976D2';
        return '#0D47A1';
    }
    if (colorType === 'orange') {
        if (normalized < 0.25) return '#FFE082';
        if (normalized < 0.5) return '#FFB74D';
        if (normalized < 0.75) return '#F57C00';
        return '#E65100';
    }
    if (colorType === 'green') {
        if (normalized < 0.25) return '#C8E6C9';
        if (normalized < 0.5) return '#81C784';
        if (normalized < 0.75) return '#388E3C';
        return '#1B5E20';
    }
    if (colorType === 'purple') {
        if (normalized < 0.25) return '#FFCDD2';
        if (normalized < 0.5) return '#EF5350';
        if (normalized < 0.75) return '#D32F2F';
        return '#B71C1C';
    }

    return '#e3f2fd';
}
