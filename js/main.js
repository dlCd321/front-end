// 模型列表
const MODEL_LIST = [
    { id: 'bilstm-seq2seq-2', name: 'Bi-LSTM-seq2seq(2)', type: '序列到序列模型' },
    { id: 'cnn', name: 'CNN', type: '卷积神经网络' },
    { id: 'cnn-bilstm-1', name: 'CNN-BiLSTM (1)', type: '混合模型' },
    { id: 'cnn-bilstm-attention1', name: 'CNN-BiLSTM-Attention1', type: '注意力机制模型' },
    { id: 'lstm', name: 'LSTM', type: '循环神经网络' },
    { id: 'seq2seq-bilstm-1', name: 'seq2seq-BiLSTM(1)', type: '编码器-解码器模型' },
    { id: 'xgboost', name: 'XGBoost', type: '梯度提升树' }
];

// 模型详细信息
const MODEL_INFO = {
    'bilstm-seq2seq-2': { accuracy: '94.2%', trainTime: '2024-01-10', source: '多传感器融合' },
    'cnn': { accuracy: '91.5%', trainTime: '2024-01-12', source: '图像+时序数据' },
    'cnn-bilstm-1': { accuracy: '93.8%', trainTime: '2024-01-14', source: '多模态数据' },
    'cnn-bilstm-attention1': { accuracy: '95.1%', trainTime: '2024-01-15', source: '注意力加权数据' },
    'lstm': { accuracy: '92.5%', trainTime: '2024-01-15', source: '传感器网络' },
    'seq2seq-bilstm-1': { accuracy: '93.9%', trainTime: '2024-01-13', source: '时序序列数据' },
    'xgboost': { accuracy: '90.8%', trainTime: '2024-01-11', source: '特征工程数据' }
};

// 内置数据集信息
const BUILTIN_DATASETS = {
    'summer2023': {
        name: '夏季数据集 (2023)',
        description: '7-9月农田数据',
        data: [40, 38, 36, 35],
        humidity_range: { min: 35, max: 85 },
        date_range: '2023-07-01 至 2023-09-30'
    },
    'spring2024': {
        name: '春季数据集 (2024)',
        description: '3-5月农田数据',
        data: [43, 40, 38, 36],
        humidity_range: { min: 36, max: 75 },
        date_range: '2024-03-01 至 2024-05-31'
    },
    'winter2023': {
        name: '冬季数据集 (2023)',
        description: '12-2月农田数据',
        data: [32, 30, 31, 33],
        humidity_range: { min: 30, max: 65 },
        date_range: '2023-12-01 至 2024-02-28'
    }
};

// 农田地块数据 - 使用数字编号1-20（5x4布局）
const FARM_PLOTS = Array.from({length: 20}, (_, i) => (i + 1).toString());

// 土壤参数数据（模拟）- 设置多个需灌溉地块
const SOIL_PARAMS = {
    '1': { temperature: 22.5, humidity: 85, deficiency: 15 },
    '2': { temperature: 23.1, humidity: 65, deficiency: 35 },
    '3': { temperature: 21.8, humidity: 70, deficiency: 30 },
    '4': { temperature: 22.9, humidity: 60, deficiency: 40 },
    '5': { temperature: 23.5, humidity: 55, deficiency: 45 },
    '6': { temperature: 22.2, humidity: 75, deficiency: 25 },
    '7': { temperature: 21.5, humidity: 80, deficiency: 20 },
    '8': { temperature: 23.8, humidity: 30, deficiency: 70 }, // 缺水严重（需灌溉）
    '9': { temperature: 22.1, humidity: 50, deficiency: 50 }, // 缺水（需灌溉）
    '10': { temperature: 23.2, humidity: 65, deficiency: 35 },
    '11': { temperature: 21.9, humidity: 72, deficiency: 28 },
    '12': { temperature: 22.7, humidity: 68, deficiency: 32 },
    '13': { temperature: 23.4, humidity: 58, deficiency: 42 },
    '14': { temperature: 22.0, humidity: 63, deficiency: 37 },
    '15': { temperature: 23.6, humidity: 45, deficiency: 55 }, // 缺水（需灌溉）
    '16': { temperature: 22.4, humidity: 77, deficiency: 23 },
    '17': { temperature: 21.7, humidity: 82, deficiency: 18 },
    '18': { temperature: 23.0, humidity: 40, deficiency: 60 }, // 缺水严重（需灌溉）
    '19': { temperature: 22.3, humidity: 53, deficiency: 47 },
    '20': { temperature: 23.3, humidity: 48, deficiency: 52 }  // 缺水（需灌溉）
};

// 灌溉处方数据 - 使用数字编号（修改为20个地块）
const IRRIGATION_PRESCRIPTION = {
    '1': { water: 8, fertilizer: 2.5 },
    '2': { water: 12, fertilizer: 3.2 },
    '3': { water: 10, fertilizer: 3.0 },
    '4': { water: 14, fertilizer: 3.8 },
    '5': { water: 11, fertilizer: 3.1 },
    '6': { water: 9, fertilizer: 2.8 },
    '7': { water: 7, fertilizer: 2.3 },
    '8': { water: 20, fertilizer: 5.5 }, // 高需水肥
    '9': { water: 15, fertilizer: 4.0 },
    '10': { water: 12, fertilizer: 3.3 },
    '11': { water: 10, fertilizer: 2.9 },
    '12': { water: 13, fertilizer: 3.5 },
    '13': { water: 16, fertilizer: 4.2 },
    '14': { water: 14, fertilizer: 3.9 },
    '15': { water: 18, fertilizer: 4.8 }, // 较高需水肥
    '16': { water: 8, fertilizer: 2.6 },
    '17': { water: 6, fertilizer: 2.0 },
    '18': { water: 22, fertilizer: 6.0 }, // 最高需水肥
    '19': { water: 17, fertilizer: 4.5 },
    '20': { water: 13, fertilizer: 3.6 }
};

