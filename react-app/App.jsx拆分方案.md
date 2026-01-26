# App.jsx 重构方案

## 📊 当前状态
- **文件大小：** 1685 行
- **问题：** 所有代码堆在一个文件，难以维护

## 🎯 重构目标
- 按功能模块拆分
- 提高代码可维护性
- 便于团队协作
- 便于单元测试

---

## 📁 新的目录结构

```
src/
├── constants/              # 常量定义
│   ├── models.js          # 模型相关常量
│   ├── datasets.js        # 数据集定义
│   ├── farmData.js        # 农田数据
│   └── index.js           # 统一导出
│
├── services/              # API 服务
│   └── predictionApi.js   # 预测 API 调用
│
├── utils/                 # 工具函数
│   ├── dataProcessing.js  # 数据处理
│   └── chartHelpers.js    # 图表辅助函数
│
├── components/            # UI 组件
│   ├── Layout/
│   │   ├── Header.jsx     # 页面头部
│   │   └── Container.jsx  # 主容器
│   │
│   ├── FarmMonitor/       # 农田监测模块
│   │   ├── FarmCanvas.jsx       # 农田画布
│   │   ├── PlotSelector.jsx     # 地块选择器
│   │   ├── SoilParameters.jsx   # 土壤参数显示
│   │   └── IrrigationPlan.jsx   # 灌溉方案
│   │
│   ├── Prediction/        # 预测分析模块
│   │   ├── ModelSelector.jsx    # 模型选择器
│   │   ├── DepthSelector.jsx    # 深度选择器
│   │   ├── DateTimeSelector.jsx # 日期时间选择
│   │   ├── DataSourceSelector.jsx # 数据源选择
│   │   ├── PredictionChart.jsx  # 预测图表
│   │   └── PredictionControls.jsx # 预测控制
│   │
│   └── common/            # 通用组件
│       ├── Notification.jsx     # 通知消息
│       ├── ExportButtons.jsx    # 导出按钮
│       └── Tabs.jsx             # 标签切换
│
├── hooks/                 # 自定义 Hooks
│   ├── useChart.js        # 图表管理
│   ├── usePrediction.js   # 预测逻辑
│   └── useFileUpload.js   # 文件上传
│
├── App.jsx               # 主应用（精简后 < 200 行）
├── main.jsx              # 入口文件
└── index.css             # 全局样式
```

---

## 📝 拆分详细说明

### 1. constants/ - 常量定义

#### `constants/models.js`
```javascript
// 模型列表
export const MODEL_LIST = [
    { id: 'lstm', name: 'LSTM', type: '循环神经网络' },
    { id: 'lstm-attention', name: 'LSTM-Attention', type: '注意力机制模型' },
    { id: 'gru', name: 'GRU', type: '门控循环单元' },
    { id: 'bilstm', name: 'BiLSTM', type: '双向循环神经网络' }
];

// 模型信息
export const MODEL_INFO = {
    'lstm': { accuracy: '92.5%', trainTime: '2024-01-15', source: '传感器网络' },
    // ...
};
```

#### `constants/datasets.js`
```javascript
export const BUILTIN_DATASETS = {
    summer2021: {
        name: '夏季数据集 (2021)',
        description: '7-9月农田数据',
        data: [40, 38, 36, 35],
        humidityRange: { min: 35, max: 85 },
        dateRange: '2021-07-01 至 2021-09-30'
    },
    // ...
};
```

#### `constants/farmData.js`
```javascript
export const FARM_PLOTS = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

export const SOIL_PARAMS = {
    '1': { temperature: 22.5, humidity: 85, deficiency: 15 },
    // ...
};

export const IRRIGATION_PRESCRIPTION = {
    '1': { water: 8, fertilizer: 2.5 },
    // ...
};

export const YIELD_QUALITY_DATA = {
    '1': { yield: 920, sugar: 14.5 },
    // ...
};
```

#### `constants/index.js`
```javascript
export * from './models';
export * from './datasets';
export * from './farmData';
```

---

### 2. services/ - API 服务

#### `services/predictionApi.js`
```javascript
const API_URL = import.meta.env.VITE_PREDICTION_API_URL || 'http://localhost:8000/predict';

export const predictSoilMoisture = async (params) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    });

    if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
    }

    return response.json();
};
```

---

