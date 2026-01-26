/**
 * AppView - 应用主视图组件
 * 包含农田视图和预测分析视图的完整 UI
 */

import { FARM_PLOTS, MODEL_LIST, BUILTIN_DATASETS, IRRIGATION_PRESCRIPTION, YIELD_QUALITY_DATA } from '../constants';
import { formatDateToYYYYMMDD, getColorByValue } from '../utils';

function AppView(props) {
    const {
        // 状态
        activeTab,
        setActiveTab,
        currentModel,
        currentDepth,
        selectedDate,
        selectedTime,
        predictionStatus,
        currentDataSource,
        useUpload,
        selectedFileInfo,
        showExportOptions,
        showPanel,
        setShowPanel,
        selectedPlot,
        gridScale,
        notification,
        irrigationStatus,
        plotStates,
        optimalDate,
        optimalTime,
        humidityStats,
        waterAmount,
        predictionReason,
        predictionImage,

        // 计算值
        currentModelInfo,
        predictionStatusText,
        gridTransform,
        soilParams,
        soilDeficiencyClass,
        soilDeficiencyText,
        minWater,
        maxWater,
        minFertilizer,
        maxFertilizer,
        minYield,
        maxYield,
        minSugar,
        maxSugar,
        quarter1,
        quarter2,
        quarter3,

        // 事件处理函数
        handlePlotClick,
        handleZoomIn,
        handleZoomOut,
        handleResetZoom,
        handleModelChange,
        handleDepthChange,
        handleDateChange,
        handleTimeChange,
        handleDataSourceChange,
        handleToggleUpload,
        handleFiles,
        handleFileSelect,
        handleDrop,
        handlePrediction,
        resetPrediction,
        resetUploadStatus,
        exportAsPNG,
        exportAsPDF,
        exportAsExcel,
        togglePanel,

        // Refs
        chartRef,
        fileInputRef
    } = props;

    return (
        <div>
            <header className="top-nav">
                <div className="nav-left">
                    <span>智慧农业灌溉平台</span>
                </div>
                <div className="nav-center">
                    <button
                        className={`tab ${activeTab === 'farm' ? 'active' : ''}`}
                        onClick={() => setActiveTab('farm')}
                        type="button"
                    >
                        农田视图
                    </button>
                    <button
                        className={`tab ${activeTab === 'prediction' ? 'active' : ''}`}
                        onClick={() => setActiveTab('prediction')}
                        type="button"
                    >
                        预测分析
                    </button>
                </div>
                <div className="nav-right">
                    <span>24℃ 晴天</span>
                </div>
            </header>

            {activeTab === 'farm' && (
                <main className="main-container" id="farmView">
                    <div className="content-area">
                        <div className="farm-grid-container">
                            <div className="farm-grid" id="farmGrid" style={{ transform: gridTransform }}>
                                {FARM_PLOTS.map((plotNumber) => (
                                    <div
                                        key={plotNumber}
                                        className={`farm-plot ${plotStates[plotNumber] === 'need-irrigation' ? 'need-irrigation' : ''} ${plotStates[plotNumber] === 'irrigating' ? 'irrigating' : ''} ${plotStates[plotNumber] === 'completed' ? 'completed' : ''}`}
                                        id={`plot-${plotNumber}`}
                                        data-number={plotNumber}
                                        onClick={() => handlePlotClick(plotNumber)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                handlePlotClick(plotNumber);
                                            }
                                        }}
                                    >
                                        <div className="plot-number">{plotNumber}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="view-controls">
                            <button id="zoomIn" onClick={handleZoomIn} type="button">放大</button>
                            <button id="zoomOut" onClick={handleZoomOut} type="button">缩小</button>
                            <button id="resetView" onClick={handleResetZoom} type="button">重置视图</button>
                        </div>
                    </div>

                    <aside className="data-panel">
                        <div className="weather-card">
                            <div className="weather-icon">☀️</div>
                            <div className="weather-info">
                                <h4>晴天</h4>
                                <p>24°C | 湿度 45%</p>
                                <p>风速: 3.2 km/h</p>
                            </div>
                        </div>

                        <div className="panel-module">
                            <h3>土壤参数</h3>
                            <div className="soil-params" id="soilParams">
                                {!selectedPlot && <p>点击农田地块查看参数</p>}
                                {selectedPlot && soilParams && (
                                    <>
                                        <div className="soil-param-item">
                                            <div className="soil-param-label">区域 {selectedPlot}</div>
                                        </div>
                                        <div className="soil-param-item">
                                            <div className="soil-param-label">土壤温度</div>
                                            <div className="soil-param-value">{soilParams.temperature.toFixed(1)}°C</div>
                                        </div>
                                        <div className="soil-param-item">
                                            <div className="soil-param-label">土壤湿度</div>
                                            <div className="soil-param-value">{soilParams.humidity}%</div>
                                        </div>
                                        <div className={`soil-param-item ${soilDeficiencyClass}`}>
                                            <div className="soil-param-label">缺水度{soilDeficiencyText}</div>
                                            <div className="soil-param-value">{soilParams.deficiency}%</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="panel-module">
                            <h3>灌溉状态</h3>
                            {['1', '2', '3'].map((plotNumber) => (
                                <div
                                    key={plotNumber}
                                    className={`status-indicator status-${irrigationStatus[plotNumber] === 'pending' ? 'pending' : irrigationStatus[plotNumber] === 'active' ? 'active' : 'completed'}`}
                                >
                                    <div className="status-dot"></div>
                                    <span>
                                        区域{plotNumber} -
                                        {irrigationStatus[plotNumber] === 'pending' && ' 等待灌溉'}
                                        {irrigationStatus[plotNumber] === 'active' && ' 正在灌溉'}
                                        {irrigationStatus[plotNumber] === 'completed' && ' 已完成'}
                                    </span>
                                </div>
                            ))}

                            <div className="progress-container">
                                <div className="progress-label">
                                    <span>今日灌溉进度</span>
                                    <span>65%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="panel-module">
                            <h3>灌溉统计</h3>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-value">2.5</div>
                                    <div className="stat-label">需灌溉面积(亩)</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">1.6</div>
                                    <div className="stat-label">已灌溉面积(亩)</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">3</div>
                                    <div className="stat-label">需灌溉区域</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">64%</div>
                                    <div className="stat-label">完成率</div>
                                </div>
                            </div>
                        </div>

                        <div className="panel-module function-buttons">
                            <h3>分析工具</h3>
                            <div className="button-group">
                                <button className="function-btn" onClick={() => togglePanel('prescription')} type="button">
                                    <span className="btn-icon">💧</span>
                                    <span className="btn-text">灌溉处方图</span>
                                </button>
                                <button className="function-btn" onClick={() => togglePanel('yield')} type="button">
                                    <span className="btn-icon">📈</span>
                                    <span className="btn-text">产量分布</span>
                                </button>
                                <button className="function-btn" onClick={() => togglePanel('quality')} type="button">
                                    <span className="btn-icon">⭐</span>
                                    <span className="btn-text">品质预报</span>
                                </button>
                            </div>
                        </div>

                        {showPanel === 'prescription' && (
                            <div className="panel-module display-area" id="prescriptionDisplay">
                                <div className="display-header">
                                    <h3>灌溉处方图</h3>
                                    <button className="close-btn" onClick={() => setShowPanel('')} type="button">×</button>
                                </div>
                                <div className="display-content">
                                    <div className="farm-prescription-grid" id="farmPrescriptionGrid">
                                        {FARM_PLOTS.map((plotNumber) => {
                                            const prescription = IRRIGATION_PRESCRIPTION[plotNumber] || { water: 10, fertilizer: 3.0 };
                                            const waterColor = getColorByValue(prescription.water, minWater, maxWater, 'blue');
                                            const fertilizerColor = getColorByValue(prescription.fertilizer, minFertilizer, maxFertilizer, 'orange');

                                            return (
                                                <div
                                                    key={plotNumber}
                                                    className="prescription-plot"
                                                    style={{ background: `linear-gradient(135deg, ${waterColor} 50%, ${fertilizerColor} 50%)` }}
                                                >
                                                    <div className="plot-number">{plotNumber}</div>
                                                    <div className="plot-info">
                                                        <div className="plot-label">灌水量</div>
                                                        <div className="plot-value">{prescription.water}m³</div>
                                                        <div className="plot-label">施肥量</div>
                                                        <div className="plot-value">{prescription.fertilizer}kg</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="legend" id="prescriptionLegend">
                                        <div className="legend-title">灌溉水量图例</div>
                                        <div className="legend-content">
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#BBDEFB' }}></div>
                                                <div className="legend-text">少量灌水</div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#64B5F6' }}></div>
                                                <div className="legend-text">中量灌水</div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#1976D2' }}></div>
                                                <div className="legend-text">大量灌水</div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#0D47A1' }}></div>
                                                <div className="legend-text">特大量灌水</div>
                                            </div>
                                        </div>
                                        <div className="legend-title" style={{ marginTop: '8px' }}>施肥量图例</div>
                                        <div className="legend-content">
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#FFE082' }}></div>
                                                <div className="legend-text">少量施肥</div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#FFB74D' }}></div>
                                                <div className="legend-text">中量施肥</div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#F57C00' }}></div>
                                                <div className="legend-text">大量施肥</div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#E65100' }}></div>
                                                <div className="legend-text">特大量施肥</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'center', marginTop: '8px', color: '#666', fontSize: '10px' }}>
                                            注：每个地块左半部分为灌水量，右半部分为施肥量
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showPanel === 'yield' && (
                            <div className="panel-module display-area" id="yieldDisplay">
                                <div className="display-header">
                                    <h3>产量分布图</h3>
                                    <button className="close-btn" onClick={() => setShowPanel('')} type="button">×</button>
                                </div>
                                <div className="display-content">
                                    <div className="yield-map-grid" id="yieldMapGrid">
                                        {FARM_PLOTS.map((plotNumber) => {
                                            const data = YIELD_QUALITY_DATA[plotNumber] || { yield: 800, sugar: 12.0 };
                                            const yieldColor = getColorByValue(data.yield, minYield, maxYield, 'green');

                                            return (
                                                <div key={plotNumber} className="yield-map-plot" style={{ background: yieldColor }}>
                                                    <div className="plot-number">{plotNumber}</div>
                                                    <div className="plot-info">
                                                        <div className="plot-label">产量</div>
                                                        <div className="plot-value">{data.yield}</div>
                                                        <div className="plot-label">kg/亩</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="legend" id="yieldLegend">
                                        <div className="legend-title">产量分布图例</div>
                                        <div className="legend-content">
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#C8E6C9' }}></div>
                                                <div className="legend-text">低产</div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#81C784' }}></div>
                                                <div className="legend-text">中低产</div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#388E3C' }}></div>
                                                <div className="legend-text">中高产</div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#1B5E20' }}></div>
                                                <div className="legend-text">高产</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'center', marginTop: '8px', color: '#666', fontSize: '10px' }}>
                                            注：颜色越深表示产量越高
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showPanel === 'quality' && (
                            <div className="panel-module display-area" id="qualityDisplay">
                                <div className="display-header">
                                    <h3>品质预报图</h3>
                                    <button className="close-btn" onClick={() => setShowPanel('')} type="button">×</button>
                                </div>
                                <div className="display-content">
                                    <div className="quality-map-grid" id="qualityMapGrid">
                                        {FARM_PLOTS.map((plotNumber) => {
                                            const data = YIELD_QUALITY_DATA[plotNumber] || { yield: 800, sugar: 12.0 };
                                            const sugarColor = getColorByValue(data.sugar, minSugar, maxSugar, 'purple');

                                            return (
                                                <div key={plotNumber} className="quality-map-plot" style={{ background: sugarColor }}>
                                                    <div className="plot-number">{plotNumber}</div>
                                                    <div className="plot-info">
                                                        <div className="plot-label">可溶性糖</div>
                                                        <div className="plot-value">{data.sugar.toFixed(1)}</div>
                                                        <div className="plot-label">%</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="legend" id="qualityLegend">
                                        <div className="legend-title">糖含量分布图例</div>
                                        <div className="legend-content">
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#FFCDD2' }}></div>
                                                <div className="legend-text">低糖 (&lt;{quarter1.toFixed(1)}%)</div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#EF5350' }}></div>
                                                <div className="legend-text">中糖 ({quarter1.toFixed(1)}-{quarter2.toFixed(1)}%)</div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#D32F2F' }}></div>
                                                <div className="legend-text">高糖 ({quarter2.toFixed(1)}-{quarter3.toFixed(1)}%)</div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-color" style={{ background: '#B71C1C' }}></div>
                                                <div className="legend-text">特高糖 (≥{quarter3.toFixed(1)}%)</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'center', marginTop: '8px', color: '#666', fontSize: '10px' }}>
                                            注：颜色越深表示可溶性糖含量越高
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>
                </main>
            )}

            {activeTab === 'prediction' && (
                <main className="main-container" id="predictionView">
                    <div className="content-area">
                        <div className="prediction-controls">
                            <div className="control-group">
                                <label htmlFor="modelSelect">预测模型：</label>
                                <select
                                    id="modelSelect"
                                    className="control-select"
                                    value={currentModel}
                                    onChange={handleModelChange}
                                >
                                    {MODEL_LIST.map((model) => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="control-group">
                                <label htmlFor="soilDepthSelect">土壤深度：</label>
                                <select
                                    id="soilDepthSelect"
                                    className="control-select"
                                    value={currentDepth}
                                    onChange={handleDepthChange}
                                >
                                    <option value="10">10cm</option>
                                    <option value="20">20cm</option>
                                    <option value="30">30cm</option>
                                    <option value="40">40cm</option>
                                </select>
                            </div>

                            <div className="control-group">
                                <label htmlFor="predictionDateInput">预测日期：</label>
                                <input
                                    type="date"
                                    id="predictionDateInput"
                                    className="control-select"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                />
                            </div>

                            <div className="control-group">
                                <label htmlFor="predictionTimeInput">预测时间：</label>
                                <input
                                    type="time"
                                    id="predictionTimeInput"
                                    className="control-select"
                                    value={selectedTime}
                                    onChange={handleTimeChange}
                                />
                            </div>

                            <button id="runPrediction" className="prediction-btn" onClick={handlePrediction} type="button">
                                运行预测
                            </button>
                            <button id="resetPrediction" className="prediction-btn secondary" onClick={resetPrediction} type="button">
                                重置
                            </button>
                        </div>

                        <div className="upload-area">
                            <div className="upload-header">
                                <h3>数据源选择</h3>
                                <div className="upload-toggle" id="uploadToggle" onClick={handleToggleUpload}>
                                    <span>使用内置数据</span>
                                    <div className={`toggle-switch ${useUpload ? 'active' : ''}`}>
                                        <div className="toggle-knob"></div>
                                    </div>
                                    <span>上传文件</span>
                                </div>
                            </div>

                            <div className={`builtin-data ${useUpload ? '' : 'active'}`} id="builtinData">
                                <p>选择内置数据集：</p>
                                <div className="data-options">
                                    {Object.entries(BUILTIN_DATASETS).map(([key, dataset]) => (
                                        <div
                                            key={key}
                                            className={`data-option ${currentDataSource === key ? 'active' : ''}`}
                                            data-source={key}
                                            onClick={() => handleDataSourceChange(key)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' || event.key === ' ') {
                                                    handleDataSourceChange(key);
                                                }
                                            }}
                                        >
                                            <div className="data-name">{dataset.name}</div>
                                            <div className="data-desc">{dataset.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`upload-container ${useUpload ? 'active' : ''}`} id="uploadContainer">
                                <div
                                    className="upload-zone"
                                    id="uploadZone"
                                    onDragEnter={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }}
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        event.currentTarget.classList.add('drag-over');
                                    }}
                                    onDragLeave={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        event.currentTarget.classList.remove('drag-over');
                                    }}
                                    onDrop={(event) => {
                                        event.currentTarget.classList.remove('drag-over');
                                        handleDrop(event);
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => fileInputRef.current?.click()}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            fileInputRef.current?.click();
                                        }
                                    }}
                                >
                                    <div className="upload-icon">📁</div>
                                    <p>拖放文件到此处，或点击选择文件</p>
                                    <p className="upload-hint">支持 CSV、Excel、JSON 格式，最大 10MB</p>
                                </div>

                                <div className="upload-options">
                                    <button className="file-select-btn" id="selectFileBtn" onClick={() => fileInputRef.current?.click()} type="button">
                                        选择文件
                                    </button>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        ref={fileInputRef}
                                        accept=".csv,.xlsx,.xls,.json"
                                        onChange={handleFileSelect}
                                    />
                                </div>

                                <div className={`selected-file ${selectedFileInfo ? 'active' : ''}`} id="selectedFile">
                                    <div className="file-info">
                                        <div className="file-name" id="fileName">
                                            {selectedFileInfo ? selectedFileInfo.name : '未选择文件'}
                                        </div>
                                        <div className="file-size" id="fileSize">
                                            {selectedFileInfo ? `${(selectedFileInfo.size / 1024).toFixed(1)} KB` : '-'}
                                        </div>
                                    </div>
                                    <button className="remove-file" id="removeFileBtn" onClick={resetUploadStatus} type="button">
                                        ×
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="prediction-chart-container">
                            <div className="chart-header">
                                <h3>土壤湿度预测曲线</h3>
                                <div className="chart-info">
                                    <span>
                                        模型：<span id="currentModel">{currentModelInfo.name}</span>
                                    </span>
                                    <span>
                                        深度：<span id="currentDepth">{currentDepth}cm</span>
                                    </span>
                                    <span>
                                        时间：<span id="currentTime">{selectedTime}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="chart-wrapper">
                                <canvas id="predictionChart" ref={chartRef}></canvas>
                            </div>
                            <div className="chart-legend">
                                <div className="legend-item">
                                    <span className="legend-color historical"></span>
                                    <span>历史数据</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-color predicted"></span>
                                    <span>预测数据</span>
                                </div>
                            </div>

                            {showExportOptions && (
                                <div className="export-options active" id="exportOptions">
                                    <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>导出预测结果：</p>
                                    <button className="export-btn png" onClick={exportAsPNG} type="button">
                                        <span>PNG</span>
                                    </button>
                                    <button className="export-btn pdf" onClick={exportAsPDF} type="button">
                                        <span>PDF</span>
                                    </button>
                                    <button className="export-btn excel" onClick={exportAsExcel} type="button">
                                        <span>Excel</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="data-panel">
                        <div className="panel-module">
                            <h3>预测设置</h3>
                            <div className="setting-info">
                                <div className="setting-item">
                                    <span className="setting-label">当前模型：</span>
                                    <span className="setting-value" id="panelModel">{currentModelInfo.name}</span>
                                </div>
                                <div className="setting-item">
                                    <span className="setting-label">土壤深度：</span>
                                    <span className="setting-value" id="panelDepth">{currentDepth}cm</span>
                                </div>
                                <div className="setting-item">
                                    <span className="setting-label">预测时间：</span>
                                    <span className="setting-value" id="panelTime">{selectedTime}</span>
                                </div>
                                <div className="setting-item">
                                    <span className={`setting-value status-${predictionStatus}`}> {predictionStatusText[predictionStatus]}</span>
                                </div>
                            </div>
                        </div>

                        <div className="panel-module">
                            <h3>模型信息</h3>
                            <div className="model-info">
                                <div className="info-item">
                                    <span className="info-label">模型类型：</span>
                                    <span className="info-value" id="modelType">{currentModelInfo.type}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">训练时间：</span>
                                    <span className="info-value" id="trainTime">{currentModelInfo.trainTime}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">准确率：</span>
                                    <span className="info-value" id="modelAccuracy">{currentModelInfo.accuracy}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">数据来源：</span>
                                    <span className="info-value" id="dataSource">{currentModelInfo.source}</span>
                                </div>
                            </div>
                        </div>

                        <div className="panel-module prediction-stats-card">
                            <h3>预测统计</h3>
                            <div className="prediction-stats-grid">
                                <div className="stat-row time-info">
                                    <div className="stat-item">
                                        <div className="stat-label">预测日期</div>
                                        <div className="stat-value large" id="fullPredictionDate">{formatDateToYYYYMMDD(optimalDate)}</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-label">精确时间</div>
                                        <div className="stat-value large" id="fullExactTime">{optimalTime}</div>
                                    </div>
                                </div>

                                <div className="stat-row humidity-info">
                                    <div className="stat-item">
                                        <div className="stat-label">当前湿度</div>
                                        <div className="stat-value">{Number(humidityStats.current).toFixed(1)}%</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-label">最低湿度</div>
                                        <div className="stat-value">{Number(humidityStats.min).toFixed(1)}%</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-label">最高湿度</div>
                                        <div className="stat-value">{Number(humidityStats.max).toFixed(1)}%</div>
                                    </div>
                                </div>

                                <div className="stat-row soil-info">
                                    <div className="stat-item">
                                        <div className="stat-label">土壤温度</div>
                                        <div className="stat-value">22°C</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-label">pH值</div>
                                        <div className="stat-value">6.8</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-label">需水量</div>
                                        <div className="stat-value">{waterAmount}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="panel-module">
                            <h3>预测建议</h3>
                            <div className="prediction-suggestion">
                                <div className="suggestion-item">
                                    <div className="suggestion-icon">⏰</div>
                                    <div className="suggestion-content">
                                        <div className="suggestion-title">最佳灌溉时间</div>
                                        <div className="suggestion-desc">
                                            建议在
                                            <span className="optimal-date" id="optimalDate">{formatDateToYYYYMMDD(optimalDate)}</span>
                                            <span className="optimal-time" id="optimalTime">{optimalTime}</span>
                                            进行灌溉，预计需水量为 <span className="water-amount" id="waterAmount">{waterAmount}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="suggestion-item">
                                    <div className="suggestion-icon">📊</div>
                                    <div className="suggestion-content">
                                        <div className="suggestion-title">预测依据</div>
                                        <div className="suggestion-desc" id="predictionReason">{predictionReason}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {predictionImage && (
                            <div className="panel-module">
                                <h3>后端预测可视化</h3>
                                <div className="prediction-image-container" style={{
                                    marginTop: '12px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: '1px solid #e0e0e0',
                                    backgroundColor: '#fff'
                                }}>
                                    <img
                                        src={predictionImage}
                                        alt="后端预测可视化图表"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block'
                                        }}
                                        onError={(e) => {
                                            console.error('图片加载失败:', predictionImage);
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">图片加载失败</div>';
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </aside>
                </main>
            )}

            {notification && (
                <div
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        background: notification.type === 'success' ? '#4caf50' : '#f44336',
                        color: '#ffffff',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        animation: 'slideIn 0.3s ease',
                        fontSize: '13px'
                    }}
                >
                    {notification.message}
                </div>
            )}
        </div>
    );
}

export default AppView;
