import { FARM_PLOTS, IRRIGATION_PRESCRIPTION } from '../constants';
import { getColorByWater } from '../utils';

const STATUS_STYLE_MAP = {
    normal: {
        fill: 'var(--plot-normal)',
        stroke: 'rgba(56, 189, 126, 0.4)',
        label: '正常'
    },
    'need-irrigation': {
        fill: 'var(--plot-need-irrigation)',
        stroke: 'rgba(239, 68, 68, 0.6)',
        label: '需灌溉'
    },
    irrigating: {
        fill: 'var(--plot-irrigating)',
        stroke: 'rgba(59, 130, 246, 0.7)',
        label: '灌溉中'
    },
    completed: {
        fill: 'rgba(20, 83, 45, 0.88)',
        stroke: 'rgba(56, 189, 126, 0.6)',
        label: '已完成'
    }
};

function IrrigationHeatmap({
    viewMode,
    plotStates,
    selectedPlot,
    gridTransform,
    onPlotSelect,
    onZoomIn,
    onZoomOut
}) {
    const renderLegend = () => {
        if (viewMode === 'irrigation') {
            return (
                <div className="map-legend heatmap">
                    <div className="legend-heading">需水强度</div>
                    <div className="legend-gradient" />
                    <div className="legend-scale">
                        <span>低</span>
                        <span>高</span>
                    </div>
                </div>
            );
        }

        return (
            <div className="map-legend status">
                {Object.entries(STATUS_STYLE_MAP).map(([key, config]) => (
                    <div className="legend-row" key={key}>
                        <span
                            className="legend-swatch"
                            style={{ background: config.fill, borderColor: config.stroke }}
                        />
                        <span>{config.label}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <section className="map-card">
            <div className="map-card-top">
                <div>
                    <p className="eyebrow">Farm View</p>
                    <h2>农田总览</h2>
                </div>
                {renderLegend()}
            </div>

            <div className="map-stage">
                <div className="map-grid" style={{ transform: gridTransform }}>
                    {FARM_PLOTS.map((plotNumber) => {
                        const state = plotStates[plotNumber];
                        const prescription = IRRIGATION_PRESCRIPTION[plotNumber];
                        const statusStyle = STATUS_STYLE_MAP[state] || STATUS_STYLE_MAP.normal;
                        const irrigationStyle = getColorByWater(prescription.water);
                        const currentStyle = viewMode === 'irrigation' ? irrigationStyle : statusStyle;
                        const isSelected = selectedPlot === plotNumber;

                        return (
                            <button
                                key={plotNumber}
                                className={[
                                    'plot-tile',
                                    `plot-${state}`,
                                    viewMode === 'irrigation' ? 'irrigation-mode' : 'status-mode',
                                    isSelected ? 'selected' : ''
                                ].join(' ')}
                                style={{
                                    background: currentStyle.fill,
                                    borderColor: currentStyle.stroke
                                }}
                                type="button"
                                onClick={() => onPlotSelect(plotNumber)}
                            >
                                <span className="plot-id">#{plotNumber}</span>
                                {viewMode === 'irrigation' ? (
                                    <>
                                        <span className="plot-metric">
                                            {prescription.water.toFixed(2)}L
                                        </span>
                                        {prescription.water >= 0.7 && (
                                            <span className="plot-badge">优先</span>
                                        )}
                                    </>
                                ) : (
                                    <span className="plot-status-text">{statusStyle.label}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="map-zoom-controls">
                    <button onClick={onZoomIn} type="button" aria-label="放大地图">+</button>
                    <button onClick={onZoomOut} type="button" aria-label="缩小地图">-</button>
                </div>
            </div>
        </section>
    );
}

export default IrrigationHeatmap;