### 3. utils/ - 工具函数

#### `utils/dataProcessing.js`
```javascript
export function buildSeriesFromDataset(datasetId) {
    // 原来的 buildSeriesFromDataset 函数
}

export function normalizePredictedSeries(predictionCurve, baseValue) {
    // 原来的 normalizePredictedSeries 函数
}
```

#### `utils/chartHelpers.js`
```javascript
export function createChartConfig(data) {
    // Chart.js 配置
}

export function updateChartData(chart, newData) {
    // 更新图表数据
}
```

---

### 4. components/ - UI 组件

#### `components/Prediction/ModelSelector.jsx`
```javascript
import { MODEL_LIST } from '../../constants';

export default function ModelSelector({ value, onChange }) {
    return (
        <div className="model-selector">
            <label>选择模型：</label>
            <select value={value} onChange={(e) => onChange(e.target.value)}>
                {MODEL_LIST.map(model => (
                    <option key={model.id} value={model.id}>
                        {model.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
```

#### `components/Prediction/PredictionChart.jsx`
```javascript
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function PredictionChart({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        // 初始化和更新图表
    }, [data]);

    return <canvas ref={chartRef} />;
}
```

---

### 5. hooks/ - 自定义 Hooks

#### `hooks/usePrediction.js`
```javascript
import { useState } from 'react';
import { predictSoilMoisture } from '../services/predictionApi';

export function usePrediction() {
    const [status, setStatus] = useState('ready');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const predict = async (params) => {
        setStatus('predicting');
        try {
            const data = await predictSoilMoisture(params);
            setResult(data);
            setStatus('completed');
        } catch (err) {
            setError(err.message);
            setStatus('error');
        }
    };

    return { status, result, error, predict };
}
```

---

### 6. App.jsx - 主组件（重构后）

```javascript
import { useState } from 'react';
import Header from './components/Layout/Header';
import Tabs from './components/common/Tabs';
import FarmMonitor from './components/FarmMonitor';
import PredictionPanel from './components/Prediction';
import './App.css';

function App() {
    const [activeTab, setActiveTab] = useState('farm');

    return (
        <div className="app">
            <Header />
            <div className="container">
                <Tabs activeTab={activeTab} onChange={setActiveTab} />
                {activeTab === 'farm' ? <FarmMonitor /> : <PredictionPanel />}
            </div>
        </div>
    );
}

export default App;
```

**预计行数：** < 200 行（相比原来的 1685 行）

---

## 🚀 重构步骤

### 第一阶段：准备工作
1. ✅ 备份原始 App.jsx
2. ✅ 创建新的目录结构
3. ✅ 创建 index.js 文件

### 第二阶段：拆分常量（最简单）
1. 提取 MODEL_LIST → constants/models.js
2. 提取 BUILTIN_DATASETS → constants/datasets.js
3. 提取 FARM_PLOTS 等 → constants/farmData.js
4. 更新 App.jsx 中的 import

### 第三阶段：拆分工具函数
1. 提取数据处理函数 → utils/dataProcessing.js
2. 提取图表辅助函数 → utils/chartHelpers.js
3. 更新 App.jsx 中的 import

### 第四阶段：拆分 API 服务
1. 提取 API 调用 → services/predictionApi.js
2. 更新 App.jsx 中的调用方式

### 第五阶段：拆分 UI 组件（逐步进行）
1. 先拆分简单组件（ModelSelector, DepthSelector）
2. 再拆分复杂组件（PredictionChart, FarmCanvas）
3. 最后拆分容器组件（FarmMonitor, PredictionPanel）

### 第六阶段：优化和测试
1. 提取自定义 Hooks
2. 测试所有功能
3. 优化导入路径
4. 清理未使用的代码

---

## ✅ 重构后的优势

1. **可维护性：** 每个文件职责单一，易于理解
2. **可复用性：** 组件和工具函数可在其他地方使用
3. **可测试性：** 每个模块都可以独立测试
4. **协作友好：** 多人可以同时修改不同模块
5. **代码质量：** 便于代码审查和优化

---

## 🎯 立即开始？

我可以帮你：
1. **逐步拆分** - 一步一步进行，每次拆分一个模块
2. **一键重构** - 快速完成所有拆分
3. **自定义方案** - 根据你的需求调整拆分方式

请告诉我你想采用哪种方式！
