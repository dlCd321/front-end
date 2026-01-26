/**
 * 预测 API 服务
 */

import { DEFAULT_API_URL } from '../constants';

/**
 * 调用后端预测接口
 * @param {Object} params - 预测参数
 * @param {string} params.model_id - 模型ID
 * @param {string} params.soil_depth - 土壤深度
 * @param {string} params.prediction_date - 预测日期
 * @param {string} params.prediction_time - 预测时间
 * @param {string} params.data_source - 数据源
 * @param {Object} params.uploaded_data - 上传的数据（可选）
 * @returns {Promise<Object>} 预测结果
 */
export async function predictSoilMoisture(params) {
    const apiUrl = import.meta.env.VITE_PREDICTION_API_URL || DEFAULT_API_URL;

    console.log('📡 调用预测API:', apiUrl);
    console.log('📦 请求参数:', params);

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    });

    if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ API响应:', result);

    return result;
}
