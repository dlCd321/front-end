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

/**
 * 根据需水量映射灌溉处方颜色
 * @param {number} water - 需水量，单位 L
 * @returns {{fill: string, stroke: string, level: string}}
 */
export function getColorByWater(water) {
    if (water <= 0.35) {
        return {
            fill: '#0A3D5C',
            stroke: 'rgba(0, 229, 204, 0.4)',
            level: '低需水'
        };
    }

    if (water <= 0.55) {
        return {
            fill: '#0E5A80',
            stroke: 'rgba(0, 180, 216, 0.28)',
            level: '中低'
        };
    }

    if (water <= 0.70) {
        return {
            fill: '#0077B6',
            stroke: 'rgba(0, 119, 182, 0.3)',
            level: '中高'
        };
    }

    return {
        fill: '#003D7A',
        stroke: 'rgba(0, 61, 122, 0.34)',
        level: '高需水'
    };
}
