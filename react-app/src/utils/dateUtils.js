/**
 * 日期格式化工具函数
 */

/**
 * 将日期字符串格式化为 YYYY/MM/DD 格式
 * @param {string} dateString - 日期字符串
 * @returns {string} 格式化后的日期字符串
 */
export function formatDateToYYYYMMDD(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
}