// 产量和品质数据 - 使用数字编号（修改为20个地块）
const YIELD_QUALITY_DATA = {
    '1': { yield: 920, sugar: 14.5 }, // 高产高糖
    '2': { yield: 850, sugar: 13.2 },
    '3': { yield: 880, sugar: 13.8 },
    '4': { yield: 810, sugar: 12.5 },
    '5': { yield: 870, sugar: 13.5 },
    '6': { yield: 900, sugar: 14.0 },
    '7': { yield: 930, sugar: 14.3 },
    '8': { yield: 680, sugar: 10.2 }, // 低产低糖
    '9': { yield: 780, sugar: 11.8 },
    '10': { yield: 820, sugar: 12.7 },
    '11': { yield: 860, sugar: 13.3 },
    '12': { yield: 840, sugar: 12.9 },
    '13': { yield: 790, sugar: 11.9 },
    '14': { yield: 830, sugar: 12.6 },
    '15': { yield: 720, sugar: 10.8 }, // 低产低糖
    '16': { yield: 910, sugar: 14.1 },
    '17': { yield: 940, sugar: 14.4 },
    '18': { yield: 650, sugar: 9.8 }, // 最低产低糖
    '19': { yield: 770, sugar: 11.5 },
    '20': { yield: 800, sugar: 12.2 }
};

// 当前选择的模型和深度
let currentModel = 'lstm';
let currentDepth = '20';
let predictionChart = null;

// 当前数据源
let currentDataSource = 'summer2023';
let uploadedFileData = null;

// 最近一次预测数据
let lastPredictionData = null;

// 初始化农田网格 - 使用数字编号
function initFarmGrid() {
    const farmGrid = document.getElementById('farmGrid');
    
    // 清空现有内容
    farmGrid.innerHTML = '';
    
    // 创建5x4的农田网格，使用数字编号
    FARM_PLOTS.forEach(plotNumber => {
        const plot = document.createElement('div');
        plot.className = 'farm-plot';
        plot.id = `plot-${plotNumber}`;
        plot.dataset.number = plotNumber;
        
        // 添加地块编号标签（使用数字）
        const numberLabel = document.createElement('div');
        numberLabel.className = 'plot-number';
        numberLabel.textContent = plotNumber;
        plot.appendChild(numberLabel);
        
        // 模拟一些需要灌溉的地块 - 缺水度大于等于50%的标记为需灌溉
        const params = SOIL_PARAMS[plotNumber];
        if (params && params.deficiency >= 50) {  
            plot.classList.add('need-irrigation');
        }
        
        // 添加点击事件
        plot.addEventListener('click', function() {
            // 切换灌溉状态
            if (this.classList.contains('need-irrigation')) {
                this.classList.remove('need-irrigation');
                this.classList.add('irrigating');
                setTimeout(() => {
                    this.classList.remove('irrigating');
                    this.classList.add('completed');
                    
                    // 更新灌溉状态显示
                    updateIrrigationStatus(plotNumber, 'completed');
                }, 2000);
                
                // 更新灌溉状态显示
                updateIrrigationStatus(plotNumber, 'irrigating');
            }
            
            // 显示土壤参数
            showSoilParams(plotNumber);
        });
        
        farmGrid.appendChild(plot);
    });
}

// 更新灌溉状态显示
function updateIrrigationStatus(plotNumber, status) {
    const statusTexts = document.querySelectorAll('.status-indicator span');
    
    statusTexts.forEach(span => {
        if (span.textContent.includes(`区域${plotNumber}`)) {
            const parent = span.parentElement;
            parent.classList.remove('status-pending', 'status-active', 'status-completed');
            
            if (status === 'irrigating') {
                parent.classList.add('status-active');
                span.textContent = `区域${plotNumber} - 正在灌溉`;
            } else if (status === 'completed') {
                parent.classList.add('status-completed');
                span.textContent = `区域${plotNumber} - 已完成`;
            }
        }
    });
}

// 显示土壤参数
function showSoilParams(plotNumber) {
    const params = SOIL_PARAMS[plotNumber] || { temperature: 22.0, humidity: 60, deficiency: 40 };
    const soilParamsDiv = document.getElementById('soilParams');
    
    // 根据缺水度添加提示
    let deficiencyClass = '';
    let deficiencyText = '';
    if (params.deficiency > 60) {
        deficiencyClass = 'high-deficiency';
        deficiencyText = ' (严重缺水)';
    } else if (params.deficiency > 50) {
        deficiencyClass = 'medium-deficiency';
        deficiencyText = ' (缺水)';
    }
    
    soilParamsDiv.innerHTML = `
        <div class="soil-param-item">
            <div class="soil-param-label">区域 ${plotNumber}</div>
        </div>
        <div class="soil-param-item">
            <div class="soil-param-label">土壤温度</div>
            <div class="soil-param-value">${params.temperature.toFixed(1)}°C</div>
        </div>
        <div class="soil-param-item">
            <div class="soil-param-label">土壤湿度</div>
            <div class="soil-param-value">${params.humidity}%</div>
        </div>
        <div class="soil-param-item ${deficiencyClass}">
            <div class="soil-param-label">缺水度${deficiencyText}</div>
            <div class="soil-param-value">${params.deficiency}%</div>
        </div>
    `;
}

// 根据数值获取颜色强度 - 使用固定的4种颜色，避免出现混合色
function getColorByValue(value, min, max, colorType = 'blue') {
    // 归一化到0-1
    const normalized = (value - min) / (max - min);
    
    if (colorType === 'blue') {
        // 灌溉处方图 - 灌水量：4种纯蓝色
        if (normalized < 0.25) return '#BBDEFB'; // 最浅蓝
        if (normalized < 0.5) return '#64B5F6';  // 浅蓝
        if (normalized < 0.75) return '#1976D2'; // 中蓝
        return '#0D47A1'; // 深蓝
    } 
    else if (colorType === 'orange') {
        // 灌溉处方图 - 施肥量：4种纯橙色
        if (normalized < 0.25) return '#FFE082'; // 最浅橙
        if (normalized < 0.5) return '#FFB74D';  // 浅橙
        if (normalized < 0.75) return '#F57C00'; // 中橙
        return '#E65100'; // 深橙
    }
    else if (colorType === 'green') {
        // 产量图：4种纯绿色
        if (normalized < 0.25) return '#C8E6C9'; // 最浅绿
        if (normalized < 0.5) return '#81C784';  // 浅绿
        if (normalized < 0.75) return '#388E3C'; // 中绿
        return '#1B5E20'; // 深绿
    }
    else if (colorType === 'purple') {
        // 品质图：改为4种纯红色（不是紫色）
        if (normalized < 0.25) return '#FFCDD2'; // 最浅红
        if (normalized < 0.5) return '#EF5350';  // 浅红
        if (normalized < 0.75) return '#D32F2F'; // 中红
        return '#B71C1C'; // 深红
    }
    
    return '#e3f2fd'; // 默认颜色
}

