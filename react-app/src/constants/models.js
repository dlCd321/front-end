// 模型列表
export const MODEL_LIST = [
    { id: 'lstm', name: 'LSTM', type: '循环神经网络' },
    { id: 'lstm-attention', name: 'LSTM-Attention', type: '注意力机制模型' },
    { id: 'gru', name: 'GRU', type: '门控循环单元' },
    { id: 'bilstm', name: 'BiLSTM', type: '双向循环神经网络' }
];

// 模型详细信息
export const MODEL_INFO = {
    'lstm': { accuracy: '92.5%', trainTime: '2024-01-15', source: '传感器网络' },
    'lstm-attention': { accuracy: '95.1%', trainTime: '2024-01-15', source: '注意力加权数据' },
    'gru': { accuracy: '93.2%', trainTime: '2024-01-14', source: '时序序列数据' },
    'bilstm': { accuracy: '94.2%', trainTime: '2024-01-14', source: '双向时序数据' }
};
