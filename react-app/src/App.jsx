import { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import {
    BUILTIN_DATASETS,
    DEFAULT_REASON,
    FARM_PLOTS,
    IRRIGATION_PRESCRIPTION,
    MODEL_INFO,
    MODEL_LIST,
    SOIL_PARAMS
} from './constants';
import {
    buildSeriesFromDataset,
    formatDateToYYYYMMDD,
    normalizePredictedSeries
} from './utils';
import { predictSoilMoisture } from './services/predictionApi';
import AppView from './components/AppView';

function getChartBounds(chartSeries) {
    const values = [...chartSeries.historical, ...chartSeries.predicted]
        .filter((value) => value !== null && Number.isFinite(value));

    if (!values.length) {
        return { min: 30, max: 50 };
    }

    return {
        min: Math.floor(Math.min(...values) - 3),
        max: Math.ceil(Math.max(...values) + 3)
    };
}

function buildChartConfig(chartSeries) {
    const labels = ['D-3', 'D-2', 'D-1', 'D', 'D+1', 'D+2', 'D+3'];
    const bounds = getChartBounds(chartSeries);

    return {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: '历史数据',
                    data: [...chartSeries.historical, null, null, null],
                    borderColor: '#38BD7E',
                    backgroundColor: 'rgba(56, 189, 126, 0.08)',
                    borderWidth: 3,
                    fill: true,
                    pointBackgroundColor: labels.map((_, index) => (
                        index === 3 ? '#F8FAFC' : '#38BD7E'
                    )),
                    pointBorderColor: labels.map((_, index) => (
                        index === 3 ? '#38BD7E' : '#0B1120'
                    )),
                    pointBorderWidth: labels.map((_, index) => (index === 3 ? 2.5 : 2)),
                    pointRadius: labels.map((_, index) => (index === 3 ? 5 : index < 4 ? 3 : 0)),
                    pointHoverRadius: labels.map((_, index) => (index === 3 ? 6 : 4)),
                    tension: 0.35,
                    spanGaps: false
                },
                {
                    label: '预测数据',
                    data: [null, null, null, ...chartSeries.predicted],
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.06)',
                    borderWidth: 3,
                    borderDash: [8, 6],
                    fill: true,
                    pointBackgroundColor: labels.map((_, index) => (
                        index >= 4 ? '#3B82F6' : 'transparent'
                    )),
                    pointBorderColor: labels.map((_, index) => (
                        index >= 4 ? '#E2E8F0' : 'transparent'
                    )),
                    pointBorderWidth: labels.map((_, index) => (index >= 4 ? 2 : 0)),
                    pointRadius: labels.map((_, index) => (index >= 4 ? 3 : 0)),
                    pointHoverRadius: labels.map((_, index) => (index >= 4 ? 4 : 0)),
                    tension: 0.35,
                    spanGaps: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#F1F5F9',
                    bodyColor: '#94A3B8',
                    borderColor: 'rgba(100, 116, 139, 0.2)',
                    borderWidth: 1,
                    callbacks: {
                        label: (context) => {
                            if (context.parsed.y === null) {
                                return `${context.dataset.label}: 无数据`;
                            }

                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: bounds.min,
                    max: bounds.max,
                    title: {
                        display: true,
                        text: '土壤湿度 (%)',
                        color: '#94A3B8'
                    },
                    grid: {
                        color: 'rgba(100, 116, 139, 0.06)'
                    },
                    ticks: {
                        color: '#475569',
                        callback: (value) => `${value}%`
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '时间 (天)',
                        color: '#94A3B8'
                    },
                    grid: {
                        color: 'rgba(100, 116, 139, 0.06)'
                    },
                    ticks: {
                        color: '#475569'
                    }
                }
            }
        }
    };
}