// 显示灌溉处方图
function showIrrigationPrescription() {
    const prescriptionGrid = document.getElementById('farmPrescriptionGrid');
    const prescriptionLegend = document.getElementById('prescriptionLegend');
    
    prescriptionGrid.innerHTML = '';
    
    // 获取最大最小值用于颜色计算
    const waterValues = Object.values(IRRIGATION_PRESCRIPTION).map(p => p.water);
    const fertilizerValues = Object.values(IRRIGATION_PRESCRIPTION).map(p => p.fertilizer);
    
    const minWater = Math.min(...waterValues);
    const maxWater = Math.max(...waterValues);
    const minFertilizer = Math.min(...fertilizerValues);
    const maxFertilizer = Math.max(...fertilizerValues);
    
    FARM_PLOTS.forEach(plotNumber => {
        const prescription = IRRIGATION_PRESCRIPTION[plotNumber] || { water: 10, fertilizer: 3.0 };
        
        // 计算颜色强度 - 使用修改后的函数，现在只会返回纯蓝色和纯橙色
        const waterColor = getColorByValue(prescription.water, minWater, maxWater, 'blue');
        const fertilizerColor = getColorByValue(prescription.fertilizer, minFertilizer, maxFertilizer, 'orange');
        
        // 创建地块显示
        const plot = document.createElement('div');
        plot.className = 'prescription-plot';
        plot.style.background = `linear-gradient(135deg, ${waterColor} 50%, ${fertilizerColor} 50%)`;
        
        // 添加地块编号
        const numberSpan = document.createElement('div');
        numberSpan.className = 'plot-number';
        numberSpan.textContent = plotNumber;
        
        // 添加信息显示
        const infoDiv = document.createElement('div');
        infoDiv.className = 'plot-info';
        infoDiv.innerHTML = `
            <div class="plot-label">灌水量</div>
            <div class="plot-value">${prescription.water}m³</div>
            <div class="plot-label">施肥量</div>
            <div class="plot-value">${prescription.fertilizer}kg</div>
        `;
        
        plot.appendChild(numberSpan);
        plot.appendChild(infoDiv);
        prescriptionGrid.appendChild(plot);
    });
    
    // 创建图例 - 使用固定的4种蓝色和4种橙色
    prescriptionLegend.innerHTML = `
        <div class="legend-title">灌溉水量图例</div>
        <div class="legend-content">
            <div class="legend-item">
                <div class="legend-color" style="background: #BBDEFB;"></div>
                <div class="legend-text">少量灌水</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #64B5F6;"></div>
                <div class="legend-text">中量灌水</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #1976D2;"></div>
                <div class="legend-text">大量灌水</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #0D47A1;"></div>
                <div class="legend-text">特大量灌水</div>
            </div>
        </div>
        <div class="legend-title" style="margin-top: 8px;">施肥量图例</div>
        <div class="legend-content">
            <div class="legend-item">
                <div class="legend-color" style="background: #FFE082;"></div>
                <div class="legend-text">少量施肥</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #FFB74D;"></div>
                <div class="legend-text">中量施肥</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #F57C00;"></div>
                <div class="legend-text">大量施肥</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #E65100;"></div>
                <div class="legend-text">特大量施肥</div>
            </div>
        </div>
        <div style="text-align: center; margin-top: 8px; color: #666; font-size: 10px;">
            注：每个地块左半部分为灌水量，右半部分为施肥量
        </div>
    `;
    
    // 显示处方图区域
    document.getElementById('prescriptionDisplay').style.display = 'block';
}

// 显示产量分布图
function showYieldMap() {
    const yieldGrid = document.getElementById('yieldMapGrid');
    const yieldLegend = document.getElementById('yieldLegend');
    
    yieldGrid.innerHTML = '';
    
    // 获取最大最小值用于颜色计算
    const yieldValues = Object.values(YIELD_QUALITY_DATA).map(d => d.yield);
    const minYield = Math.min(...yieldValues);
    const maxYield = Math.max(...yieldValues);
    
    FARM_PLOTS.forEach(plotNumber => {
        const data = YIELD_QUALITY_DATA[plotNumber] || { yield: 800, sugar: 12.0 };
        
        // 计算颜色强度 - 使用修改后的函数，现在只会返回纯绿色
        const yieldColor = getColorByValue(data.yield, minYield, maxYield, 'green');
        
        // 创建地块显示
        const plot = document.createElement('div');
        plot.className = 'yield-map-plot';
        plot.style.background = yieldColor;
        
        // 添加地块编号
        const numberSpan = document.createElement('div');
        numberSpan.className = 'plot-number';
        numberSpan.textContent = plotNumber;
        
        // 添加信息显示
        const infoDiv = document.createElement('div');
        infoDiv.className = 'plot-info';
        infoDiv.innerHTML = `
            <div class="plot-label">产量</div>
            <div class="plot-value">${data.yield}</div>
            <div class="plot-label">kg/亩</div>
        `;
        
        plot.appendChild(numberSpan);
        plot.appendChild(infoDiv);
        yieldGrid.appendChild(plot);
    });
    
    // 创建图例 - 使用固定的4种绿色
    yieldLegend.innerHTML = `
        <div class="legend-title">产量分布图例</div>
        <div class="legend-content">
            <div class="legend-item">
                <div class="legend-color" style="background: #C8E6C9;"></div>
                <div class="legend-text">低产</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #81C784;"></div>
                <div class="legend-text">中低产</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #388E3C;"></div>
                <div class="legend-text">中高产</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #1B5E20;"></div>
                <div class="legend-text">高产</div>
            </div>
        </div>
        <div style="text-align: center; margin-top: 8px; color: #666; font-size: 10px;">
            注：颜色越深表示产量越高
        </div>
    `;
    
    // 显示产量图区域
    document.getElementById('yieldDisplay').style.display = 'block';
}

