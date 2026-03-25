import {
    BUILTIN_DATASETS,
    IRRIGATION_PRESCRIPTION,
    MODEL_LIST,
    SOIL_PARAMS
} from '../constants';
import { formatDateToYYYYMMDD } from '../utils';
import IrrigationHeatmap from './IrrigationHeatmap';
import IrrigationSidebar from './IrrigationSidebar';
import ViewModeToggle from './ViewModeToggle';

function AppView(props) {
    const {
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        currentModel,
        currentDepth,
        selectedDate,
        selectedTime,
        predictionStatus,
        currentDataSource,
        useUpload,
        selectedFileInfo,
        showExportOptions,
        selectedPlot,
        gridTransform,
        notification,
        plotStates,
        optimalDate,
        optimalTime,
        humidityStats,
        waterAmount,
        predictionReason,
        predictionImage,
        currentModelInfo,
        predictionStatusText,
        soilParams,
        chartRef,
        fileInputRef,
        handlePlotClick,
        handleZoomIn,
        handleZoomOut,
        handleModelChange,
        handleDepthChange,
        handleDateChange,
        handleTimeChange,
        handleDataSourceChange,
        handleFileSelect,
        handleDrop,
        handlePrediction,
        resetPrediction,
        resetUploadStatus,
        exportAsPNG,
        exportAsPDF,
        exportAsExcel,
        handleTriggerIrrigation,
        hasPredictionResults
    } = props;

    const totalPlots = Object.keys(plotStates).length;
    const needIrrigationCount = Object.values(plotStates).filter(
        (state) => state === 'need-irrigation'
    ).length;
    const irrigatingCount = Object.values(plotStates).filter(
        (state) => state === 'irrigating'
    ).length;
    const completedCount = Object.values(plotStates).filter(
        (state) => state === 'completed'
    ).length;
    const actionableCount = needIrrigationCount + irrigatingCount + completedCount;
    const progress = actionableCount
        ? Math.round(((completedCount + irrigatingCount * 0.6) / actionableCount) * 100)
        : 100;

    const queueColumns = [
        { title: '等待', state: 'need-irrigation' },
        { title: '进行中', state: 'irrigating' },
        { title: '完成', state: 'completed' }
    ];

    const alertList = Object.entries(SOIL_PARAMS)
        .filter(([, params]) => params.deficiency >= 40)
        .sort(([, a], [, b]) => b.deficiency - a.deficiency)
        .slice(0, 4)
        .map(([plotNumber, params]) => ({
            plotNumber,
            severity: params.deficiency >= 65 ? 'critical' : 'warning',
            message: params.deficiency >= 65 ? '根层严重失墒' : '含水率持续偏低',
            humidity: params.humidity
        }));

    const irrigationEntries = Object.entries(IRRIGATION_PRESCRIPTION)
        .map(([plotNumber, item]) => ({
            plotNumber,
            ...item
        }))
        .sort((a, b) => b.water - a.water);

    const totalWater = irrigationEntries.reduce((sum, item) => sum + item.water, 0);
    const selectedPrescription = selectedPlot ? IRRIGATION_PRESCRIPTION[selectedPlot] : null;
    const runButtonText = predictionStatus === 'completed'
        ? '重新预测'
        : predictionStatus === 'predicting'
            ? '预测中...'
            : '运行预测';

    return (
        <div className="app-shell">
            <header className="top-nav">
                <div className="nav-brand">
                    <div className="brand-mark">A</div>
                    <div>
                        <p className="eyebrow">AgriSense</p>
                        <h1>智慧农业灌溉平台</h1>
                    </div>
                </div>

                <div className="nav-tabs">
                    <button
                        className={`nav-tab ${activeTab === 'farm' ? 'active' : ''}`}
                        onClick={() => setActiveTab('farm')}
                        type="button"
                    >
                        农田视图
                    </button>
                    <button
                        className={`nav-tab ${activeTab === 'prediction' ? 'active' : ''}`}
                        onClick={() => setActiveTab('prediction')}
                        type="button"
                    >
                        预测分析
                    </button>
                </div>

                <div className="weather-pill">
                    <span>晴 24°C</span>
                    <small>北风 3.2 km/h</small>
                </div>
            </header>

            {activeTab === 'farm' && (
                <main className="page-shell farm-page">
                    <section className="farm-layout">
                        <div className="farm-main">
                            <div className="section-header">
                                <div>
                                    <p className="eyebrow">Overview</p>
                                    <h2>农田总览</h2>
                                </div>
                                <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
                            </div>

                            <IrrigationHeatmap
                                viewMode={viewMode}
                                plotStates={plotStates}
                                selectedPlot={selectedPlot}
                                gridTransform={gridTransform}
                                onPlotSelect={handlePlotClick}
                                onZoomIn={handleZoomIn}
                                onZoomOut={handleZoomOut}
                            />

                            <div className="stats-strip">
                                <div className="metric-card">
                                    <span className="metric-label">总地块</span>
                                    <strong className="metric-value">{totalPlots}</strong>
                                </div>
                                <div className="metric-card accent-red">
                                    <span className="metric-label">需灌溉</span>
                                    <strong className="metric-value">{needIrrigationCount}</strong>
                                </div>
                                <div className="metric-card accent-blue">
                                    <span className="metric-label">灌溉中</span>
                                    <strong className="metric-value">{irrigatingCount}</strong>
                                </div>
                                <div className="metric-card accent-green">
                                    <span className="metric-label">今日进度</span>
                                    <strong className="metric-value">{progress}%</strong>
                                </div>
                            </div>
                        </div>

                        <aside className="sidebar-panel">
                            {viewMode === 'status' ? (
                                <div className="sidebar-stack">
                                    <section className="sidebar-card">
                                        <div className="sidebar-card-header">
                                            <div>
                                                <p className="eyebrow">Plot Details</p>
                                                <h3>
                                                    {selectedPlot ? `地块 #${selectedPlot}` : '土壤参数'}
                                                </h3>
                                            </div>
                                        </div>
                                        {selectedPlot && soilParams ? (
                                            <>
                                                <div className="detail-grid">
                                                    <div className="detail-cell">
                                                        <span>湿度</span>
                                                        <strong>{soilParams.humidity}%</strong>
                                                    </div>
                                                    <div className="detail-cell">
                                                        <span>温度</span>
                                                        <strong>{soilParams.temperature.toFixed(1)}°C</strong>
                                                    </div>
                                                    <div className="detail-cell">
                                                        <span>pH</span>
                                                        <strong>{soilParams.ph.toFixed(1)}</strong>
                                                    </div>
                                                    <div className="detail-cell">
                                                        <span>氮含量</span>
                                                        <strong>{soilParams.nitrogen} mg/kg</strong>
                                                    </div>
                                                </div>
                                                <p className="detail-note">
                                                    缺水度 {soilParams.deficiency}%。
                                                    {plotStates[selectedPlot] === 'need-irrigation'
                                                        ? ' 当前建议立即执行补水。'
                                                        : ' 当前状态已同步到灌溉队列。'}
                                                </p>
                                                {plotStates[selectedPlot] === 'need-irrigation' && (
                                                    <button
                                                        className="primary-button full-width"
                                                        onClick={() => handleTriggerIrrigation(selectedPlot)}
                                                        type="button"
                                                    >
                                                        触发灌溉
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <div className="empty-mini">
                                                点击地图中的任意地块查看 2x2 土壤参数卡片。
                                            </div>
                                        )}
                                    </section>

                                    <section className="sidebar-card">
                                        <div className="sidebar-card-header">
                                            <div>
                                                <p className="eyebrow">Queue</p>
                                                <h3>灌溉队列</h3>
                                            </div>
                                        </div>
                                        <div className="queue-columns">
                                            {queueColumns.map((column) => {
                                                const items = Object.entries(plotStates)
                                                    .filter(([, state]) => state === column.state)
                                                    .map(([plotNumber]) => plotNumber)
                                                    .slice(0, 4);

                                                return (
                                                    <div className="queue-column" key={column.state}>
                                                        <span className="queue-title">{column.title}</span>
                                                        {items.length ? (
                                                            items.map((plotNumber) => (
                                                                <div className="queue-chip" key={plotNumber}>
                                                                    地块 #{plotNumber}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="queue-chip muted">暂无</div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>

                                    <section className="sidebar-card">
                                        <div className="sidebar-card-header">
                                            <div>
                                                <p className="eyebrow">Alerts</p>
                                                <h3>告警列表</h3>
                                            </div>
                                        </div>
                                        <div className="alert-list">
                                            {alertList.map((alert) => (
                                                <div
                                                    className={`alert-row ${alert.severity}`}
                                                    key={alert.plotNumber}
                                                >
                                                    <strong>#{alert.plotNumber}</strong>
                                                    <span>{alert.message}</span>
                                                    <small>湿度 {alert.humidity}%</small>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            ) : (
                                <IrrigationSidebar
                                    selectedPlot={selectedPlot}
                                    selectedPrescription={selectedPrescription}
                                    irrigationEntries={irrigationEntries.slice(0, 8)}
                                    totalWater={totalWater}
                                />
                            )}
                        </aside>
                    </section>
                </main>
            )}

            {activeTab === 'prediction' && (
                <main className="page-shell prediction-page">
                    <section className="prediction-stack">
                        <section className="config-card">
                            <div className="section-header compact">
                                <div>
                                    <p className="eyebrow">Prediction Setup</p>
                                    <h2>预测分析</h2>
                                </div>
                                <span className={`status-pill ${predictionStatus}`}>
                                    {predictionStatusText[predictionStatus]}
                                </span>
                            </div>

                            <div className="config-grid">
                                <label className="field">
                                    <span>预测模型</span>
                                    <select value={currentModel} onChange={handleModelChange}>
                                        {MODEL_LIST.map((model) => (
                                            <option key={model.id} value={model.id}>
                                                {model.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="field">
                                    <span>土壤深度</span>
                                    <select value={currentDepth} onChange={handleDepthChange}>
                                        <option value="10">10cm</option>
                                        <option value="20">20cm</option>
                                        <option value="30">30cm</option>
                                        <option value="40">40cm</option>
                                    </select>
                                </label>

                                <label className="field">
                                    <span>预测日期</span>
                                    <input type="date" value={selectedDate} onChange={handleDateChange} />
                                </label>

                                <label className="field">
                                    <span>预测时间</span>
                                    <input type="time" value={selectedTime} onChange={handleTimeChange} />
                                </label>

                                <label className="field">
                                    <span>数据源</span>
                                    <select
                                        value={currentDataSource}
                                        onChange={(event) => handleDataSourceChange(event.target.value)}
                                        disabled={useUpload}
                                    >
                                        {Object.entries(BUILTIN_DATASETS).map(([key, dataset]) => (
                                            <option key={key} value={key}>
                                                {dataset.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <div className="button-cluster">
                                    <button
                                        className={`primary-button ${predictionStatus}`}
                                        onClick={handlePrediction}
                                        type="button"
                                        disabled={predictionStatus === 'predicting'}
                                    >
                                        {predictionStatus === 'predicting' && (
                                            <span className="button-spinner" />
                                        )}
                                        {runButtonText}
                                    </button>
                                    <button
                                        className="secondary-button"
                                        onClick={resetPrediction}
                                        type="button"
                                    >
                                        重置
                                    </button>
                                </div>
                            </div>

                            <div className="upload-inline">
                                <span className="upload-copy">或上传文件:</span>
                                <div
                                    className={`upload-dropzone ${useUpload ? 'uploaded' : ''}`}
                                    onDragEnter={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }}
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        event.currentTarget.classList.add('dragging');
                                    }}
                                    onDragLeave={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        event.currentTarget.classList.remove('dragging');
                                    }}
                                    onDrop={(event) => {
                                        event.currentTarget.classList.remove('dragging');
                                        handleDrop(event);
                                    }}
                                    onClick={() => fileInputRef.current?.click()}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            fileInputRef.current?.click();
                                        }
                                    }}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv,.xlsx,.xls,.json"
                                        onChange={handleFileSelect}
                                        hidden
                                    />
                                    <div>
                                        <strong>
                                            {selectedFileInfo ? selectedFileInfo.name : '拖拽或点击上传'}
                                        </strong>
                                        <p>
                                            {selectedFileInfo
                                                ? `已切换为上传数据 | ${(selectedFileInfo.size / 1024).toFixed(1)} KB`
                                                : '支持 CSV / Excel / JSON，最大 10MB'}
                                        </p>
                                    </div>
                                    {selectedFileInfo && (
                                        <button
                                            className="ghost-button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                resetUploadStatus();
                                            }}
                                            type="button"
                                        >
                                            清除
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>

                        {!hasPredictionResults ? (
                            <section className="empty-state-card">
                                <div className="empty-state-box">
                                    <strong>运行预测后查看结果</strong>
                                    <p>图表、统计卡片、预测依据和后端图片会在这里展开。</p>
                                </div>
                            </section>
                        ) : (
                            <section className="results-stack">
                                <div className="results-grid">
                                    <section className="chart-card">
                                        <div className="chart-card-header">
                                            <div>
                                                <p className="eyebrow">Forecast Chart</p>
                                                <h3>土壤湿度预测曲线</h3>
                                            </div>
                                            <div className="chart-meta">
                                                <span>{currentModelInfo.name}</span>
                                                <span>{currentDepth}cm</span>
                                                <span>{selectedTime}</span>
                                            </div>
                                        </div>
                                        <div className="html-legend">
                                            <div className="legend-line">
                                                <span className="legend-line-swatch historical" />
                                                绿色实线 · 历史数据
                                            </div>
                                            <div className="legend-line">
                                                <span className="legend-line-swatch predicted" />
                                                蓝色虚线 · 预测数据
                                            </div>
                                        </div>
                                        <div className="chart-canvas-wrap">
                                            <canvas ref={chartRef} />
                                        </div>
                                    </section>

                                    <aside className="stats-rail">
                                        <div className="rail-card emphasis">
                                            <span>当前湿度</span>
                                            <strong>{Number(humidityStats.current).toFixed(1)}%</strong>
                                        </div>
                                        <div className="rail-grid">
                                            <div className="rail-card">
                                                <span>最低</span>
                                                <strong>{Number(humidityStats.min).toFixed(1)}%</strong>
                                            </div>
                                            <div className="rail-card">
                                                <span>最高</span>
                                                <strong>{Number(humidityStats.max).toFixed(1)}%</strong>
                                            </div>
                                        </div>
                                        <div className="rail-card emphasis">
                                            <span>建议需水量</span>
                                            <strong>{waterAmount}</strong>
                                        </div>
                                        <div className="rail-card">
                                            <span>最佳灌溉时间</span>
                                            <strong>{optimalTime}</strong>
                                            <small>{formatDateToYYYYMMDD(optimalDate)}</small>
                                        </div>
                                    </aside>
                                </div>

                                <div className="detail-panels">
                                    <section className="detail-panel">
                                        <p className="eyebrow">Reasoning</p>
                                        <h3>预测依据</h3>
                                        <p>{predictionReason}</p>
                                    </section>

                                    <section className="detail-panel">
                                        <p className="eyebrow">Model Details</p>
                                        <h3>模型详情</h3>
                                        <dl className="model-detail-list">
                                            <div>
                                                <dt>类型</dt>
                                                <dd>{currentModelInfo.type}</dd>
                                            </div>
                                            <div>
                                                <dt>训练时间</dt>
                                                <dd>{currentModelInfo.trainTime}</dd>
                                            </div>
                                            <div>
                                                <dt>数据来源</dt>
                                                <dd>{currentModelInfo.source}</dd>
                                            </div>
                                        </dl>
                                    </section>
                                </div>

                                <section className="detail-panel image-panel">
                                    <div className="image-panel-header">
                                        <div>
                                            <p className="eyebrow">Backend Visualization</p>
                                            <h3>后端图片区</h3>
                                        </div>
                                    </div>
                                    {predictionImage ? (
                                        <img src={predictionImage} alt="后端预测图" className="prediction-image" />
                                    ) : (
                                        <div className="image-placeholder">等待预测运行</div>
                                    )}
                                </section>

                                {showExportOptions && (
                                    <div className="export-footer">
                                        <details className="export-menu">
                                            <summary>导出结果</summary>
                                            <button onClick={exportAsPNG} type="button">PNG</button>
                                            <button onClick={exportAsPDF} type="button">PDF</button>
                                            <button onClick={exportAsExcel} type="button">Excel</button>
                                        </details>
                                    </div>
                                )}
                            </section>
                        )}
                    </section>
                </main>
            )}

            {notification && (
                <div className={`toast ${notification.type}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
}

export default AppView;