function App() {
    const [activeTab, setActiveTab] = useState('farm');
    const [viewMode, setViewMode] = useState('status');
    const [currentModel, setCurrentModel] = useState('lstm');
    const [currentDepth, setCurrentDepth] = useState('20');
    const [selectedDate, setSelectedDate] = useState('2021-08-15');
    const [selectedTime, setSelectedTime] = useState('14:00');
    const [predictionStatus, setPredictionStatus] = useState('ready');
    const [currentDataSource, setCurrentDataSource] = useState('summer2021');
    const [useUpload, setUseUpload] = useState(false);
    const [selectedFileInfo, setSelectedFileInfo] = useState(null);
    const [uploadedFileData, setUploadedFileData] = useState(null);
    const [lastPredictionData, setLastPredictionData] = useState(null);
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [predictionImage, setPredictionImage] = useState(null);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [gridScale, setGridScale] = useState(0.9);
    const [notification, setNotification] = useState(null);

    const [plotStates, setPlotStates] = useState(() => {
        const states = {};

        FARM_PLOTS.forEach((plotNumber) => {
            const params = SOIL_PARAMS[plotNumber];

            if (plotNumber === '4') {
                states[plotNumber] = 'completed';
            } else if (plotNumber === '9') {
                states[plotNumber] = 'irrigating';
            } else if (params && params.deficiency >= 52) {
                states[plotNumber] = 'need-irrigation';
            } else {
                states[plotNumber] = 'normal';
            }
        });

        return states;
    });

    const initialSeries = useMemo(() => buildSeriesFromDataset('summer2021'), []);
    const [chartSeries, setChartSeries] = useState({
        historical: initialSeries.historical,
        predicted: initialSeries.predicted
    });
    const [humidityStats, setHumidityStats] = useState(initialSeries.stats);
    const [waterAmount, setWaterAmount] = useState(initialSeries.waterAmount);
    const [predictionReason, setPredictionReason] = useState(initialSeries.reason);
    const [optimalDate, setOptimalDate] = useState(selectedDate);
    const [optimalTime, setOptimalTime] = useState(selectedTime);

    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const fileInputRef = useRef(null);
    const hasPredictionResults = predictionStatus !== 'ready' || Boolean(lastPredictionData);

    const currentModelInfo = useMemo(() => {
        const model = MODEL_LIST.find((item) => item.id === currentModel);
        const info = MODEL_INFO[currentModel];

        return {
            name: model?.name || 'LSTM',
            type: model?.type || '循环神经网络',
            accuracy: info?.accuracy || '92.5%',
            trainTime: info?.trainTime || '2024-01-15',
            source: info?.source || '传感器网络'
        };
    }, [currentModel]);

    useEffect(() => () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!chartRef.current || chartInstanceRef.current || !activeTab) {
            return;
        }

        const ctx = chartRef.current.getContext('2d');
        chartInstanceRef.current = new Chart(ctx, buildChartConfig(chartSeries));
    }, [activeTab, chartSeries, hasPredictionResults]);

    useEffect(() => {
        if (!chartInstanceRef.current) {
            return;
        }

        const bounds = getChartBounds(chartSeries);

        chartInstanceRef.current.data.datasets[0].data = [
            ...chartSeries.historical,
            null,
            null,
            null
        ];
        chartInstanceRef.current.data.datasets[1].data = [
            null,
            null,
            null,
            ...chartSeries.predicted
        ];
        chartInstanceRef.current.options.scales.y.min = bounds.min;
        chartInstanceRef.current.options.scales.y.max = bounds.max;
        chartInstanceRef.current.update();
    }, [chartSeries]);

    useEffect(() => {
        if (!useUpload) {
            const series = buildSeriesFromDataset(currentDataSource);
            setChartSeries({
                historical: series.historical,
                predicted: series.predicted
            });
            setHumidityStats(series.stats);
            setWaterAmount(series.waterAmount);
            setPredictionReason(series.reason);
        }
    }, [currentDataSource, useUpload]);

    useEffect(() => {
        setOptimalDate(selectedDate);
        setOptimalTime(selectedTime);
    }, [selectedDate, selectedTime]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        window.setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const handlePlotClick = (plotNumber) => {
        setSelectedPlot(plotNumber);
    };

    const handleTriggerIrrigation = (plotNumber) => {
        if (plotStates[plotNumber] !== 'need-irrigation') {
            return;
        }

        setPlotStates((prev) => ({
            ...prev,
            [plotNumber]: 'irrigating'
        }));
        showNotification(`地块 #${plotNumber} 已加入灌溉队列`, 'success');

        window.setTimeout(() => {
            setPlotStates((prev) => ({
                ...prev,
                [plotNumber]: 'completed'
            }));
        }, 2000);
    };

    const handleZoomIn = () => setGridScale((prev) => Math.min(prev + 0.1, 1.3));
    const handleZoomOut = () => setGridScale((prev) => Math.max(prev - 0.1, 0.6));

    const handleModelChange = (event) => {
        setCurrentModel(event.target.value);
    };

    const handleDepthChange = (event) => {
        setCurrentDepth(event.target.value);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
    };

    const handleDataSourceChange = (sourceId) => {
        const dateMap = {
            summer2021: '2021-08-15',
            winter2021: '2022-01-15',
            spring2022: '2022-04-15'
        };

        setCurrentDataSource(sourceId);
        setUseUpload(false);
        setSelectedFileInfo(null);
        setUploadedFileData(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        if (dateMap[sourceId]) {
            setSelectedDate(dateMap[sourceId]);
        }
    };

    const resetUploadStatus = () => {
        setUseUpload(false);
        setSelectedFileInfo(null);
        setUploadedFileData(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        const series = buildSeriesFromDataset(currentDataSource);
        setChartSeries({ historical: series.historical, predicted: series.predicted });
        setHumidityStats(series.stats);
        setWaterAmount(series.waterAmount);
        setPredictionReason(series.reason);
    };

    const parseCSV = (content) => {
        const lines = content.split('\n');
        const data = [];

        for (let i = 1; i < Math.min(lines.length, 8); i += 1) {
            const values = lines[i].split(',');
            if (values.length > 0 && values[0]) {
                data.push(Number.parseFloat(values[0]) || 0);
            }
        }

        while (data.length < 4) {
            data.push(data[data.length - 1] || 40);
        }

        const baseValue = data[3] || 40;
        return {
            historical: [baseValue + 5, baseValue + 3, baseValue + 1, baseValue],
            predicted: data.slice(3, 7)
        };
    };

    const parseJSON = (content) => {
        const jsonData = JSON.parse(content);
        const predictions = jsonData.predictions || jsonData.data || [];

        if (predictions.length >= 4) {
            const baseValue = predictions[0];
            return {
                historical: [baseValue + 5, baseValue + 3, baseValue + 1, baseValue],
                predicted: [
                    baseValue,
                    predictions[1] || baseValue - 2,
                    predictions[2] || baseValue - 4,
                    predictions[3] || baseValue - 6
                ]
            };
        }

        const fallback = 40 + (content.length % 20);
        return {
            historical: [fallback + 5, fallback + 3, fallback + 1, fallback],
            predicted: [fallback, fallback - 2, fallback - 4, fallback - 6]
        };
    };

    const updateStatisticsFromUploadedData = (data) => {
        const allData = [...data.historical, ...data.predicted];
        const validData = allData.filter((value) => value !== null && Number.isFinite(value));

        if (!validData.length) {
            return;
        }

        const currentHumidity = data.historical[3];

        setHumidityStats({
            current: currentHumidity,
            min: Math.min(...validData),
            max: Math.max(...validData)
        });
        setWaterAmount(`${((100 - currentHumidity) * 0.3).toFixed(1)}m³`);
    };

    const handleFiles = (file) => {
        const validTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/json'
        ];
        const validExtensions = ['.csv', '.xls', '.xlsx', '.json'];
        const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;

        if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
            showNotification('请选择 CSV、Excel 或 JSON 格式的文件', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showNotification('文件大小不能超过 10MB', 'error');
            return;
        }

        setUseUpload(true);
        setSelectedFileInfo({ name: file.name, size: file.size });

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target.result;
                let parsed;

                if (file.name.endsWith('.csv')) {
                    parsed = parseCSV(content);
                } else if (file.name.endsWith('.json')) {
                    parsed = parseJSON(content);
                } else {
                    const mockBase = 40 + (file.name.length % 20);
                    parsed = {
                        historical: [mockBase + 5, mockBase + 3, mockBase + 1, mockBase],
                        predicted: [mockBase, mockBase - 2, mockBase - 4, mockBase - 6]
                    };
                    showNotification('Excel 文件已加载为演示数据', 'success');
                }

                setUploadedFileData(parsed);
                setChartSeries(parsed);
                updateStatisticsFromUploadedData(parsed);
                showNotification('文件上传成功，数据已加载', 'success');
            } catch (error) {
                console.error('解析文件时出错:', error);
                showNotification('文件解析失败，请检查文件格式', 'error');
            }
        };

        reader.onerror = () => {
            showNotification('文件读取失败', 'error');
        };

        reader.readAsText(file, 'UTF-8');
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleFiles(file);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const file = event.dataTransfer.files[0];
        if (file) {
            handleFiles(file);
        }
    };

    const handlePrediction = async () => {
        setPredictionStatus('predicting');

        try {
            const payload = {
                model_id: currentModel,
                soil_depth: currentDepth,
                prediction_date: selectedDate,
                prediction_time: selectedTime,
                data_source: useUpload ? 'uploaded' : currentDataSource,
                uploaded_data: uploadedFileData
            };

            const result = await predictSoilMoisture(payload);
            const data = result.data || result;
            const optimalTimeValue = data.optimal_time || selectedTime;
            const optimalDateValue = data.optimal_date || selectedDate;
            const baseValue = chartSeries.historical[3] || 40;
            const predictionCurve = (
                data.prediction_curve ||
                data.predicted_values ||
                data.prediction
            );

            const predictedSeries = normalizePredictedSeries(predictionCurve, baseValue);

            setChartSeries({
                historical: chartSeries.historical,
                predicted: predictedSeries
            });
            setOptimalTime(optimalTimeValue);
            setOptimalDate(optimalDateValue);
            setWaterAmount(`${Number(data.water_amount || 15).toFixed(1)}m³`);

            const imageData = (
                data.image ||
                data.plot_image ||
                data.visualization ||
                data.chart_image ||
                data.prediction_plot
            );

            if (imageData) {
                if (imageData.startsWith('data:image')) {
                    setPredictionImage(imageData);
                } else if (
                    imageData.startsWith('http://') ||
                    imageData.startsWith('https://')
                ) {
                    setPredictionImage(imageData);
                } else {
                    setPredictionImage(`data:image/png;base64,${imageData}`);
                }
            } else {
                setPredictionImage(null);
            }

            setPredictionReason(data.reason || DEFAULT_REASON);
            setLastPredictionData(data);
            setPredictionStatus('completed');
            setShowExportOptions(true);
            showNotification('预测完成', 'success');
        } catch (error) {
            console.error('预测失败:', error);
            setPredictionStatus('ready');
            setShowExportOptions(false);
            showNotification('预测失败，请检查接口配置', 'error');
        }
    };

    const resetPrediction = () => {
        const defaultSource = 'summer2021';
        const series = buildSeriesFromDataset(defaultSource);

        setCurrentModel('lstm');
        setCurrentDepth('20');
        setSelectedDate('2021-08-15');
        setSelectedTime('14:00');
        setCurrentDataSource(defaultSource);
        setUseUpload(false);
        setSelectedFileInfo(null);
        setUploadedFileData(null);
        setPredictionStatus('ready');
        setShowExportOptions(false);
        setLastPredictionData(null);
        setPredictionImage(null);
        setChartSeries({ historical: series.historical, predicted: series.predicted });
        setHumidityStats(series.stats);
        setWaterAmount(series.waterAmount);
        setPredictionReason(series.reason);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const exportAsPNG = () => {
        if (!chartRef.current) {
            showNotification('没有可导出的预测图表', 'error');
            return;
        }

        const canvas = chartRef.current;
        const link = document.createElement('a');
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = 1200;
        exportCanvas.height = 800;
        const ctx = exportCanvas.getContext('2d');

        ctx.fillStyle = '#0B1120';
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

        ctx.fillStyle = '#F1F5F9';
        ctx.font = 'bold 28px Microsoft YaHei';
        ctx.textAlign = 'center';
        ctx.fillText('土壤湿度预测曲线', exportCanvas.width / 2, 60);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '18px Microsoft YaHei';
        ctx.fillText(
            `预测模型：${currentModelInfo.name} | 土壤深度：${currentDepth}cm | 预测时间：${formatDateToYYYYMMDD(optimalDate)} ${optimalTime}`,
            exportCanvas.width / 2,
            100
        );

        const chartImg = new Image();
        chartImg.onload = () => {
            ctx.drawImage(chartImg, 50, 150, 1100, 500);
            ctx.font = '16px Microsoft YaHei';
            ctx.fillStyle = '#94A3B8';
            ctx.textAlign = 'left';
            ctx.fillText(`导出时间：${new Date().toLocaleString('zh-CN')}`, 50, 700);
            ctx.textAlign = 'right';
            ctx.fillText('智慧农业灌溉平台', exportCanvas.width - 50, 700);

            const dataURL = exportCanvas.toDataURL('image/png');
            link.download = `土壤湿度预测_${currentModelInfo.name}_${formatDateToYYYYMMDD(optimalDate).replace(/\//g, '-')}_${optimalTime}.png`;
            link.href = dataURL;
            link.click();

            showNotification('PNG 图片导出成功', 'success');
        };

        chartImg.src = canvas.toDataURL('image/png', 1.0);
    };

    const exportAsPDF = () => {
        if (!chartRef.current) {
            showNotification('没有可导出的预测图表', 'error');
            return;
        }

        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(11, 17, 32);
        doc.text('土壤湿度预测报告', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(71, 85, 105);
        doc.text(`预测模型：${currentModelInfo.name}`, 20, 35);
        doc.text(`土壤深度：${currentDepth}cm`, 20, 42);
        doc.text(`预测时间：${formatDateToYYYYMMDD(optimalDate)} ${optimalTime}`, 20, 49);
        doc.text(`建议需水量：${waterAmount}`, 20, 56);

        const chartImage = chartRef.current.toDataURL('image/jpeg', 1.0);
        doc.addImage(chartImage, 'JPEG', 20, 65, 170, 80);

        doc.setFontSize(14);
        doc.setTextColor(56, 189, 126);
        doc.text('预测建议', 20, 155);

        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        const splitReason = doc.splitTextToSize(predictionReason, 170);
        doc.text(splitReason, 20, 165);

        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`导出时间：${new Date().toLocaleString('zh-CN')}`, 20, 280);
        doc.text('智慧农业灌溉平台', 180, 280, { align: 'right' });

        doc.save(`土壤湿度预测报告_${currentModelInfo.name}_${formatDateToYYYYMMDD(optimalDate).replace(/\//g, '-')}.pdf`);
        showNotification('PDF 文件导出成功', 'success');
    };

    const exportAsExcel = () => {
        if (!lastPredictionData || !chartInstanceRef.current) {
            showNotification('没有可导出的预测数据', 'error');
            return;
        }

        let csvContent = '\uFEFF';
        csvContent += '土壤湿度预测数据报告\r\n\r\n';
        csvContent += `预测模型,${currentModelInfo.name}\r\n`;
        csvContent += `土壤深度,${currentDepth}cm\r\n`;
        csvContent += `预测日期,${formatDateToYYYYMMDD(optimalDate)}\r\n`;
        csvContent += `预测时间,${optimalTime}\r\n`;
        csvContent += `建议需水量,${waterAmount}\r\n`;
        csvContent += `预测依据,${predictionReason}\r\n`;
        csvContent += `导出时间,${new Date().toLocaleString('zh-CN')}\r\n\r\n`;
        csvContent += '时间点,历史数据(%),预测数据(%)\r\n';

        const labels = ['D-3', 'D-2', 'D-1', 'D', 'D+1', 'D+2', 'D+3'];
        const historicalData = chartInstanceRef.current.data.datasets[0].data;
        const predictedData = chartInstanceRef.current.data.datasets[1].data;

        labels.forEach((label, index) => {
            const historical = historicalData[index] !== null
                ? Number(historicalData[index]).toFixed(1)
                : '--';
            const predicted = predictedData[index] !== null
                ? Number(predictedData[index]).toFixed(1)
                : '--';

            csvContent += `${label},${historical},${predicted}\r\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `土壤湿度预测数据_${currentModelInfo.name}_${formatDateToYYYYMMDD(optimalDate).replace(/\//g, '-')}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('Excel(CSV) 文件导出成功', 'success');
    };

    const predictionStatusText = {
        ready: '准备就绪',
        predicting: '预测中',
        completed: '预测完成'
    };

    const gridTransform = `rotateX(60deg) rotateZ(-45deg) scale(${gridScale})`;
    const soilParams = selectedPlot ? SOIL_PARAMS[selectedPlot] : null;

    return (
        <AppView
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            viewMode={viewMode}
            setViewMode={setViewMode}
            currentModel={currentModel}
            currentDepth={currentDepth}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            predictionStatus={predictionStatus}
            currentDataSource={currentDataSource}
            useUpload={useUpload}
            selectedFileInfo={selectedFileInfo}
            showExportOptions={showExportOptions}
            selectedPlot={selectedPlot}
            gridTransform={gridTransform}
            notification={notification}
            plotStates={plotStates}
            optimalDate={optimalDate}
            optimalTime={optimalTime}
            humidityStats={humidityStats}
            waterAmount={waterAmount}
            predictionReason={predictionReason}
            predictionImage={predictionImage}
            currentModelInfo={currentModelInfo}
            predictionStatusText={predictionStatusText}
            soilParams={soilParams}
            chartRef={chartRef}
            fileInputRef={fileInputRef}
            handlePlotClick={handlePlotClick}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleModelChange={handleModelChange}
            handleDepthChange={handleDepthChange}
            handleDateChange={handleDateChange}
            handleTimeChange={handleTimeChange}
            handleDataSourceChange={handleDataSourceChange}
            handleFileSelect={handleFileSelect}
            handleDrop={handleDrop}
            handlePrediction={handlePrediction}
            resetPrediction={resetPrediction}
            resetUploadStatus={resetUploadStatus}
            exportAsPNG={exportAsPNG}
            exportAsPDF={exportAsPDF}
            exportAsExcel={exportAsExcel}
            handleTriggerIrrigation={handleTriggerIrrigation}
            hasPredictionResults={hasPredictionResults}
        />
    );
}

export default App;