// 显示品质预报图
function showQualityMap() {
    const qualityGrid = document.getElementById('qualityMapGrid');
    const qualityLegend = document.getElementById('qualityLegend');
    
    qualityGrid.innerHTML = '';
    
    // 获取最大最小值用于颜色计算
    const sugarValues = Object.values(YIELD_QUALITY_DATA).map(d => d.sugar);
    const minSugar = Math.min(...sugarValues);
    const maxSugar = Math.max(...sugarValues);
    
    FARM_PLOTS.forEach(plotNumber => {
        const data = YIELD_QUALITY_DATA[plotNumber] || { yield: 800, sugar: 12.0 };
        
        // 计算颜色强度 
        const sugarColor = getColorByValue(data.sugar, minSugar, maxSugar, 'purple');
        
        // 创建地块显示
        const plot = document.createElement('div');
        plot.className = 'quality-map-plot';
        plot.style.background = sugarColor;
        
        // 添加地块编号
        const numberSpan = document.createElement('div');
        numberSpan.className = 'plot-number';
        numberSpan.textContent = plotNumber;
        
        // 添加信息显示
        const infoDiv = document.createElement('div');
        infoDiv.className = 'plot-info';
        infoDiv.innerHTML = `
            <div class="plot-label">可溶性糖</div>
            <div class="plot-value">${data.sugar.toFixed(1)}</div>
            <div class="plot-label">%</div>
        `;
        
        plot.appendChild(numberSpan);
        plot.appendChild(infoDiv);
        qualityGrid.appendChild(plot);
    });
    
    // 创建图例 - 使用固定的4种红色
    const quarter1 = minSugar + (maxSugar - minSugar) * 0.25;
    const quarter2 = minSugar + (maxSugar - minSugar) * 0.5;
    const quarter3 = minSugar + (maxSugar - minSugar) * 0.75;
    
    qualityLegend.innerHTML = `
        <div class="legend-title">糖含量分布图例</div>
        <div class="legend-content">
            <div class="legend-item">
                <div class="legend-color" style="background: #FFCDD2;"></div>
                <div class="legend-text">低糖 (&lt;${quarter1.toFixed(1)}%)</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #EF5350;"></div>
                <div class="legend-text">中糖 (${quarter1.toFixed(1)}-${quarter2.toFixed(1)}%)</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #D32F2F;"></div>
                <div class="legend-text">高糖 (${quarter2.toFixed(1)}-${quarter3.toFixed(1)}%)</div>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #B71C1C;"></div>
                <div class="legend-text">特高糖 (≥${quarter3.toFixed(1)}%)</div>
            </div>
        </div>
        <div style="text-align: center; margin-top: 8px; color: #666; font-size: 10px;">
            注：颜色越深表示可溶性糖含量越高
        </div>
    `;
    
    // 显示品质图区域
    document.getElementById('qualityDisplay').style.display = 'block';
}

// 初始化模型选择器
function initModelSelector() {
    const modelSelect = document.getElementById('modelSelect');
    
    modelSelect.innerHTML = '';
    
    MODEL_LIST.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = model.name;
        if (model.id === currentModel) {
            option.selected = true;
        }
        modelSelect.appendChild(option);
    });
}

// 初始化预测图表
function initPredictionChart() {
    const ctx = document.getElementById('predictionChart').getContext('2d');
    
    const labels = ['D-3', 'D-2', 'D-1', 'D', 'D+1', 'D+2', 'D+3'];
    
    const baseValue = 40;
    const historicalData = [
        baseValue + 5,
        baseValue + 3,
        baseValue + 1,
        baseValue
    ];
    
    const predictedData = [
        baseValue,
        baseValue - 2,
        baseValue - 4,
        baseValue - 5
    ];
    
    const fullHistoricalData = [...historicalData, null, null, null];
    const fullPredictedData = [null, null, null, ...predictedData];
    
    predictionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '历史数据',
                    data: fullHistoricalData,
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.3,
                    pointBackgroundColor: '#4caf50',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    spanGaps: false,
                    segment: {
                        borderColor: ctx => {
                            const index = ctx.p0DataIndex;
                            return index <= 3 ? '#4caf50' : 'transparent';
                        }
                    }
                },
                {
                    label: '预测数据',
                    data: fullPredictedData,
                    borderColor: '#2196f3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.3,
                    pointBackgroundColor: '#2196f3',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    spanGaps: false,
                    segment: {
                        borderColor: ctx => {
                            const index = ctx.p0DataIndex;
                            return index >= 3 ? '#2196f3' : 'transparent';
                        },
                        borderDash: ctx => {
                            const index = ctx.p0DataIndex;
                            return index === 3 ? [0, 0] : [5, 5];
                        }
                    }
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 30,
                    max: 50,
                    title: {
                        display: true,
                        text: '土壤湿度 (%)',
                        color: '#666',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '时间 (天)',
                        color: '#666',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    boxPadding: 10,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(1) + '%';
                            } else {
                                label += '无数据';
                            }
                            return label;
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'nearest'
            },
            elements: {
                line: {
                    tension: 0.3
                }
            }
        }
    });
}

// 更新模型信息
function updateModelInfo() {
    const model = MODEL_LIST.find(m => m.id === currentModel);
    const info = MODEL_INFO[currentModel];
    
    if (model && info) {
        document.getElementById('modelType').textContent = model.type;
        document.getElementById('modelAccuracy').textContent = info.accuracy;
        document.getElementById('trainTime').textContent = info.trainTime;
        document.getElementById('dataSource').textContent = info.source;
    }
}

// 更新UI显示
function updateUISettings() {
    const selectedTime = document.getElementById('predictionTimeInput').value;
    const selectedDate = document.getElementById('predictionDateInput').value;
    
    const model = MODEL_LIST.find(m => m.id === currentModel);
    document.getElementById('currentModel').textContent = model?.name || 'LSTM';
    document.getElementById('currentDepth').textContent = `${currentDepth}cm`;
    document.getElementById('currentTime').textContent = selectedTime;
    
    document.getElementById('panelModel').textContent = model?.name || 'LSTM';
    document.getElementById('panelDepth').textContent = `${currentDepth}cm`;
    document.getElementById('panelTime').textContent = selectedTime;
    
    document.getElementById('fullExactTime').textContent = selectedTime;
    document.getElementById('fullPredictionDate').textContent = formatDateToYYYYMMDD(selectedDate);
    
    document.getElementById('optimalTime').textContent = selectedTime;
    document.getElementById('optimalDate').textContent = formatDateToYYYYMMDD(selectedDate);
    
    updateModelInfo();
}

// 日期格式化函数
function formatDateToYYYYMMDD(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
}


// 显示导出选项
function showExportOptions() {
    // 检查是否已经存在导出选项
    let exportOptions = document.getElementById('exportOptions');
    
    if (!exportOptions) {
        // 创建导出选项区域
        exportOptions = document.createElement('div');
        exportOptions.id = 'exportOptions';
        exportOptions.className = 'export-options active';
        
        exportOptions.innerHTML = `
            <p style="margin: 0; color: #666; font-size: 13px;">导出预测结果：</p>
            <button class="export-btn png" onclick="exportAsPNG()">
                <span>PNG</span>
            </button>
            <button class="export-btn pdf" onclick="exportAsPDF()">
                <span>PDF</span>
            </button>
            <button class="export-btn excel" onclick="exportAsExcel()">
                <span>Excel</span>
            </button>
        `;
        
        // 插入到预测按钮后面
        const runPredictionBtn = document.getElementById('runPrediction');
        const resetPredictionBtn = document.getElementById('resetPrediction');
        
        // 创建容器
        const exportContainer = document.createElement('div');
        exportContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e8f5e9;
        `;
        
        exportContainer.appendChild(exportOptions);
        
        // 找到控制面板，将导出选项添加到末尾
        const predictionControls = document.querySelector('.prediction-controls');
        if (predictionControls) {
            predictionControls.appendChild(exportContainer);
        }
    } else {
        // 如果已存在，显示它
        exportOptions.classList.add('active');
    }
}

// 导出为PNG图片
function exportAsPNG() {
    if (!predictionChart) {
        showNotification('没有可导出的预测图表', 'error');
        return;
    }
    
    const canvas = document.getElementById('predictionChart');
    const link = document.createElement('a');
    
    // 获取当前预测信息
    const model = document.getElementById('currentModel').textContent;
    const depth = document.getElementById('currentDepth').textContent;
    const time = document.getElementById('currentTime').textContent;
    const date = document.getElementById('fullPredictionDate').textContent;
    
    // 创建导出图片（包含标题和水印）
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 1200;
    exportCanvas.height = 800;
    const ctx = exportCanvas.getContext('2d');
    
    // 设置背景色
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    
    // 添加标题
    ctx.fillStyle = '#2e7d32';
    ctx.font = 'bold 28px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.fillText('土壤湿度预测曲线', exportCanvas.width / 2, 60);
    
    // 添加预测信息
    ctx.fillStyle = '#666';
    ctx.font = '18px Microsoft YaHei';
    ctx.fillText(`预测模型：${model} | 土壤深度：${depth} | 预测时间：${date} ${time}`, 
                 exportCanvas.width / 2, 100);
    
    // 绘制图表
    const chartImg = new Image();
    chartImg.onload = function() {
        // 绘制图表
        ctx.drawImage(chartImg, 50, 150, 1100, 500);
        
        // 添加底部信息
        ctx.font = '16px Microsoft YaHei';
        ctx.fillStyle = '#999';
        ctx.textAlign = 'left';
        ctx.fillText(`导出时间：${new Date().toLocaleString('zh-CN')}`, 50, 700);
        ctx.textAlign = 'right';
        ctx.fillText('智慧农业灌溉平台', exportCanvas.width - 50, 700);
        
        // 添加水印
        ctx.globalAlpha = 0.1;
        ctx.font = 'bold 100px Microsoft YaHei';
        ctx.fillStyle = '#2196f3';
        ctx.textAlign = 'center';
        ctx.fillText('预测报告', exportCanvas.width / 2, 400);
        ctx.globalAlpha = 1.0;
        
        // 生成下载链接
        const dataURL = exportCanvas.toDataURL('image/png');
        link.download = `土壤湿度预测_${model}_${date.replace(/\//g, '-')}_${time}.png`;
        link.href = dataURL;
        link.click();
        
        showNotification('PNG图片导出成功！', 'success');
    };
    
    chartImg.src = canvas.toDataURL('image/png', 1.0);
}

// 导出为PDF
function exportAsPDF() {
    if (!predictionChart) {
        showNotification('没有可导出的预测图表', 'error');
        return;
    }
    
    // 检查是否已加载jsPDF库
    if (typeof window.jspdf === 'undefined') {
        // 动态加载jsPDF库
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = function() {
            generatePDF();
        };
        document.head.appendChild(script);
        showNotification('正在加载PDF生成库...', 'success');
    } else {
        generatePDF();
    }
    
    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // 获取预测数据
        const model = document.getElementById('currentModel').textContent;
        const depth = document.getElementById('currentDepth').textContent;
        const time = document.getElementById('currentTime').textContent;
        const date = document.getElementById('fullPredictionDate').textContent;
        const waterAmount = document.getElementById('waterAmount').textContent;
        const reason = document.getElementById('predictionReason').textContent;
        
        // 添加标题
        doc.setFontSize(20);
        doc.setTextColor(46, 125, 50);
        doc.text('土壤湿度预测报告', 105, 20, null, null, 'center');
        
        // 添加预测信息
        doc.setFontSize(12);
        doc.setTextColor(102, 102, 102);
        doc.text(`预测模型：${model}`, 20, 35);
        doc.text(`土壤深度：${depth}`, 20, 42);
        doc.text(`预测时间：${date} ${time}`, 20, 49);
        doc.text(`建议需水量：${waterAmount}`, 20, 56);
        
        // 添加图表
        const canvas = document.getElementById('predictionChart');
        const chartImage = canvas.toDataURL('image/jpeg', 1.0);
        doc.addImage(chartImage, 'JPEG', 20, 65, 170, 80);
        
        // 添加预测数据表格
        doc.setFontSize(14);
        doc.setTextColor(46, 125, 50);
        doc.text('预测数据详情', 20, 155);
        
        // 表格标题
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('时间点', 20, 165);
        doc.text('历史数据 (%)', 60, 165);
        doc.text('预测数据 (%)', 110, 165);
        doc.text('趋势', 160, 165);
        
        // 表格数据
        const labels = ['D-3', 'D-2', 'D-1', 'D', 'D+1', 'D+2', 'D+3'];
        const historicalData = predictionChart.data.datasets[0].data;
        const predictedData = predictionChart.data.datasets[1].data;
        
        let yPos = 172;
        labels.forEach((label, index) => {
            const historical = historicalData[index] !== null ? historicalData[index].toFixed(1) : '--';
            const predicted = predictedData[index] !== null ? predictedData[index].toFixed(1) : '--';
            
            // 确定趋势
            let trend = '';
            if (index < 3) {
                trend = historicalData[index] > historicalData[index + 1] ? '↘ 下降' : '→ 平稳';
            } else if (index >= 3) {
                trend = '↘ 预测下降';
            }
            
            doc.text(label, 20, yPos);
            doc.text(historical, 60, yPos);
            doc.text(predicted, 110, yPos);
            doc.text(trend, 160, yPos);
            
            yPos += 7;
        });
        
        // 添加预测建议
        doc.setFontSize(14);
        doc.setTextColor(46, 125, 50);
        doc.text('预测建议', 20, yPos + 5);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const splitReason = doc.splitTextToSize(reason, 170);
        doc.text(splitReason, 20, yPos + 15);
        
        // 添加页脚
        doc.setFontSize(8);
        doc.setTextColor(153, 153, 153);
        doc.text(`导出时间：${new Date().toLocaleString('zh-CN')}`, 20, 280);
        doc.text('智慧农业灌溉平台', 180, 280, null, null, 'right');
        
        // 保存PDF
        doc.save(`土壤湿度预测报告_${model}_${date.replace(/\//g, '-')}.pdf`);
        showNotification('PDF文件导出成功！', 'success');
    }
}

// 导出为Excel
function exportAsExcel() {
    if (!predictionChart || !lastPredictionData) {
        showNotification('没有可导出的预测数据', 'error');
        return;
    }
    
    // 获取预测数据
    const model = document.getElementById('currentModel').textContent;
    const depth = document.getElementById('currentDepth').textContent;
    const time = document.getElementById('currentTime').textContent;
    const date = document.getElementById('fullPredictionDate').textContent;
    const waterAmount = document.getElementById('waterAmount').textContent;
    const reason = document.getElementById('predictionReason').textContent;
    
    // 创建CSV内容
    let csvContent = '\uFEFF'; // UTF-8 BOM
    
    // 标题和基本信息
    csvContent += '土壤湿度预测数据报告\r\n\r\n';
    csvContent += `预测模型,${model}\r\n`;
    csvContent += `土壤深度,${depth}\r\n`;
    csvContent += `预测日期,${date}\r\n`;
    csvContent += `预测时间,${time}\r\n`;
    csvContent += `建议需水量,${waterAmount}\r\n`;
    csvContent += `预测依据,${reason}\r\n`;
    csvContent += `导出时间,${new Date().toLocaleString('zh-CN')}\r\n\r\n`;
    
    // 数据表格标题
    csvContent += '时间点,历史数据(%),预测数据(%),趋势分析\r\n';
    
    // 数据行
    const labels = ['D-3', 'D-2', 'D-1', 'D', 'D+1', 'D+2', 'D+3'];
    const historicalData = predictionChart.data.datasets[0].data;
    const predictedData = predictionChart.data.datasets[1].data;
    
    labels.forEach((label, index) => {
        const historical = historicalData[index] !== null ? historicalData[index].toFixed(1) : '--';
        const predicted = predictedData[index] !== null ? predictedData[index].toFixed(1) : '--';
        
        // 趋势分析
        let trend = '';
        if (index < 3) {
            if (historicalData[index] > historicalData[index + 1]) {
                trend = '下降趋势';
            } else if (historicalData[index] < historicalData[index + 1]) {
                trend = '上升趋势';
            } else {
                trend = '平稳';
            }
        } else if (index >= 3) {
            trend = '预测值';
        }
        
        csvContent += `${label},${historical},${predicted},${trend}\r\n`;
    });
    
    // 添加统计数据
    csvContent += '\r\n统计信息\r\n';
    csvContent += '数据项,数值\r\n';
    
    const validHistoricalData = historicalData.filter(val => val !== null);
    const validPredictedData = predictedData.filter(val => val !== null);
    
    if (validHistoricalData.length > 0) {
        const historicalAvg = (validHistoricalData.reduce((a, b) => a + b, 0) / validHistoricalData.length).toFixed(1);
        const historicalMin = Math.min(...validHistoricalData).toFixed(1);
        const historicalMax = Math.max(...validHistoricalData).toFixed(1);
        
        csvContent += `历史数据平均值,${historicalAvg}%\r\n`;
        csvContent += `历史数据最小值,${historicalMin}%\r\n`;
        csvContent += `历史数据最大值,${historicalMax}%\r\n`;
    }
    
    if (validPredictedData.length > 0) {
        const predictedAvg = (validPredictedData.reduce((a, b) => a + b, 0) / validPredictedData.length).toFixed(1);
        const predictedMin = Math.min(...validPredictedData).toFixed(1);
        const predictedMax = Math.max(...validPredictedData).toFixed(1);
        
        csvContent += `预测数据平均值,${predictedAvg}%\r\n`;
        csvContent += `预测数据最小值,${predictedMin}%\r\n`;
        csvContent += `预测数据最大值,${predictedMax}%\r\n`;
    }
    
    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `土壤湿度预测数据_${model}_${date.replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Excel(CSV)文件导出成功！', 'success');
}


// 模拟预测请求
function simulatePrediction() {
    const runBtn = document.getElementById('runPrediction');
    const originalText = runBtn.textContent;
    runBtn.textContent = '预测中...';
    runBtn.disabled = true;
    
    const statusElement = document.querySelector('.setting-value.status-ready');
    statusElement.textContent = '预测中';
    statusElement.className = 'setting-value status-predicting';
    
    setTimeout(() => {
        runBtn.textContent = originalText;
        runBtn.disabled = false;
        
        const mockApiResponse = {
            success: true,
            data: {
                optimal_time: document.getElementById('predictionTimeInput').value,
                optimal_date: document.getElementById('predictionDateInput').value,
                water_amount: 15 + Math.random() * 5,
                confidence: 0.9 + Math.random() * 0.05,
                reason: "此时温度适宜（24°C），光照适中，水分蒸发率较低",
                prediction_curve: [40, 38, 36, 35, 34, 33, 32]
            }
        };
        
        // 保存预测数据
        lastPredictionData = mockApiResponse.data;
        
        displayPredictionResult(mockApiResponse.data);
        
        statusElement.textContent = '预测完成';
        statusElement.className = 'setting-value status-completed';
        
        // 显示导出选项
        showExportOptions();
        
        setTimeout(() => {
            statusElement.textContent = '准备就绪';
            statusElement.className = 'setting-value status-ready';
        }, 3000);
    }, 1500);
}

// 显示预测结果
function displayPredictionResult(data) {
    document.getElementById('optimalTime').textContent = data.optimal_time;
    document.getElementById('waterAmount').textContent = `${data.water_amount.toFixed(1)}m³`;
    document.getElementById('predictionReason').textContent = data.reason;
    
    document.getElementById('fullExactTime').textContent = data.optimal_time;
    document.getElementById('fullPredictionDate').textContent = formatDateToYYYYMMDD(data.optimal_date);
    
    if (predictionChart) {
        const baseValue = 40;
        const newHistoricalData = [
            baseValue + 5 + Math.random() * 2 - 1,
            baseValue + 3 + Math.random() * 2 - 1,
            baseValue + 1 + Math.random() * 2 - 1,
            baseValue
        ];
        
        const newPredictedData = [
            baseValue,
            baseValue - 2 + Math.random() * 2 - 1,
            baseValue - 4 + Math.random() * 2 - 1,
            baseValue - 5 + Math.random() * 2 - 1
        ];
        
        predictionChart.data.datasets[0].data = [...newHistoricalData, null, null, null];
        predictionChart.data.datasets[1].data = [null, null, null, ...newPredictedData];
        predictionChart.update();
    }
}

// 初始化上传功能
function initUploadFeatures() {
    const uploadToggle = document.getElementById('uploadToggle');
    const toggleSwitch = uploadToggle.querySelector('.toggle-switch');
    const builtinData = document.getElementById('builtinData');
    const uploadContainer = document.getElementById('uploadContainer');
    const uploadZone = document.getElementById('uploadZone');
    const selectFileBtn = document.getElementById('selectFileBtn');
    const fileInput = document.getElementById('fileInput');
    const selectedFile = document.getElementById('selectedFile');
    const removeFileBtn = document.getElementById('removeFileBtn');
    const uploadStatus = document.getElementById('uploadStatus');
    const dataOptions = document.querySelectorAll('.data-option');
    
    uploadToggle.addEventListener('click', () => {
        toggleSwitch.classList.toggle('active');
        
        if (toggleSwitch.classList.contains('active')) {
            builtinData.classList.remove('active');
            uploadContainer.classList.add('active');
        } else {
            builtinData.classList.add('active');
            uploadContainer.classList.remove('active');
            resetUploadStatus();
        }
    });
    
    dataOptions.forEach(option => {
        option.addEventListener('click', () => {
            dataOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            currentDataSource = option.dataset.source;
            loadBuiltinDataset(currentDataSource);
        });
    });
    
    selectFileBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', handleFileSelect);
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadZone.classList.add('drag-over');
    }
    
    function unhighlight() {
        uploadZone.classList.remove('drag-over');
    }
    
    uploadZone.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFiles(files[0]);
        }
    }
    
    removeFileBtn.addEventListener('click', resetUploadStatus);
    
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleFiles(file);
        }
    }
    
    function handleFiles(file) {
        const validTypes = ['text/csv', 'application/vnd.ms-excel', 
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                          'application/json'];
        const validExtensions = ['.csv', '.xls', '.xlsx', '.json'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
            showUploadStatus('请选择 CSV、Excel 或 JSON 格式的文件', 'error');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            showUploadStatus('文件大小不能超过 10MB', 'error');
            return;
        }
        
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileSize').textContent = formatFileSize(file.size);
        selectedFile.classList.add('active');
        
        readFileContent(file);
    }
    
    function readFileContent(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const content = e.target.result;
                
                if (file.name.endsWith('.csv')) {
                    parseCSV(content);
                } else if (file.name.endsWith('.json')) {
                    parseJSON(content);
                } else {
                    showUploadStatus('Excel文件解析需要额外库支持，此处仅演示', 'success');
                    uploadedFileData = generateMockDataFromFile(file.name);
                    updateChartWithUploadedData();
                }
                
                showUploadStatus('文件上传成功，数据已加载', 'success');
                
            } catch (error) {
                console.error('解析文件时出错:', error);
                showUploadStatus('文件解析失败，请检查文件格式', 'error');
            }
        };
        
        reader.onerror = function() {
            showUploadStatus('文件读取失败', 'error');
        };
        
        if (file.name.endsWith('.json')) {
            reader.readAsText(file);
        } else {
            reader.readAsText(file, 'UTF-8');
        }
    }
    
    function parseCSV(content) {
        const lines = content.split('\n');
        const data = [];
        
        for (let i = 1; i < Math.min(lines.length, 8); i++) {
            const values = lines[i].split(',');
            if (values.length > 0 && values[0]) {
                data.push(parseFloat(values[0]) || 0);
            }
        }
        
        while (data.length < 4) {
            data.push(data[data.length - 1] || 40);
        }
        
        const baseValue = data[3] || 40;
        uploadedFileData = {
            historical: [baseValue + 5, baseValue + 3, baseValue + 1, baseValue],
            predicted: data.slice(3, 7)
        };
        
        updateChartWithUploadedData();
    }
    
    function parseJSON(content) {
        const jsonData = JSON.parse(content);
        const predictions = jsonData.predictions || jsonData.data || [];
        
        if (predictions.length >= 4) {
            const baseValue = predictions[0];
            uploadedFileData = {
                historical: [baseValue + 5, baseValue + 3, baseValue + 1, baseValue],
                predicted: [
                    baseValue,
                    predictions[1] || baseValue - 2,
                    predictions[2] || baseValue - 4,
                    predictions[3] || baseValue - 6
                ]
            };
        } else {
            uploadedFileData = generateMockDataFromFile('json');
        }
        
        updateChartWithUploadedData();
    }
    
    function generateMockDataFromFile(filename) {
        const baseValue = 40 + (filename.length % 20);
        return {
            historical: [baseValue + 5, baseValue + 3, baseValue + 1, baseValue],
            predicted: [baseValue, baseValue - 2, baseValue - 4, baseValue - 6]
        };
    }
    
    function updateChartWithUploadedData() {
        if (uploadedFileData && predictionChart) {
            predictionChart.data.datasets[0].data = [...uploadedFileData.historical, null, null, null];
            predictionChart.data.datasets[1].data = [null, null, null, ...uploadedFileData.predicted];
            predictionChart.update();
            
            updateStatisticsFromUploadedData();
        }
    }
    
    function updateStatisticsFromUploadedData() {
        if (uploadedFileData) {
            const allData = [...uploadedFileData.historical, ...uploadedFileData.predicted];
            const validData = allData.filter(val => val !== null);
            if (validData.length > 0) {
                const minHumidity = Math.min(...validData).toFixed(1);
                const maxHumidity = Math.max(...validData).toFixed(1);
                const currentHumidity = uploadedFileData.historical[3];
                
                document.querySelectorAll('.humidity-info .stat-value').forEach((el, index) => {
                    if (index === 0) el.textContent = `${currentHumidity.toFixed(1)}%`;
                    if (index === 1) el.textContent = `${minHumidity}%`;
                    if (index === 2) el.textContent = `${maxHumidity}%`;
                });
                
                const waterAmount = ((100 - currentHumidity) * 0.3).toFixed(1);
                document.getElementById('waterAmount').textContent = `${waterAmount}m³`;
            }
        }
    }
    
    function resetUploadStatus() {
        fileInput.value = '';
        selectedFile.classList.remove('active');
        document.getElementById('fileName').textContent = '未选择文件';
        document.getElementById('fileSize').textContent = '-';
        uploadStatus.classList.remove('active');
        uploadedFileData = null;
        
        if (!toggleSwitch.classList.contains('active')) {
            loadBuiltinDataset(currentDataSource);
        }
    }
    
    function showUploadStatus(message, type) {
        uploadStatus.textContent = message;
        uploadStatus.className = `upload-status active ${type}`;
        
        setTimeout(() => {
            uploadStatus.classList.remove('active');
        }, 3000);
    }
    
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
}

// 加载内置数据集
function loadBuiltinDataset(datasetId) {
    const dataset = BUILTIN_DATASETS[datasetId];
    if (!dataset) return;
    
    currentDataSource = datasetId;
    
    if (predictionChart) {
        const baseValue = dataset.data[0];
        const historicalData = [baseValue + 5, baseValue + 3, baseValue + 1, baseValue];
        const predictedData = dataset.data;
        
        predictionChart.data.datasets[0].data = [...historicalData, null, null, null];
        predictionChart.data.datasets[1].data = [null, null, null, ...predictedData];
        predictionChart.update();
        
        document.querySelectorAll('.humidity-info .stat-value').forEach((el, index) => {
            if (index === 0) el.textContent = `${dataset.data[0]}%`;
            if (index === 1) el.textContent = `${dataset.humidity_range.min}%`;
            if (index === 2) el.textContent = `${dataset.humidity_range.max}%`;
        });
        
        document.getElementById('waterAmount').textContent = `${((100 - dataset.data[0]) * 0.3).toFixed(1)}m³`;
        document.getElementById('predictionReason').textContent = `基于${dataset.name}分析，数据范围：${dataset.date_range}`;
    }
}

// 页面切换
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const page = this.dataset.page;
        
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        document.getElementById('farmView').style.display = 'none';
        document.getElementById('predictionView').style.display = 'none';
        
        if (page === 'farm') {
            document.getElementById('farmView').style.display = 'flex';
        } else if (page === 'prediction') {
            document.getElementById('predictionView').style.display = 'flex';
            updateUISettings();
        }
    });
});

// 视图缩放
document.getElementById('zoomIn').addEventListener('click', function() {
    const grid = document.getElementById('farmGrid');
    const currentScale = parseFloat(grid.style.transform?.match(/scale\(([^)]+)\)/)?.[1] || 0.9);
    grid.style.transform = `rotateX(60deg) rotateZ(-45deg) scale(${currentScale + 0.1})`;
});

document.getElementById('zoomOut').addEventListener('click', function() {
    const grid = document.getElementById('farmGrid');
    const currentScale = parseFloat(grid.style.transform?.match(/scale\(([^)]+)\)/)?.[1] || 0.9);
    if (currentScale > 0.5) {
        grid.style.transform = `rotateX(60deg) rotateZ(-45deg) scale(${currentScale - 0.1})`;
    }
});

// 重置视图
document.getElementById('resetView').addEventListener('click', function() {
    const grid = document.getElementById('farmGrid');
    grid.style.transform = 'rotateX(60deg) rotateZ(-45deg) scale(0.9)';
});

// 模型选择变化
document.getElementById('modelSelect').addEventListener('change', function() {
    currentModel = this.value;
    updateUISettings();
});

// 深度选择变化
document.getElementById('soilDepthSelect').addEventListener('change', function() {
    currentDepth = this.value;
    updateUISettings();
});

// 日期时间选择变化
document.getElementById('predictionDateInput').addEventListener('change', updateUISettings);
document.getElementById('predictionTimeInput').addEventListener('change', updateUISettings);

// 运行预测按钮
document.getElementById('runPrediction').addEventListener('click', simulatePrediction);

// 重置预测按钮
document.getElementById('resetPrediction').addEventListener('click', function() {
    currentModel = 'lstm';
    currentDepth = '20';
    
    document.getElementById('modelSelect').value = currentModel;
    document.getElementById('soilDepthSelect').value = currentDepth;
    document.getElementById('predictionDateInput').value = '2024-05-15';
    document.getElementById('predictionTimeInput').value = '14:00';
    
    if (predictionChart) {
        const baseValue = 40;
        const historicalData = [baseValue + 5, baseValue + 3, baseValue + 1, baseValue];
        const predictedData = [baseValue, baseValue - 2, baseValue - 4, baseValue - 5];
        
        predictionChart.data.datasets[0].data = [...historicalData, null, null, null];
        predictionChart.data.datasets[1].data = [null, null, null, ...predictedData];
        predictionChart.update();
    }
    
    updateUISettings();
    
    // 隐藏导出选项
    const exportOptions = document.getElementById('exportOptions');
    if (exportOptions) {
        exportOptions.classList.remove('active');
    }
});

// 初始化功能按钮事件
function initFunctionButtons() {
    // 灌溉处方图按钮
    document.getElementById('showPrescriptionBtn').addEventListener('click', function() {
        // 关闭其他显示区域
        document.getElementById('yieldDisplay').style.display = 'none';
        document.getElementById('qualityDisplay').style.display = 'none';
        
        // 显示处方图
        showIrrigationPrescription();
    });
    
    // 产量分布按钮
    document.getElementById('showYieldBtn').addEventListener('click', function() {
        // 关闭其他显示区域
        document.getElementById('prescriptionDisplay').style.display = 'none';
        document.getElementById('qualityDisplay').style.display = 'none';
        
        // 显示产量图
        showYieldMap();
    });
    
    // 品质预报按钮
    document.getElementById('showQualityBtn').addEventListener('click', function() {
        // 关闭其他显示区域
        document.getElementById('prescriptionDisplay').style.display = 'none';
        document.getElementById('yieldDisplay').style.display = 'none';
        
        // 显示品质图
        showQualityMap();
    });
    
    // 关闭按钮事件
    document.getElementById('closePrescriptionBtn').addEventListener('click', function() {
        document.getElementById('prescriptionDisplay').style.display = 'none';
    });
    
    document.getElementById('closeYieldBtn').addEventListener('click', function() {
        document.getElementById('yieldDisplay').style.display = 'none';
    });
    
    document.getElementById('closeQualityBtn').addEventListener('click', function() {
        document.getElementById('qualityDisplay').style.display = 'none';
    });
}

// 显示通知
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#4caf50' : '#f44336';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 10px 16px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-size: 13px;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 300);
    }, 3000);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initFarmGrid();
    initModelSelector();
    initPredictionChart();
    initUploadFeatures();
    initFunctionButtons();
    updateUISettings();
    
    loadBuiltinDataset(currentDataSource);
    
    // 默认显示农田视图
    document.getElementById('farmView').style.display = 'flex';
    document.getElementById('predictionView').style.display = 'none';
});